import { DataTable } from "../../components/ui/DataTable";
import { Panel } from "../../components/ui/Panel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeader } from "../../components/ui/SectionHeader";
import type { Scenario } from "../../types/mission";

export function ScenarioComparisonView({
  senaryolar,
  seciliSenaryo,
  onSelect
}: {
  senaryolar: Scenario[];
  seciliSenaryo: Scenario;
  onSelect: (ad: Scenario["ad"]) => void;
}) {
  return (
    <div className="stack-xl">
      <Panel>
        <SectionHeader
          etiket="Senaryo motoru"
          baslik="Alternatif plan karşılaştırması"
          aciklama="Sekmeler, karşılaştırmalı karar okumayı hızlandıran segmented control mantığında çalışır."
        />
        <div className="segmented-row">
          {senaryolar.map((scenario) => (
            <button
              key={scenario.ad}
              className={`segment ${scenario.ad === seciliSenaryo.ad ? "active" : ""}`}
              onClick={() => onSelect(scenario.ad)}
            >
              {scenario.ad}
            </button>
          ))}
        </div>
      </Panel>

      <div className="two-column-grid">
        <Panel>
          <SectionHeader etiket="Seçili senaryo" baslik={seciliSenaryo.ad} aciklama={seciliSenaryo.aciklama} />
          <DataTable
            columns={["Metrik", "Değer", "Yorum"]}
            rows={[
              ["Görev uyumu", seciliSenaryo.gorevUyumu, "Ana hedeflerle eşleşme kalitesi"],
              ["Risk", seciliSenaryo.risk, "Düşük değer daha güvenli"],
              ["Otonomi", seciliSenaryo.otonomi, "Yüksek değer ikmal bağımlılığını düşürür"],
              ["Maliyet disiplini", seciliSenaryo.maliyetDisiplini, "Kaynak kullanım sertliği"]
            ]}
          />
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Trade-off"
            baslik="Karar anlatısı"
            aciklama="Karşılaştırma yalnızca sayı vermez; yönetsel sonuçları da açıklar."
          />
          <div className="stack-md">
            <ProgressBar etiket="Görev uyumu" deger={seciliSenaryo.gorevUyumu} />
            <ProgressBar etiket="Otonomi" deger={seciliSenaryo.otonomi} />
            <ProgressBar etiket="Maliyet disiplini" deger={seciliSenaryo.maliyetDisiplini} />
            <ProgressBar etiket="Risk kontrolü" deger={100 - seciliSenaryo.risk} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
