import { useState } from "react";
import { Panel } from "../../components/ui/Panel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SelectField } from "../../components/ui/SelectField";
import { RangeField } from "../../components/ui/RangeField";
import type { PlanningImpactMetric } from "../../types/mission";

const steps = [
  "Görev amacı",
  "Ekip ve süre",
  "Risk çerçevesi",
  "Enerji karması",
  "Su ve ISRU",
  "Operasyon etkisi"
];

export function MissionConfigView({
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
  analizHesaplaniyor,
  onAnalize
}: {
  ekipBuyuklugu: number;
  setEkipBuyuklugu: (value: number) => void;
  gorevSuresi: number;
  setGorevSuresi: (value: number) => void;
  riskProfili: string;
  setRiskProfili: (value: string) => void;
  missionPurpose: string;
  setMissionPurpose: (value: string) => void;
  energyStrategy: string;
  setEnergyStrategy: (value: string) => void;
  waterStrategy: string;
  setWaterStrategy: (value: string) => void;
  planningImpactMetrics: PlanningImpactMetric[];
  analizHesaplaniyor: boolean;
  onAnalize: () => void;
}) {
  const [gelismisAcik, setGelismisAcik] = useState(false);

  return (
    <div className="stack-xl" style={{ position: 'relative' }}>
      {analizHesaplaniyor && (
        <div className="analiz-overlay">
          <div className="analiz-overlay-content">
            <div className="analiz-spinner" />
            <h3>Analiz hesaplanıyor</h3>
            <p>Görev brief'i backend'e gönderildi. Bölge analizi, plan, senaryo ve rapor üretiliyor…</p>
            <div className="analiz-steps">
              <span className="analiz-step active">Bölge analizi</span>
              <span className="analiz-step">Plan üretimi</span>
              <span className="analiz-step">Senaryo hesaplama</span>
              <span className="analiz-step">Rapor oluşturma</span>
            </div>
          </div>
        </div>
      )}

      <Panel>
        <SectionHeader
          etiket="Sihirbaz"
          baslik="Görev brief'i"
          aciklama="İlk bölüm temel kararları toplar. Gelişmiş ayarlar kapalıysa sistem bunları kutup odaklı yer altı habitat brief'ine otomatik dönüştürür."
        />
        <div className="wizard-steps">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`wizard-step ${index < 3 ? "complete" : index === 3 ? "active" : ""}`}
            >
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </Panel>

      <div className="two-column-grid">
        <Panel className="stack-md">
          <SectionHeader
            etiket="Temel brief"
            baslik="Önce ana kararları sabitle"
            aciklama="Bu alan açık kaldığında sistem güvenli varsayılanlarla teknik skoru bozmayacak şekilde enerji, su ve habitat ayrıntılarını kendisi üretir."
          />
          <div className="form-grid">
            <SelectField
              label="Görev amacı *"
              value={missionPurpose}
              onChange={setMissionPurpose}
              options={[
                { label: "Kalıcı habitat", value: "Kalıcı habitat" },
                { label: "Araştırma üssü", value: "Araştırma üssü" },
                { label: "Üretim öncülü", value: "Üretim öncülü" }
              ]}
            />
            <SelectField
              label="Risk profili *"
              value={riskProfili}
              onChange={setRiskProfili}
              options={[
                { label: "Dengeli", value: "Dengeli" },
                { label: "Korunaklı", value: "Korunaklı" },
                { label: "Agresif büyüme", value: "Agresif büyüme" }
              ]}
            />
            <RangeField
              label="Ekip büyüklüğü *"
              value={ekipBuyuklugu}
              min={12}
              max={60}
              step={4}
              suffix="kişi"
              onChange={setEkipBuyuklugu}
            />
            <RangeField
              label="Görev süresi *"
              value={gorevSuresi}
              min={12}
              max={96}
              step={6}
              suffix="ay"
              onChange={setGorevSuresi}
            />
          </div>

          <button
            className="secondary-button"
            onClick={() => setGelismisAcik((current) => !current)}
            type="button"
          >
            {gelismisAcik ? "Özel detayları gizle" : "Özel detayları aç"}
          </button>

          {!gelismisAcik ? (
            <article className="summary-note-card">
              <strong>Otomatik dengeleme açık</strong>
              <p>
                Sistem enerji karması, su çıkarımı, regolit kalkanı ve bakım otomasyonunu seçtiğin
                ekip, süre ve risk profiline göre otomatik kalibre ediyor.
              </p>
            </article>
          ) : null}

          {gelismisAcik ? (
            <div className="stack-md">
              <div className="form-grid">
                <SelectField
                  label="Enerji tercihi"
                  value={energyStrategy}
                  onChange={setEnergyStrategy}
                  options={[
                    { label: "Güneş + kompakt nükleer", value: "Güneş + kompakt nükleer" },
                    { label: "Ağırlıklı güneş", value: "Ağırlıklı güneş" },
                    { label: "Ağırlıklı nükleer", value: "Ağırlıklı nükleer" }
                  ]}
                />
                <SelectField
                  label="Su stratejisi"
                  value={waterStrategy}
                  onChange={setWaterStrategy}
                  options={[
                    { label: "Buz çıkarımı + geri kazanım", value: "Buz çıkarımı + geri kazanım" },
                    { label: "Ağırlıklı geri kazanım", value: "Ağırlıklı geri kazanım" }
                  ]}
                />
              </div>

              <div className="stack-md">
                {planningImpactMetrics.map((metric) => (
                  <ProgressBar
                    key={metric.etiket}
                    etiket={metric.etiket}
                    deger={metric.deger}
                    yardimci={metric.yorum}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Anlık etki"
            baslik="Sistem bu brief'i nasıl yorumluyor?"
            aciklama="Temel ayarlar kapalı olsa da skor mantığı görünür kalır; böylece kullanıcı sade akışta kalırken sonuç körleşmez."
          />
          <div className="stack-md">
            {planningImpactMetrics.map((metric) => (
              <ProgressBar
                key={metric.etiket}
                etiket={metric.etiket}
                deger={metric.deger}
                yardimci={metric.yorum}
              />
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="analiz-action-panel">
        <SectionHeader
          etiket="Sonraki adım"
          baslik="Brief tamamlandı mı?"
          aciklama="Görev parametrelerini seçtikten sonra aşağıdaki butonla backend analiz sürecini başlatabilirsin. Sistem bölge analizi, plan üretimi ve senaryo hesaplaması yapacak."
        />
        <button
          className="primary-button full-width analiz-baslat-button"
          onClick={onAnalize}
          disabled={analizHesaplaniyor}
          type="button"
        >
          {analizHesaplaniyor ? "Hesaplanıyor…" : "Analiz sonuçlarını hesapla →"}
        </button>
      </Panel>
    </div>
  );
}
