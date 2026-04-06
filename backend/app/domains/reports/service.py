from __future__ import annotations

from sqlalchemy.orm import Session

from app.domains.analysis.schemas import RegionAnalysisRead
from app.domains.planning.schemas import CityPlanRead, ScoreCardRead
from app.domains.planning.service import PlanningService
from app.domains.reports.models import AIReport
from app.domains.reports.prompt_builder import ReportPromptBuilder
from app.domains.reports.repository import ReportRepository
from app.domains.reports.schemas import AIReportRead
from app.domains.scenarios.schemas import PlanScenarioRead
from app.domains.scenarios.service import ScenarioService
from app.domains.sessions.repository import PlanningSessionRepository
from app.domains.sessions.schemas import MissionBriefRead, PlanningSessionRead


class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ReportRepository(db)
        self.session_repository = PlanningSessionRepository(db)
        self.planning_service = PlanningService(db)
        self.scenario_service = ScenarioService(db)
        self.prompt_builder = ReportPromptBuilder()

    def generate_report(self, session_id: str) -> AIReportRead | None:
        session_model = self.session_repository.get(session_id)
        if session_model is None:
            return None

        if session_model.analysis is None or session_model.city_plan is None or session_model.score_card is None:
            self.planning_service.generate_plan(session_id)
            session_model = self.session_repository.get(session_id)
            if session_model is None:
                return None

        if not session_model.scenarios:
            self.scenario_service.generate_scenarios(session_id)
            session_model = self.session_repository.get(session_id)
            if session_model is None:
                return None

        if session_model.analysis is None or session_model.city_plan is None or session_model.score_card is None:
            return None

        session = PlanningSessionRead.model_validate(session_model)
        mission_brief = (
            MissionBriefRead.model_validate(session_model.mission_brief) if session_model.mission_brief else None
        )
        analysis = RegionAnalysisRead.model_validate(session_model.analysis)
        plan = CityPlanRead.model_validate(session_model.city_plan)
        score_card = ScoreCardRead.model_validate(session_model.score_card)
        scenarios = [PlanScenarioRead.model_validate(item) for item in session_model.scenarios]

        estimated_cost = self._build_cost_estimate(session, plan, score_card, analysis)
        sections = self._build_sections(session, mission_brief, analysis, plan, score_card, scenarios, estimated_cost)
        topic_briefs = self._build_topic_briefs(session, mission_brief, analysis, score_card, estimated_cost)
        payload = self.prompt_builder.build_payload(
            session,
            mission_brief,
            analysis,
            plan,
            score_card,
            scenarios,
            sections,
            topic_briefs,
            estimated_cost,
        )
        executive_summary = self._build_executive_summary(session, analysis, score_card)
        technical_summary = self._build_technical_summary(analysis, plan, score_card, estimated_cost)
        next_actions = self._build_next_actions(plan, analysis, score_card)

        existing = self.repository.get_by_session_id(session_id)
        if existing is None:
            existing = AIReport(
                session_id=session_id,
                executive_summary=executive_summary,
                technical_summary=technical_summary,
                next_actions=next_actions,
                report_payload=payload,
            )
        else:
            existing.executive_summary = executive_summary
            existing.technical_summary = technical_summary
            existing.next_actions = next_actions
            existing.report_payload = payload

        saved = self.repository.save(existing)
        session_model.status = "report_ready"
        self.session_repository.save(session_model)
        return AIReportRead.model_validate(saved)

    def _build_executive_summary(
        self,
        session: PlanningSessionRead,
        analysis: RegionAnalysisRead,
        score_card: ScoreCardRead,
    ) -> str:
        return (
            f"Seçilen saha, {analysis.site_suitability_score} saha uygunluğu ve {score_card.resource_access_score} kaynak erişim "
            f"skoru ile {session.crew_size} kişilik ekibin {session.mission_duration_months} aylık görev profiline uyum sağlıyor. "
            "Raporda öncelik; kutup veya yüksek enlem buz erişimi, yer altı koruması, ISRU bağımsızlığı ve insan hatasını azaltan "
            f"operasyon mimarisidir. Genel hayatta kalma güveni {score_card.survival_confidence} seviyesindedir."
        )

    def _build_technical_summary(
        self,
        analysis: RegionAnalysisRead,
        plan: CityPlanRead,
        score_card: ScoreCardRead,
        estimated_cost: dict[str, float | int | str],
    ) -> str:
        return (
            f"Teknik çerçeve; risk indeksi {analysis.risk_index}, lojistik skoru {analysis.logistics_score}, "
            f"genişleme skoru {analysis.expansion_score}, otonomi skoru {score_card.autonomy_score} ve sürdürülebilirlik skoru "
            f"{score_card.sustainability_score} etrafında kuruldu. Plan toplam {len(plan.modules)} modül ve {len(plan.phases)} faz içeriyor. "
            f"Tahmini toplam program maliyeti {estimated_cost['total_program_musd']} MUSD; bunun {estimated_cost['isru_musd']} MUSD kısmı "
            f"ISRU, {estimated_cost['shielding_musd']} MUSD kısmı yer altı koruması ve radyasyon kalkanı, "
            f"{estimated_cost['operations_musd']} MUSD kısmı operasyonel tüketim için ayrıldı."
        )

    def _build_next_actions(
        self,
        plan: CityPlanRead,
        analysis: RegionAnalysisRead,
        score_card: ScoreCardRead,
    ) -> list[str]:
        actions = list(plan.top_recommendations)
        actions.append("Kutup veya yüksek enlem sahasında buz çıkarımı için öncül sondaj ve termal profil doğrulaması yap.")
        actions.append("Yaşam çekirdeğini yüzey yerine yarı gömülü veya kazılmış yer altı galerisinde konumlandıran mimariyi baz senaryo yap.")
        actions.append("İnsan hatasını azaltmak için kritik komutlarda çift onay, prosedür kilidi ve AI karar destek akışı kur.")
        if analysis.risk_index >= 35:
            actions.append("Güneş parçacık olayı ve toz haftası birleşik senaryosunda 72 saatlik sığınak bağımsızlığını test et.")
        if score_card.resource_access_score >= 75:
            actions.append("ISRU su, oksijen ve regolit işleme hattını Faz II yerine kısmi olarak Faz I sonuna çek.")
        else:
            actions.append("Su geri kazanımını agresif moda alıp ilk iki fazda Dünya'dan taşınan rezervi yüksek tut.")
        return list(dict.fromkeys(actions))[:7]

    def _build_cost_estimate(
        self,
        session: PlanningSessionRead,
        plan: CityPlanRead,
        score_card: ScoreCardRead,
        analysis: RegionAnalysisRead,
    ) -> dict[str, float | int | str]:
        module_cost = len(plan.modules) * 28
        crew_logistics = session.crew_size * 14
        duration_support = session.mission_duration_months * 4.6
        shielding_cost = round(110 + max(0, analysis.risk_index - 30) * 1.8)
        isru_cost = round(95 + max(0, score_card.resource_access_score - 60) * 1.2)
        autonomy_cost = round(42 + max(0, score_card.autonomy_score - 55) * 0.8)
        medical_cost = round(36 + session.crew_size * 1.1)
        total_program = round(
            780
            + module_cost
            + crew_logistics
            + duration_support
            + shielding_cost
            + isru_cost
            + autonomy_cost
            + medical_cost
        )
        contingency = round(total_program * 0.19)

        return {
            "currency": "MUSD",
            "base_infrastructure_musd": round(780 + module_cost + shielding_cost + isru_cost + autonomy_cost),
            "operations_musd": round(crew_logistics + duration_support + medical_cost),
            "shielding_musd": shielding_cost,
            "isru_musd": isru_cost,
            "autonomy_musd": autonomy_cost,
            "medical_biosecurity_musd": medical_cost,
            "contingency_musd": contingency,
            "total_program_musd": total_program + contingency,
        }

    def _build_topic_briefs(
        self,
        session: PlanningSessionRead,
        mission_brief: MissionBriefRead | None,
        analysis: RegionAnalysisRead,
        score_card: ScoreCardRead,
        estimated_cost: dict[str, float | int | str],
    ) -> list[dict[str, str]]:
        autonomy_level = mission_brief.autonomy_level if mission_brief and mission_brief.autonomy_level else 70
        robot_count = mission_brief.robot_count if mission_brief and mission_brief.robot_count else max(8, round(session.crew_size / 3))
        habitat_type = mission_brief.habitat_type if mission_brief and mission_brief.habitat_type else "buried_modular"
        energy_strategy = (
            mission_brief.energy_strategy if mission_brief and mission_brief.energy_strategy else "solar_nuclear_hybrid"
        )
        water_strategy = (
            mission_brief.water_strategy if mission_brief and mission_brief.water_strategy else "ice_extraction_plus_recycling"
        )

        return [
            {
                "title": "Uzay yolculugu tehlikeleri",
                "severity": "kritik",
                "problem": "Agirliksizlik, radyasyon, dar alan stresi ve biyolojik bulasma ayni transit zincirinde birikiyor.",
                "solution": (
                    f"Direnc egzersizi, dozimetre takibi, karantina protokolu ve gorev ici psikolojik destek ile {session.mission_duration_months} "
                    "aylik profile gore transit paketi baz alinmis durumda."
                ),
            },
            {
                "title": "Psikolojik saglik ve ic guvenlik",
                "severity": "kritik",
                "problem": "Dar hacimde uzun sureli yasam karar yorgunlugu, ekip ici gerilim ve insan hatasi uretir.",
                "solution": (
                    f"Iki kisi onayi, AI karar destegi, vardiya rotasyonu ve davranissal trend takibi ile otonomi seviyesi {autonomy_level} "
                    "olsa da insan denetimi korunuyor."
                ),
            },
            {
                "title": "Mars radyasyon ve atmosfer kosullari",
                "severity": "kritik",
                "problem": "Ince atmosfer ve manyetik alan eksikligi yuzey habitatini dogrudan maruziyete acik birakir.",
                "solution": (
                    f"Risk indeksi {analysis.risk_index} oldugu icin {habitat_type} tabanli yer alti veya yari gomulu yasam cekirdegi baz senaryo yapildi."
                ),
            },
            {
                "title": "Yerlesim yeri secimi",
                "severity": "yuksek",
                "problem": "Yalnizca duz zemin secmek su, lojistik ve radyasyon dengesini kacirabilir.",
                "solution": (
                    f"Secim modeli su buzu, inis guvenligi, toz baskisi ve kaynak erisim skorunu birlikte okuyup skoru {score_card.resource_access_score} "
                    "bandina tasiyor."
                ),
            },
            {
                "title": "Yer alti ve yerustu dengesi",
                "severity": "yuksek",
                "problem": "Yerustu genisleme avantajli, ancak tam yuzey kurulumunda radyasyon ve termal riskler buyur.",
                "solution": "Hibrit kurgu kullaniliyor: yasam cekirdegi yer altinda, enerji, anten ve servis omurgasi yuzeyde tutuluyor.",
            },
            {
                "title": "Enerji omurgasi",
                "severity": "kritik",
                "problem": "Mars'ta gunes akisi daha zayif ve toz olaylari tek kaynakli enerji tasarimini kirilgan yapar.",
                "solution": (
                    f"{energy_strategy} hattina uygun sekilde kompakt nukleer temel yuk, gunes destek alani ve bagimsiz siginak guc bankasi birlikte modelleniyor."
                ),
            },
            {
                "title": "Dunyadan tasinacak kritik yukler",
                "severity": "yuksek",
                "problem": "Koloni ilk fazda tum hayati altyapiyi yerel olarak uretmeye hazir olmayacak.",
                "solution": "Yasam destek cekirdegi, medikal izolasyon, filtreler, yedek contalar, robot bakim kitleri ve oncul ISRU reaktorleri ilk manifestoya aliniyor.",
            },
            {
                "title": "ISRU ve Mars kaynaklari",
                "severity": "kritik",
                "problem": "Su, oksijen, yakit ve insaat girdileri yerelde cozulmezse ikmal bagimliligi hizla kritik hale gelir.",
                "solution": (
                    f"{water_strategy} temelinde su cikarma, geri kazanim, CO2 isleme ve regolit kullanim zinciri ile surdurulebilirlik skoru "
                    f"{score_card.sustainability_score} seviyesine cekiliyor."
                ),
            },
            {
                "title": "Biyoguvenlik ve karantina",
                "severity": "yuksek",
                "problem": "Kapali habitatta mikroorganizma kontaminasyonu operasyonel arizaya ve ekip kaybina donebilir.",
                "solution": (
                    f"HEPA destekli hava dongusu, izolasyon odasi ve dekontaminasyon akisi icin {estimated_cost['medical_biosecurity_musd']} MUSD "
                    "duzeyinde ayrik butce ayrildi."
                ),
            },
            {
                "title": "Haberlesme gecikmesi ve otonomi",
                "severity": "kritik",
                "problem": "Dunya-Mars gecikmesi nedeniyle acil durumda gercek zamanli komut beklentisi hatali olur.",
                "solution": (
                    f"On tanimli acil durum matrisleri, robotik omurgada minimum {robot_count} birim ve AI destekli saha kararlari ile gecikme tamponlaniyor."
                ),
            },
            {
                "title": "Mars ve Ay karsilastirmasi",
                "severity": "orta",
                "problem": "Juri, neden Ay yerine Mars secildigini net duymak isteyecek.",
                "solution": "Rapor, Mars'in CO2 atmosferi, su senaryolari, Dunya'ya yakin gun dongusu ve coklu ISRU potansiyeli uzerinden savunma cizgisi kuruyor.",
            },
            {
                "title": "Juri raporunun kapsami",
                "severity": "kritik",
                "problem": "Sadece teknik plan vermek yetmez; riskler, yan etkiler ve cozumler ayni butunde gosterilmeli.",
                "solution": "Rapor; yolculuk, psikoloji, enerji, su, ISRU, biyoguvenlik, haberlesme, acil durum ve maliyet basliklarini tek payload icinde topluyor.",
            },
        ]

    def _build_sections(
        self,
        session: PlanningSessionRead,
        mission_brief: MissionBriefRead | None,
        analysis: RegionAnalysisRead,
        plan: CityPlanRead,
        score_card: ScoreCardRead,
        scenarios: list[PlanScenarioRead],
        estimated_cost: dict[str, float | int | str],
    ) -> list[dict[str, str]]:
        target_population = (
            mission_brief.target_population if mission_brief and mission_brief.target_population else session.crew_size + 8
        )
        robot_count = (
            mission_brief.robot_count if mission_brief and mission_brief.robot_count else max(8, round(session.crew_size / 3))
        )
        autonomy_level = mission_brief.autonomy_level if mission_brief else 70
        resupply_dependence = mission_brief.resupply_dependence if mission_brief else 45
        best_scenario = max(scenarios, key=lambda item: item.mission_fit_score)
        shelter_depth = 3.4 if analysis.risk_index >= 38 else 2.6
        transit_radiation = round(0.64 + session.mission_duration_months / 300, 2)
        daily_water_need = round(target_population * 11.5, 1)
        daily_oxygen_need = round(target_population * 0.84, 1)
        isru_readiness = round(
            (score_card.resource_access_score + score_card.autonomy_score + score_card.sustainability_score) / 3, 1
        )

        return [
            {
                "title": "Yönetici özeti",
                "content": (
                    "Karar modeli, yüzeyde hızlı kurulum yerine kutup veya yüksek enlem buz erişimi ile korunaklı yer altı yaşamını önceliklendirir. "
                    f"Bu oturumda hedef nüfus {target_population}, görev süresi {session.mission_duration_months} ay ve genel görev uyumu "
                    f"{score_card.mission_fit_score} seviyesindedir."
                ),
            },
            {
                "title": "Yolculuk tehlikeleri",
                "content": (
                    f"Transit boyunca ağırlıksızlık, kas-kemik kaybı, radyasyon, dar hacim psikolojisi ve biyolojik bulaşma birlikte yönetilmelidir. "
                    f"Bu görev profili için transit radyasyon tahmini {transit_radiation} Sv bandında kabul edilmiştir. Bu nedenle direnç egzersizi, "
                    "dozimetre, uyku-ışık ritmi kontrolü, karantina akışı ve görev içi psikolojik takip zorunlu kabul edilmiştir."
                ),
            },
            {
                "title": "Psikolojik sağlık ve iç güvenlik",
                "content": (
                    "Dar hacimde uzun süreli birlikte yaşam; çatışma, karar yorgunluğu, rol karmaşası ve sessiz hata üretir. Çözüm paketi; vardiya "
                    "rotasyonu, bireysel mahremiyet hacmi, olay sonrası arabuluculuk, davranışsal trend izleme ve kritik işlemlerde iki kişi onayıdır. "
                    f"Otonomi seviyesi {autonomy_level} olsa da nihai insan onayı kaldırılmaz."
                ),
            },
            {
                "title": "Mars koşulları ve çevresel eşikler",
                "content": (
                    "Mars atmosferi Dünya'nın yaklaşık yüzde 1'i yoğunluğundadır ve küresel manyetik alan yokluğu yüzey radyasyon korumasını kritik hale getirir. "
                    f"Bu sahada risk indeksi {analysis.risk_index}; dolayısıyla açık yüzey habitatı yerine regolit ile örtülü, çok katmanlı kabuk tasarımı "
                    "baz kabul edilmiştir. Termal fark, toz yükü ve basınç zayıflığı yüzey operasyonunu kısa süreli EVA pencereleriyle sınırlar."
                ),
            },
            {
                "title": "Kutup bölgesi seçimi ve su stratejisi",
                "content": (
                    "Jüri açısından ana gerekçe su bağımsızlığıdır. Kutup ve yüksek enlem sahaları, yüzey altı buz erişimini artırdığı için yaşam desteği, "
                    "elektroliz, yakıt öncüleri ve radyasyon kalkanında kullanılacak su rezervi için avantaj sağlar. Bölge seçimi yalnızca düz zeminle değil; "
                    f"su, iniş güvenliği, toz yükü ve lojistik skorunun birleşimiyle yapıldı. Kaynak erişim skoru {score_card.resource_access_score} seviyesindedir."
                ),
            },
            {
                "title": "Yerleşim stratejisi: yüzey mi, yer altı mı?",
                "content": (
                    f"Bu proje için baz çözüm yer altı ağırlıklı hibrit mimaridir. Yaşam çekirdeği, medikal modül ve acil durum sığınağı en az "
                    f"{shelter_depth} metre regolit eşdeğeri koruma altında düşünülmüştür. Yüzey modülleri yalnızca enerji, kargo ayrıştırma, robot bakım ve "
                    "anten omurgası için tutulur. Bu yaklaşım radyasyon, ikincil parçacık etkisi, termal salınım ve toz aşınmasını azaltır."
                ),
            },
            {
                "title": "Mağara ve doğal boşluk potansiyeli",
                "content": (
                    "NASA görüntüleri Mars'ta bazı bölgelerde mağara girişleri ve olası lav tüpü boşluklarını destekleyen işaretler sunar. Ancak seçilen kutup "
                    "ve yüksek enlem adaylarında doğrulanmış, doğrudan kullanılabilir mağara varlığı garanti değildir. Bu nedenle tasarım; mağara bulunursa onu "
                    "ek koruma avantajı sayar, bulunmazsa kazılmış galeri ve regolit örtülü habitatla aynı güvenlik seviyesine ulaşmayı hedefler."
                ),
            },
            {
                "title": "Enerji mimarisi",
                "content": (
                    "Enerji omurgası tek kaynağa bırakılmamıştır. Temel yük için kompakt nükleer sistem, yük paylaşımı için güneş alanı, kısa süreli tampon için "
                    "batarya bankası ve sığınak içi ayrık acil durum hattı önerilir. Kutup yakınında güneş verimi düştüğü için yüzey habitatı yerine yer altı "
                    "çekirdeği seçmek enerji verimsizliği riskini de dengeler."
                ),
            },
            {
                "title": "Dünya'dan taşınacak kritik yükler",
                "content": (
                    "İlk manifestoda basınçlı yaşam modülleri, su-hava geri kazanım ekipmanı, medikal izolasyon çekirdeği, radyasyon sığınağı ekipmanı, "
                    "yedek contalar, toz dayanımlı filtreler, robot bakım birimleri, güç elektroniği ve öncül ISRU reaktörleri yer almalıdır. "
                    "Taşınacak yüklerin amacı koloni kurmak değil, koloninin yerel kaynakları devreye alana kadar düşmemesini sağlamaktır."
                ),
            },
            {
                "title": "ISRU ve yerinde kaynak kullanımı",
                "content": (
                    f"Bu projede ISRU yalnızca verimlilik başlığı değil, koloni mimarisinin merkezi dayanağıdır. ISRU hazırlık skoru {isru_readiness}. "
                    f"Hedef günlük su çevrimi {daily_water_need} litre, günlük oksijen ihtiyacı yaklaşık {daily_oxygen_need} kg bandındadır. "
                    "Bu nedenle su buzu çıkarımı, suyun saflaştırılması, elektroliz, CO2 işleme, regolitten koruyucu yapı malzemesi üretimi ve yedek parça "
                    "imalatı aynı tedarik zincirinin parçası olarak ele alınmıştır."
                ),
            },
            {
                "title": "Mars kaynaklarının coğrafi dağılımı",
                "content": (
                    "Yüzey altı buz ve kutup rezervleri su ekonomisinin bel kemiğidir. Regolit neredeyse her yerde yapı malzemesi ve kalkanlama için kullanılabilir; "
                    "ancak granülometri, bağlayıcı ihtiyacı ve perklorat temizliği bölgeye göre değişir. Bu nedenle saha skoru sadece kaynağın varlığına değil, "
                    "işlenebilirliğine ve bakım yüküne göre oluşturulmuştur."
                ),
            },
            {
                "title": "Mars ve Ay karşılaştırması",
                "content": (
                    "Ay lojistik olarak daha yakın olsa da Mars; CO2 içeren atmosferi, daha zengin su senaryoları, Dünya'ya daha yakın gün döngüsü ve çoklu ISRU "
                    "kombinasyonu nedeniyle uzun süreli habitat ekonomisi için daha güçlü adaydır. Savunma sırasında bu fark özellikle kapalı yaşam ekonomisi "
                    "ve yakıt öncülü üretimi üzerinden anlatılmalıdır."
                ),
            },
            {
                "title": "Biyogüvenlik",
                "content": (
                    "Kapalı habitatta mikrobiyal kontaminasyon hızla sistemik arızaya dönüşebilir. Bu nedenle giriş-çıkış dekontaminasyonu, HEPA destekli iç hava "
                    "devri, pozitif-negatif basınçlı izolasyon odası, numune ayrıştırma protokolü ve semptom bazlı alarm akışı zorunludur. Biyogüvenlik bütçesi "
                    f"{estimated_cost['medical_biosecurity_musd']} MUSD seviyesinde ayrı kalem olarak düşünülmüştür."
                ),
            },
            {
                "title": "Haberleşme ve otonom karar sistemleri",
                "content": (
                    "Dünya-Mars iletişim gecikmesi gerçek zamanlı komut zincirini kırar. Bu yüzden saha kararları; önceden tanımlı acil durum matrisleri, AI destekli "
                    "öneri katmanı ve insan operatörün son onayı ile çalışmalıdır. Amaç insanı devreden çıkarmak değil, insan hatasının zincirleme etkisini azaltmaktır."
                ),
            },
            {
                "title": "Acil durum ve sığınak planı",
                "content": (
                    "Toz fırtınası, güneş parçacık olayı, basınç kaybı, su hattı kırılması, yangın, iç güvenlik olayı ve biyolojik bulaş için ayrı prosedür zinciri "
                    "tanımlanmıştır. Ortak çözüm omurgası; yer altı sığınağı, 72 saat bağımsız yaşam desteği, ayrık güç bankası, medikal izolasyon ve robotik bakım hattıdır."
                ),
            },
            {
                "title": "Tahmini maliyet ve fazlama",
                "content": (
                    f"Program toplam {estimated_cost['total_program_musd']} MUSD olarak modellenmiştir. Bunun {estimated_cost['base_infrastructure_musd']} MUSD "
                    f"altyapı ve inşa, {estimated_cost['isru_musd']} MUSD ISRU, {estimated_cost['shielding_musd']} MUSD yer altı koruması ve kalkanlama, "
                    f"{estimated_cost['operations_musd']} MUSD operasyonel tüketim içindir. Faz mantığı; önce güvenli çekirdek, sonra kaynak bağımsızlığı, "
                    "son olarak nüfus ve üretim büyümesidir."
                ),
            },
            {
                "title": "Senaryo kararı",
                "content": (
                    f"Alternatifler arasında en yüksek görev uyumu {best_scenario.scenario_name} senaryosunda {best_scenario.mission_fit_score} skoruyla oluştu. "
                    f"Bununla birlikte resupply dependence {resupply_dependence} olduğundan, nihai karar doğrudan agresif büyüme yerine rezervi yüksek hibrit yürütme "
                    "mantığında tutulmalıdır. Robotik omurgada önerilen minimum sayı {robot_count} adettir."
                ),
            },
            {
                "title": "Savunma özeti",
                "content": (
                    "Bu çözüm yalnızca bir koordinat seçimi değildir. Yolculuk riskleri, insan faktörü, psikolojik dayanım, biyogüvenlik, enerji, su çıkarımı, "
                    "CO2 işleme, yer altı sığınakları ve iletişim gecikmesi aynı karar modelinde ele alınmıştır. Jüriye verilecek temel mesaj budur."
                ),
            },
            {
                "title": "Kaynakça",
                "content": (
                    "NASA Mars Facts: https://science.nasa.gov/mars/facts/ | "
                    "NASA Water on Mars: https://science.nasa.gov/mars/water-on-mars/ | "
                    "NASA Making Oxygen on Mars / MOXIE: https://science.nasa.gov/resource/making-oxygen-on-mars/ | "
                    "NASA Human Research Program - Five Hazards of Human Spaceflight: https://www.nasa.gov/hrp/5-hazards-of-human-spaceflight/ | "
                    "NASA Human Research Program - Space Radiation: https://www.nasa.gov/hrp/elements/radiation/ | "
                    "NASA Mars Exploration Program: https://mars.nasa.gov/ | "
                    "NASA Mars Odyssey cave skylight findings: https://science.nasa.gov/mars/resources/mars-odyssey-finds-possible-cave-skylights-on-mars/"
                ),
            },
        ]
