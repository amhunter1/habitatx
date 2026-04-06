import { DataTable } from "../../components/ui/DataTable";
import { Panel } from "../../components/ui/Panel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeader } from "../../components/ui/SectionHeader";
import type { Region, ReportTopic, ResourceMetric } from "../../types/mission";

function toSeverityLabel(value: string): string {
  if (value === "kritik") return "Kritik";
  if (value === "yuksek") return "Yuksek";
  return "Orta";
}

function isSpaceTopic(topic: ReportTopic): boolean {
  const normalized = `${topic.baslik} ${topic.sorun} ${topic.cozum}`.toLocaleLowerCase("tr-TR");
  return !normalized.includes("juri") && !normalized.includes("savunma") && !normalized.includes("rapor");
}

export function RiskResourcesView({
  seciliBolge,
  kaynakMetrikleri,
  isiHaritasi,
  raporKonulari
}: {
  seciliBolge: Region;
  kaynakMetrikleri: ResourceMetric[];
  isiHaritasi: number[];
  raporKonulari: ReportTopic[];
}) {
  const siraliKonular = [...raporKonulari]
    .filter(isSpaceTopic)
    .sort((a, b) => {
    const oncelik = { kritik: 0, yuksek: 1, orta: 2 };
    return (oncelik[a.seviye as keyof typeof oncelik] ?? 3) - (oncelik[b.seviye as keyof typeof oncelik] ?? 3);
    });

  return (
    <div className="stack-xl">
      <div className="two-column-grid">
        <Panel>
          <SectionHeader
            etiket="Kaynaklar"
            baslik="Operasyon metrikleri"
            aciklama="Yogun veri duzeni korunur, ancak okunabilirlik icin yalnizca kritik sinyaller one cikarilir."
          />
          <div className="stack-md">
            {kaynakMetrikleri.map((metric) => (
              <ProgressBar
                key={metric.etiket}
                etiket={metric.etiket}
                deger={metric.deger}
                yardimci={metric.yorum}
              />
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Risk haritasi"
            baslik="Maruziyet isi matrisi"
            aciklama="Alarm etkisi yalnizca gerektiginde yukselir; veri sakin ama net okunur."
          />
          <div className="heatmap-grid">
            {isiHaritasi.map((value, index) => (
              <div key={index} className="heat-cell" style={{ opacity: 0.3 + value / 100 }}>
                {value}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="professor-notes-panel">
        <SectionHeader
          etiket="Uzay notlari"
          baslik="Kritik uzay sorunlari ve cozumleri"
          aciklama="Burada sadece uzay goreviyle ilgili basliklar tutulur: yolculuk, Mars kosullari, enerji, ISRU, biyoguvenlik ve haberlesme."
        />
        <div className="professor-notes-stack">
          {siraliKonular.map((konu, index) => (
            <article key={konu.baslik} className={`professor-note-row severity-${konu.seviye}`}>
              <div className="professor-note-index">{index + 1}</div>
              <div className="professor-note-row-main">
                <div className="professor-note-head">
                  <strong>{konu.baslik}</strong>
                  <span>{toSeverityLabel(konu.seviye)}</span>
                </div>
                <div className="professor-note-row-grid">
                  <div className="professor-note-block">
                    <small>Risk</small>
                    <p>{konu.sorun}</p>
                  </div>
                  <div className="professor-note-block professor-note-block-solution">
                    <small>Cozum ve yapilacak is</small>
                    <p>{konu.cozum}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHeader
          etiket="Basinc ozeti"
          baslik={`${seciliBolge.ad} kaynak baskisi`}
          aciklama="Normal kosul ile firtina haftasi farki ayni tabloda okunur."
        />
        <DataTable
          columns={["Sistem", "Normal", "Firtina", "Aksiyon"]}
          rows={seciliBolge.kaynakBaski.map((item) => [item.sistem, item.normal, item.firtina, item.aksiyon])}
        />
      </Panel>
    </div>
  );
}
