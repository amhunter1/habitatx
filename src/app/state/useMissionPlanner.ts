import { useEffect, useMemo, useRef, useState } from "react";
import { habitatApi, type BackendRegion, type BackendSessionEnvelope } from "../../lib/api";
import {
  buildScenarioFallbacks,
  mapBackendScenarios,
  mapEnvelopeToRegions,
  mapHeatmap,
  mapPlanModules,
  mapPlanPhases,
  mapReportActions,
  mapReportSections,
  mapReportTopics,
  mapResourceMetrics,
  toApiRiskProfile,
  toUiRiskProfile
} from "../../lib/mappers";
import type {
  PlanModule,
  PlanningImpactMetric,
  Region,
  ReportSection,
  ReportTopic,
  ResourceMetric,
  Scenario,
  TimelineItem,
  ViewId
} from "../../types/mission";

const DEFAULT_REGION_IDS = ["planum_boreum", "arcadia_planitia", "deuteronilus_mensae"];

const EMPTY_REGION: Region = {
  id: DEFAULT_REGION_IDS[0],
  ad: "Bölge yükleniyor",
  sektor: "Mars kutup kuşağı",
  tanim: "Backend bölge kataloğu bağlandığında saha bilgileri burada görünecek.",
  mapPositionX: 50,
  mapPositionY: 50,
  ozet: "Canlı analiz bekleniyor.",
  uygunlukSkoru: 0,
  riskIndeksi: 0,
  genislemeSkoru: 0,
  lojistikSkoru: 0,
  isruSkoru: 0,
  ortalamaEğim: "-",
  buzOlasiligi: "-",
  tozRiski: "-",
  sicaklikAraligi: "-",
  inisGuvenligi: "-",
  kurulumPenceresi: "Hesaplanıyor",
  habitatModu: "Yer altı hibrit habitat",
  habitatGerekcesi: "Radyasyon, termal fark ve toz nedeniyle yüzey tek başına önerilmiyor.",
  magaraPotansiyeli: "Doğal boşluk verisi bekleniyor.",
  kaynakOdaklari: [],
  cevreOzeti: [],
  cevreDetaylari: [],
  havaTahmini: [],
  nasaReferansNotu: "NASA referans verisi bekleniyor.",
  anaNotlar: ["Bölge kataloğu yükleniyor."],
  kirmiziBayraklar: ["Analiz verisi henüz alınmadı."],
  katmanlar: ["Canlı veri bekleniyor"],
  analizSatirlari: [],
  kaynakBaski: [],
  fazlar: []
};

function buildMissionBrief(
  crewSize: number,
  missionDuration: number,
  riskProfile: string,
  missionPurpose: string,
  energyStrategy: string,
  waterStrategy: string
) {
  return {
    mission_purpose:
      missionPurpose === "Araştırma üssü"
        ? "arastirma_ussu"
        : missionPurpose === "Üretim öncülü"
          ? "uretim_onculu"
          : "kalici_habitat",
    target_population: Math.max(Math.round(crewSize * 1.35), crewSize + 8),
    energy_strategy:
      energyStrategy === "Ağırlıklı güneş"
        ? "solar_primary"
        : energyStrategy === "Ağırlıklı nükleer"
          ? "nuclear_primary"
          : "solar_nuclear_hybrid",
    habitat_type: "buried_modular",
    water_strategy:
      waterStrategy === "Ağırlıklı geri kazanım"
        ? "recycling_primary"
        : "ice_extraction_plus_recycling",
    food_strategy: "hybrid_bioregenerative",
    autonomy_level: riskProfile === "Agresif büyüme" ? 80 : 72,
    robot_count: Math.max(8, Math.round(crewSize / 3)),
    resupply_dependence: riskProfile === "Korunaklı" ? 46 : 34,
    risk_tolerance:
      riskProfile === "Korunaklı" ? 35 : riskProfile === "Agresif büyüme" ? 68 : 45,
    growth_target: missionDuration >= 72 ? "phase_3_expansion" : "phase_2_stabilization"
  };
}

function quickstartSignature(
  regionId: string,
  crewSize: number,
  missionDuration: number,
  riskProfile: string
) {
  return JSON.stringify({
    regionId,
    crewSize,
    missionDuration,
    riskProfile
  });
}

export function useMissionPlanner() {
  const [aktifGorunum, setAktifGorunum] = useState<ViewId>("ana-merkez");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [backendRegions, setBackendRegions] = useState<BackendRegion[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [bolgeId, setBolgeId] = useState(DEFAULT_REGION_IDS[0]);
  const [ekipBuyuklugu, setEkipBuyuklugu] = useState(24);
  const [gorevSuresi, setGorevSuresi] = useState(48);
  const [riskProfili, setRiskProfili] = useState("Dengeli");
  const [missionPurpose, setMissionPurpose] = useState("Kalıcı habitat");
  const [energyStrategy, setEnergyStrategy] = useState("Güneş + kompakt nükleer");
  const [waterStrategy, setWaterStrategy] = useState("Buz çıkarımı + geri kazanım");
  const [senaryolar, setSenaryolar] = useState<Scenario[]>(buildScenarioFallbacks(null));
  const [senaryoAdi, setSenaryoAdi] = useState<Scenario["ad"]>("Dengeli Plan");
  const [planModulleri, setPlanModulleri] = useState<PlanModule[]>([]);
  const [planFazlari, setPlanFazlari] = useState<TimelineItem[]>([]);
  const [topRecommendations, setTopRecommendations] = useState<string[]>([]);
  const [kaynakMetrikleri, setKaynakMetrikleri] = useState<ResourceMetric[]>([]);
  const [isiHaritasi, setIsiHaritasi] = useState<number[]>([24, 36, 42, 57, 61, 48, 33, 51, 68]);
  const [reportSections, setReportSections] = useState<ReportSection[]>([]);
  const [reportTopics, setReportTopics] = useState<ReportTopic[]>([]);
  const [reportActions, setReportActions] = useState<TimelineItem[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [technicalSummary, setTechnicalSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analizHesaplaniyor, setAnalizHesaplaniyor] = useState(false);

  const lastSyncedQuickstartRef = useRef("");
  const isBootstrappingRef = useRef(true);

  const seciliBolge = useMemo(
    () => regions.find((region) => region.id === bolgeId) ?? regions[0] ?? EMPTY_REGION,
    [regions, bolgeId]
  );

  const seciliSenaryo = useMemo(
    () =>
      senaryolar.find((scenario) => scenario.ad === senaryoAdi) ??
      senaryolar[0] ?? {
        ad: "Dengeli Plan",
        optimizasyon: "Veri bekleniyor",
        gorevUyumu: 0,
        risk: 0,
        otonomi: 0,
        maliyetDisiplini: 0,
        aciklama: "Senaryo çıktıları backend tarafından üretilecek."
      },
    [senaryolar, senaryoAdi]
  );

  const planningImpactMetrics = useMemo<PlanningImpactMetric[]>(() => {
    const energyBase =
      energyStrategy === "Ağırlıklı nükleer" ? 90 : energyStrategy === "Ağırlıklı güneş" ? 68 : 84;
    const energyDurationPenalty = Math.round(gorevSuresi / 12);
    const energyRiskBonus =
      riskProfili === "Korunaklı" ? 6 : riskProfili === "Agresif büyüme" ? -4 : 0;
    const enerjiDayanimi = Math.max(
      40,
      Math.min(98, energyBase - energyDurationPenalty + energyRiskBonus)
    );

    const ikmalBase = waterStrategy === "Ağırlıklı geri kazanım" ? 54 : 40;
    const missionSupplyPenalty =
      missionPurpose === "Üretim öncülü" ? 10 : missionPurpose === "Araştırma üssü" ? 4 : 0;
    const ikmalBagimliligi = Math.max(
      18,
      Math.min(88, ikmalBase + missionSupplyPenalty + Math.round(ekipBuyuklugu / 18))
    );

    const maintenanceBase = 28 + Math.round(ekipBuyuklugu / 5) + Math.round(gorevSuresi / 12);
    const maintenanceEnergyPenalty =
      energyStrategy === "Ağırlıklı güneş" ? 8 : energyStrategy === "Ağırlıklı nükleer" ? 5 : 0;
    const bakimYuku = Math.max(
      26,
      Math.min(96, maintenanceBase + maintenanceEnergyPenalty)
    );

    const expansionBase =
      missionPurpose === "Üretim öncülü" ? 86 : missionPurpose === "Kalıcı habitat" ? 74 : 62;
    const expansionDurationBonus = gorevSuresi >= 72 ? 8 : gorevSuresi >= 48 ? 4 : 0;
    const expansionRiskShift =
      riskProfili === "Agresif büyüme" ? 8 : riskProfili === "Korunaklı" ? -6 : 0;
    const genislemeHazirligi = Math.max(
      30,
      Math.min(97, expansionBase + expansionDurationBonus + expansionRiskShift)
    );

    return [
      {
        etiket: "Enerji dayanımı",
        deger: enerjiDayanimi,
        yorum:
          energyStrategy === "Ağırlıklı nükleer"
            ? "Uzun süreli kutup görevlerinde daha stabil enerji omurgası."
            : energyStrategy === "Ağırlıklı güneş"
              ? "Kutup kışı ve toz haftalarına karşı daha yüksek tampon gerekir."
              : "Hibrit üretim kutup üsleri için denge ve yedeklilik sağlar."
      },
      {
        etiket: "İkmal bağımlılığı",
        deger: ikmalBagimliligi,
        yorum:
          waterStrategy === "Ağırlıklı geri kazanım"
            ? "Geri kazanım odağı dış ikmal baskısını azaltır."
            : "Buz çıkarımı ilk faz ISRU altyapısını öne çeker."
      },
      {
        etiket: "Bakım yükü",
        deger: bakimYuku,
        yorum:
          ekipBuyuklugu >= 44
            ? "Yüksek ekip büyüklüğü kutup şartlarında robotik ve servis kapasitesini zorlamaya başlıyor."
            : "Bakım hattı kontrollü ama otomasyon kritik."
      },
      {
        etiket: "Genişleme hazırlığı",
        deger: genislemeHazirligi,
        yorum:
          missionPurpose === "Üretim öncülü"
            ? "ISRU altyapısı güçlenirse erken kapasite artışı mümkün."
            : missionPurpose === "Araştırma üssü"
              ? "Büyüme ikinci planda, operasyonel esneklik öne çıkıyor."
              : "Yer altı hibrit habitat ile Faz III büyümesi için dengeli zemin oluşuyor."
      }
    ];
  }, [energyStrategy, gorevSuresi, riskProfili, waterStrategy, missionPurpose, ekipBuyuklugu]);

  async function analizBaslat() {
    if (!sessionId) return;
    setAnalizHesaplaniyor(true);
    setError(null);
    try {
      await habitatApi.patchMissionBrief(
        sessionId,
        buildMissionBrief(
          ekipBuyuklugu,
          gorevSuresi,
          riskProfili,
          missionPurpose,
          energyStrategy,
          waterStrategy
        )
      );
      await habitatApi.analyzeRegion(sessionId);
      await habitatApi.generatePlan(sessionId);
      await habitatApi.generateScenarios(sessionId);
      await habitatApi.generateReport(sessionId);
      const envelope = await habitatApi.getPlanningSession(sessionId);
      hydrateFromEnvelope(envelope);
      setAktifGorunum("bolge-analizi");
    } catch {
      setError("Analiz hesaplaması başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setAnalizHesaplaniyor(false);
    }
  }

  function hydrateFromEnvelope(
    envelope: BackendSessionEnvelope,
    sourceRegions: BackendRegion[] = backendRegions
  ) {
    const mappedRegions = mapEnvelopeToRegions(envelope, sourceRegions);
    const mappedScenarios = mapBackendScenarios(envelope.scenarios, envelope.score_card);
    const mappedModules = mapPlanModules(envelope.plan);
    const mappedPhases = mapPlanPhases(envelope.plan);
    const mappedReportSections = mapReportSections(envelope.report);
    const mappedReportTopics = mapReportTopics(envelope.report);
    const mappedActions = envelope.report ? mapReportActions(envelope.report) : [];

    lastSyncedQuickstartRef.current = quickstartSignature(
      envelope.quickstart.selected_region_id,
      envelope.quickstart.crew_size,
      envelope.quickstart.mission_duration_months,
      toUiRiskProfile(envelope.quickstart.risk_profile)
    );

    setRegions(mappedRegions);
    setBolgeId(envelope.quickstart.selected_region_id);
    setEkipBuyuklugu(envelope.quickstart.crew_size);
    setGorevSuresi(envelope.quickstart.mission_duration_months);
    setRiskProfili(toUiRiskProfile(envelope.quickstart.risk_profile));
    setMissionPurpose(
      envelope.mission_brief?.mission_purpose === "arastirma_ussu"
        ? "Araştırma üssü"
        : envelope.mission_brief?.mission_purpose === "uretim_onculu"
          ? "Üretim öncülü"
          : "Kalıcı habitat"
    );
    setEnergyStrategy(
      envelope.mission_brief?.energy_strategy === "solar_primary"
        ? "Ağırlıklı güneş"
        : envelope.mission_brief?.energy_strategy === "nuclear_primary"
          ? "Ağırlıklı nükleer"
          : "Güneş + kompakt nükleer"
    );
    setWaterStrategy(
      envelope.mission_brief?.water_strategy === "recycling_primary"
        ? "Ağırlıklı geri kazanım"
        : "Buz çıkarımı + geri kazanım"
    );
    setSenaryolar(mappedScenarios);
    setSenaryoAdi((current) =>
      mappedScenarios.some((scenario) => scenario.ad === current)
        ? current
        : mappedScenarios[1]?.ad ?? mappedScenarios[0]?.ad
    );
    setPlanModulleri(mappedModules);
    setPlanFazlari(mappedPhases);
    setTopRecommendations(envelope.plan?.top_recommendations ?? []);
    setKaynakMetrikleri(mapResourceMetrics(envelope.score_card));
    setIsiHaritasi(mapHeatmap(envelope.score_card));
    setReportSections(mappedReportSections);
    setReportTopics(mappedReportTopics);
    setReportActions(mappedActions);
    setExecutiveSummary(envelope.report?.executive_summary ?? "");
    setTechnicalSummary(envelope.report?.technical_summary ?? "");
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      setError(null);

      try {
        const bolgeler = await habitatApi.listRegions();
        if (cancelled) {
          return;
        }

        setBackendRegions(bolgeler);
        const initialRegionId = bolgeler[0]?.id ?? DEFAULT_REGION_IDS[0];
        const envelope = await habitatApi.createPlanningSession({
          selected_region_id: initialRegionId,
          crew_size: 24,
          mission_duration_months: 48,
          risk_profile: "dengeli"
        });

        if (cancelled) {
          return;
        }

        setSessionId(envelope.session.id);
        await habitatApi.patchMissionBrief(
          envelope.session.id,
          buildMissionBrief(
            24,
            48,
            "Dengeli",
            "Kalıcı habitat",
            "Güneş + kompakt nükleer",
            "Buz çıkarımı + geri kazanım"
          )
        );
        await habitatApi.analyzeRegion(envelope.session.id);
        await habitatApi.generatePlan(envelope.session.id);
        await habitatApi.generateScenarios(envelope.session.id);
        await habitatApi.generateReport(envelope.session.id);

        const hydratedEnvelope = await habitatApi.getPlanningSession(envelope.session.id);
        hydrateFromEnvelope(hydratedEnvelope, bolgeler);
      } catch {
        if (!cancelled) {
          setRegions([]);
          setError("Backend bağlantısı kurulamadı. Canlı veri alınmadan ekranlar dolmayacak.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          isBootstrappingRef.current = false;
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionId || isBootstrappingRef.current) {
      return;
    }

    const currentSignature = quickstartSignature(bolgeId, ekipBuyuklugu, gorevSuresi, riskProfili);
    if (currentSignature === lastSyncedQuickstartRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        await habitatApi.patchQuickstart(sessionId, {
          selected_region_id: bolgeId,
          crew_size: ekipBuyuklugu,
          mission_duration_months: gorevSuresi,
          risk_profile: toApiRiskProfile(riskProfili)
        });
        await habitatApi.patchMissionBrief(
          sessionId,
          buildMissionBrief(
            ekipBuyuklugu,
            gorevSuresi,
            riskProfili,
            missionPurpose,
            energyStrategy,
            waterStrategy
          )
        );
        await habitatApi.analyzeRegion(sessionId);
        await habitatApi.generatePlan(sessionId);
        await habitatApi.generateScenarios(sessionId);
        await habitatApi.generateReport(sessionId);

        const envelope = await habitatApi.getPlanningSession(sessionId);
        hydrateFromEnvelope(envelope);
      } catch {
        setError("Backend senkronizasyonu başarısız oldu. Son başarılı durum korunuyor.");
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    sessionId,
    bolgeId,
    ekipBuyuklugu,
    gorevSuresi,
    riskProfili,
    missionPurpose,
    energyStrategy,
    waterStrategy
  ]);

  return {
    aktifGorunum,
    setAktifGorunum,
    sessionId,
    regions,
    bolgeId,
    setBolgeId,
    ekipBuyuklugu,
    setEkipBuyuklugu,
    gorevSuresi,
    setGorevSuresi,
    riskProfili,
    setRiskProfili,
    missionPurpose,
    setMissionPurpose,
    energyStrategy,
    setEnergyStrategy,
    waterStrategy,
    setWaterStrategy,
    planningImpactMetrics,
    senaryolar,
    senaryoAdi,
    setSenaryoAdi,
    seciliBolge,
    seciliSenaryo,
    planModulleri,
    planFazlari,
    topRecommendations,
    kaynakMetrikleri,
    isiHaritasi,
    reportSections,
    reportTopics,
    reportActions,
    executiveSummary,
    technicalSummary,
    loading,
    error,
    analizHesaplaniyor,
    analizBaslat
  };
}
