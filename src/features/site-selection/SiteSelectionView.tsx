import { Panel } from "../../components/ui/Panel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { MarsRegionViewer } from "../../components/mars/MarsRegionViewer";
import type { Region } from "../../types/mission";

export function SiteSelectionView({
  regions,
  seciliBolge,
  onSelect
}: {
  regions: Region[];
  seciliBolge: Region;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="site-selection-grid">
      <Panel className="mars-panel">
        <SectionHeader
          etiket="3D çalışma alanı"
          baslik="Mars bölge seçimi"
          aciklama="Ana tuval büyük kalır; kutup ve yüksek enlem adayları yüzeyi boğmadan çevresinde açıklanır."
        />
        <MarsRegionViewer
          regions={regions}
          seciliBolge={seciliBolge}
          onSelect={onSelect}
          baslik="Su ve koruma odaklı Mars tuvali"
          aciklama="Kullanıcı, yalnızca koordinatı değil; su, sığınak ve ISRU mantığını da ilk bakışta anlamalı."
        />
      </Panel>

      <div className="stack-lg">
        <Panel>
          <SectionHeader
            etiket="Seçili bölge"
            baslik={`${seciliBolge.ad} / ${seciliBolge.sektor}`}
            aciklama={seciliBolge.tanim}
          />
          <div className="info-list">
            <div className="info-pair">
              <span>Ortalama eğim</span>
              <strong>{seciliBolge.ortalamaEğim}</strong>
            </div>
            <div className="info-pair">
              <span>Buz olasılığı</span>
              <strong>{seciliBolge.buzOlasiligi}</strong>
            </div>
            <div className="info-pair">
              <span>Toz riski</span>
              <strong>{seciliBolge.tozRiski}</strong>
            </div>
            <div className="info-pair">
              <span>İniş güvenliği</span>
              <strong>{seciliBolge.inisGuvenligi}</strong>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Seçim yardımı"
            baslik="Bu saha neden öne çıkıyor?"
            aciklama="Karar yalnızca düz zeminle değil; su, koruma ve ISRU birlikte açıklanır."
          />
          <ul className="detail-list">
            {seciliBolge.anaNotlar.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Aday karşılaştırma"
            baslik="Alternatif kutup koridorları"
            aciklama="Yan panelde su erişimi ve yer altı habitat mantığı öne alınır."
          />
          <div className="candidate-list">
            {regions.map((region) => (
              <button
                key={region.id}
                className={`candidate-card ${region.id === seciliBolge.id ? "active" : ""}`}
                onClick={() => onSelect(region.id)}
              >
                <strong>{region.ad}</strong>
                <span>{region.ozet}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
