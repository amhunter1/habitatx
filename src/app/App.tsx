import { MainOverview } from "../features/home/MainOverview";
import { MissionConfigView } from "../features/mission-config/MissionConfigView";
import { AiReportView } from "../features/reports/AiReportView";
import { SiteAnalysisView } from "../features/site-analysis/SiteAnalysisView";
import { CityPlanView } from "../features/city-plan/CityPlanView";
import { SourcesView } from "../features/sources/SourcesView";
import { Sidebar } from "./layout/Sidebar";
import { Topbar } from "./layout/Topbar";
import { useMissionPlanner } from "./state/useMissionPlanner";

export function App() {
  const planner = useMissionPlanner();

  return (
    <div className="app-shell">
      <Sidebar
        aktifGorunum={planner.aktifGorunum}
        onNavigate={planner.setAktifGorunum}
      />

      <main className="content-shell">
        <Topbar
          seciliBolge={planner.seciliBolge}
          ekipBuyuklugu={planner.ekipBuyuklugu}
          gorevSuresi={planner.gorevSuresi}
          aktifGorunum={planner.aktifGorunum}
        />

        <section className="view-shell">{renderView(planner)}</section>

        <footer className="footer-note">
          <p>Bu proje Lora ekibi tarafından tasarlanmıştır.</p>
        </footer>
      </main>
    </div>
  );
}

function renderView(planner: ReturnType<typeof useMissionPlanner>) {
  switch (planner.aktifGorunum) {
    case "ana-merkez":
      return (
        <MainOverview
          regions={planner.regions}
          bolgeId={planner.bolgeId}
          setBolgeId={planner.setBolgeId}
          ekipBuyuklugu={planner.ekipBuyuklugu}
          setEkipBuyuklugu={planner.setEkipBuyuklugu}
          gorevSuresi={planner.gorevSuresi}
          setGorevSuresi={planner.setGorevSuresi}
          riskProfili={planner.riskProfili}
          setRiskProfili={planner.setRiskProfili}
          seciliBolge={planner.seciliBolge}
          onDevam={() => planner.setAktifGorunum("gorev-konfigurasyonu")}
        />
      );
    case "gorev-konfigurasyonu":
      return (
        <MissionConfigView
          ekipBuyuklugu={planner.ekipBuyuklugu}
          setEkipBuyuklugu={planner.setEkipBuyuklugu}
          gorevSuresi={planner.gorevSuresi}
          setGorevSuresi={planner.setGorevSuresi}
          riskProfili={planner.riskProfili}
          setRiskProfili={planner.setRiskProfili}
          missionPurpose={planner.missionPurpose}
          setMissionPurpose={planner.setMissionPurpose}
          energyStrategy={planner.energyStrategy}
          setEnergyStrategy={planner.setEnergyStrategy}
          waterStrategy={planner.waterStrategy}
          setWaterStrategy={planner.setWaterStrategy}
          planningImpactMetrics={planner.planningImpactMetrics}
          analizHesaplaniyor={planner.analizHesaplaniyor}
          onAnalize={planner.analizBaslat}
        />
      );
    case "bolge-analizi":
      return (
        <SiteAnalysisView
          seciliBolge={planner.seciliBolge}
          planningImpactMetrics={planner.planningImpactMetrics}
          kaynakMetrikleri={planner.kaynakMetrikleri}
          ekipBuyuklugu={planner.ekipBuyuklugu}
          gorevSuresi={planner.gorevSuresi}
          riskProfili={planner.riskProfili}
          missionPurpose={planner.missionPurpose}
          energyStrategy={planner.energyStrategy}
          waterStrategy={planner.waterStrategy}
        />
      );
    case "sehir-plani":
      return (
        <CityPlanView
          seciliBolge={planner.seciliBolge}
          seciliSenaryo={planner.seciliSenaryo}
          senaryoAdi={planner.senaryoAdi}
          setSenaryoAdi={planner.setSenaryoAdi}
          senaryolar={planner.senaryolar}
          moduller={planner.planModulleri}
          sehirFazlari={planner.planFazlari}
          topRecommendations={planner.topRecommendations}
          kaynakMetrikleri={planner.kaynakMetrikleri}
          isiHaritasi={planner.isiHaritasi}
          raporKonulari={planner.reportTopics}
        />
      );
    case "ai-raporu":
      return (
        <AiReportView
          seciliBolge={planner.seciliBolge}
          seciliSenaryo={planner.seciliSenaryo}
          executiveSummary={planner.executiveSummary}
          technicalSummary={planner.technicalSummary}
          raporBolumleri={planner.reportSections}
          sonrakiAdimlar={planner.reportActions}
        />
      );
    case "kaynaklar":
      return <SourcesView />;
    default:
      return (
        <SiteAnalysisView
          seciliBolge={planner.seciliBolge}
          planningImpactMetrics={planner.planningImpactMetrics}
          kaynakMetrikleri={planner.kaynakMetrikleri}
          ekipBuyuklugu={planner.ekipBuyuklugu}
          gorevSuresi={planner.gorevSuresi}
          riskProfili={planner.riskProfili}
          missionPurpose={planner.missionPurpose}
          energyStrategy={planner.energyStrategy}
          waterStrategy={planner.waterStrategy}
        />
      );
  }
}
