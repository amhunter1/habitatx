import { useState } from "react";
import { Panel } from "../../components/ui/Panel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Timeline } from "../../components/ui/Timeline";
import { ScenarioComparisonView } from "../scenarios/ScenarioComparisonView";
import { RiskResourcesView } from "../operations/RiskResourcesView";
import type { PlanModule, Region, ReportTopic, ResourceMetric, Scenario, TimelineItem } from "../../types/mission";

export function CityPlanView({
  seciliBolge,
  seciliSenaryo,
  setSenaryoAdi,
  senaryolar,
  moduller,
  sehirFazlari,
  topRecommendations,
  kaynakMetrikleri,
  isiHaritasi,
  raporKonulari
}: {
  seciliBolge: Region;
  seciliSenaryo: Scenario;
  senaryoAdi: Scenario["ad"];
  setSenaryoAdi: (ad: Scenario["ad"]) => void;
  senaryolar: Scenario[];
  moduller: PlanModule[];
  sehirFazlari: TimelineItem[];
  topRecommendations: string[];
  kaynakMetrikleri: ResourceMetric[];
  isiHaritasi: number[];
  raporKonulari: ReportTopic[];
}) {
  const [aktifSekme, setAktifSekme] = useState<"genel" | "kaynak" | "senaryo">("genel");

  return (
    <div className="stack-xl">
      <section className="two-column-grid">
        <Panel>
          <SectionHeader
            etiket="Üretilen çıktı"
            baslik={`${seciliSenaryo.ad} / ${seciliBolge.ad}`}
            aciklama="Plan ekranı tek merkezdir. Modüller, kaynak baskısı ve senaryolar bu ekranda sekmeler halinde toplanır."
          />
          <div className="stats-row">
            <StatCard etiket="Uygunluk" deger={`${seciliBolge.uygunlukSkoru}`} yardimci="Saha tabanı" />
            <StatCard
              etiket="Senaryo uyumu"
              deger={`${seciliSenaryo.gorevUyumu}`}
              yardimci="Görev profili eşleşmesi"
            />
            <StatCard etiket="Risk" deger={`${seciliSenaryo.risk}`} yardimci="Düşük daha iyi" />
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Ana öneriler"
            baslik="Plan direktifleri"
            aciklama="Önce güvenli çekirdek, sonra kaynak bağımsızlığı, en son büyüme."
          />
          <ul className="detail-list">
            {topRecommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        </Panel>
      </section>

      <Panel>
        <div className="segmented-row">
          <button
            className={`segment ${aktifSekme === "genel" ? "active" : ""}`}
            onClick={() => setAktifSekme("genel")}
          >
            Genel plan
          </button>
          <button
            className={`segment ${aktifSekme === "kaynak" ? "active" : ""}`}
            onClick={() => setAktifSekme("kaynak")}
          >
            Risk ve kaynak
          </button>
          <button
            className={`segment ${aktifSekme === "senaryo" ? "active" : ""}`}
            onClick={() => setAktifSekme("senaryo")}
          >
            Senaryolar
          </button>
        </div>
      </Panel>

      {aktifSekme === "genel" ? (
        <section className="city-plan-grid">
          <Panel>
            <SectionHeader
              etiket="Önerilen modüller"
              baslik="Kurulum yığını"
              aciklama="Yer altı çekirdeği, ISRU ve kalkan omurgası aynı planda görünür."
            />
            <div className="module-grid">
              {moduller.map((module) => (
                <article key={module.ad} className="module-card">
                  <p className="eyebrow">
                    {module.kategori} / {module.faz}
                  </p>
                  <h4>{module.ad}</h4>
                  <p>{module.aciklama}</p>
                  <div className="module-meta">
                    <span>{module.kapasite}</span>
                    <span>{module.enerji} enerji yükü</span>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              etiket="Faz bazlı kurulum"
              baslik="Yerleşim zaman çizelgesi"
              aciklama="Hangi modüllerin ne zaman geldiği ve neden erkene çekildiği açık biçimde gösterilir."
            />
            <Timeline items={sehirFazlari} />
          </Panel>
        </section>
      ) : null}

      {aktifSekme === "kaynak" ? (
        <RiskResourcesView
          seciliBolge={seciliBolge}
          kaynakMetrikleri={kaynakMetrikleri}
          isiHaritasi={isiHaritasi}
          raporKonulari={raporKonulari}
        />
      ) : null}

      {aktifSekme === "senaryo" ? (
        <ScenarioComparisonView
          senaryolar={senaryolar}
          seciliSenaryo={seciliSenaryo}
          onSelect={setSenaryoAdi}
        />
      ) : null}
    </div>
  );
}
