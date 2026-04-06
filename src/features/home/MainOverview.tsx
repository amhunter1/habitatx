import { useState } from "react";
import { Panel } from "../../components/ui/Panel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SelectField } from "../../components/ui/SelectField";
import { RangeField } from "../../components/ui/RangeField";
import { StatCard } from "../../components/ui/StatCard";
import { MarsRegionViewer } from "../../components/mars/MarsRegionViewer";
import type { Region } from "../../types/mission";

export function MainOverview({
  regions,
  bolgeId,
  setBolgeId,
  ekipBuyuklugu,
  setEkipBuyuklugu,
  gorevSuresi,
  setGorevSuresi,
  riskProfili,
  setRiskProfili,
  seciliBolge,
  onDevam
}: {
  regions: Region[];
  bolgeId: string;
  setBolgeId: (id: string) => void;
  ekipBuyuklugu: number;
  setEkipBuyuklugu: (value: number) => void;
  gorevSuresi: number;
  setGorevSuresi: (value: number) => void;
  riskProfili: string;
  setRiskProfili: (value: string) => void;
  seciliBolge: Region;
  onDevam: () => void;
}) {
  const [detayAcik, setDetayAcik] = useState(false);

  return (
    <div className="stack-xl">
      <Panel className="mars-overview-panel">
        <SectionHeader
          etiket="Habitat Merkezi"
          baslik="Kutup ve Yüksek Enlem Sahaları"
          aciklama="Mars üzerinde iniş ve habitat kurulumuna en uygun, su buzu açısından zengin bölgeler"
        />
        <div style={{ marginBottom: '2rem' }}>
          <MarsRegionViewer
            regions={regions}
            seciliBolge={seciliBolge}
            onSelect={setBolgeId}
            baslik="Etkileşimli Mars Küresi"
            aciklama="Pinleri tıklayarak bölge değiştirebilirsiniz."
          />
        </div>

        <div className="three-column-grid">
          <StatCard etiket="Bölge Adı" deger={seciliBolge.ad} yardimci={seciliBolge.sektor} />
          <StatCard
            etiket="Kurulum Penceresi"
            deger={seciliBolge.kurulumPenceresi}
            yardimci="Radyasyon/Toz"
          />
          <StatCard
            etiket="Buz Olasılığı / İniş"
            deger={seciliBolge.buzOlasiligi}
            yardimci={`Güvenlik: ${seciliBolge.inisGuvenligi}`}
          />
        </div>
        <div className="metric-grid" style={{ marginTop: '1rem' }}>
          {seciliBolge.cevreOzeti.slice(0, 4).map((item) => (
            <article key={item.etiket} className="telemetry-card">
              <span>{item.etiket}</span>
              <strong>{item.deger}</strong>
              <p>{item.yardimci}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel className="quick-setup-panel">
        <SectionHeader
          etiket="Görev Başlatma Konsolu"
          baslik="Temel Parametreler"
          aciklama="Simülasyonu başlatmak için ekip, süre ve risk profilini ayarlayın."
        />

        <div className="metric-grid">
          <SelectField
            label="Seçili Saha"
            value={bolgeId}
            onChange={setBolgeId}
            options={regions.map((region) => ({
              label: `${region.ad} (${region.sektor})`,
              value: region.id
            }))}
          />
          <RangeField
            label="Ekip Büyüklüğü"
            value={ekipBuyuklugu}
            min={12}
            max={60}
            step={4}
            suffix="kişi"
            onChange={setEkipBuyuklugu}
          />
          <RangeField
            label="Görev Süresi (Ay)"
            value={gorevSuresi}
            min={12}
            max={96}
            step={6}
            suffix="ay"
            onChange={setGorevSuresi}
          />
          <SelectField
            label="Risk Profili"
            value={riskProfili}
            onChange={setRiskProfili}
            options={[
              { label: "Dengeli", value: "Dengeli" },
              { label: "Korunaklı", value: "Korunakli" },
              { label: "Agresif Büyüme", value: "Agresif buyume" }
            ]}
          />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="primary-button" style={{ padding: '0.75rem 3rem', fontSize: '1.1rem' }} onClick={onDevam}>
            Görev Analizine Geç →
          </button>
        </div>
      </Panel>

      <div className="two-column-grid">
        <Panel>
          <SectionHeader
            etiket="Arazi Notları"
            baslik="Saha Karakteristiği"
            aciklama={seciliBolge.tanim}
          />
          <ul className="detail-list stack-sm">
            {seciliBolge.anaNotlar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <article className="summary-note-card" style={{ marginTop: '1rem' }}>
            <strong>{seciliBolge.habitatModu}</strong>
            <p>{seciliBolge.habitatGerekcesi}</p>
          </article>
        </Panel>
        <Panel>
          <SectionHeader
            etiket="Bağımsızlık Metrikleri"
            baslik="ISRU ve Lojistik Uygunluğu"
            aciklama="Yüksek enlem ve kutup parametrelerine dayalı NASA referanslı analiz"
          />
          <div className="stack-md">
            <ProgressBar etiket={`ISRU Hazırlığı (${seciliBolge.isruSkoru}/100)`} deger={seciliBolge.isruSkoru} />
            <ProgressBar etiket={`Uygunluk Skoru (${seciliBolge.uygunlukSkoru}/100)`} deger={seciliBolge.uygunlukSkoru} />
            <ProgressBar etiket={`Lojistik Skoru (${seciliBolge.lojistikSkoru}/100)`} deger={seciliBolge.lojistikSkoru} />
          </div>
          <p className="helper-text" style={{ marginTop: '1rem' }}>{seciliBolge.nasaReferansNotu}</p>
        </Panel>
      </div>
    </div>
  );
}
