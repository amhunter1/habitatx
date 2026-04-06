import { DataTable } from "../../components/ui/DataTable";
import { Panel } from "../../components/ui/Panel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import type { PlanningImpactMetric, Region, ResourceMetric } from "../../types/mission";

export function SiteAnalysisView({
  seciliBolge,
  planningImpactMetrics,
  kaynakMetrikleri,
  ekipBuyuklugu,
  gorevSuresi,
  riskProfili,
  missionPurpose,
  energyStrategy,
  waterStrategy
}: {
  seciliBolge: Region;
  planningImpactMetrics: PlanningImpactMetric[];
  kaynakMetrikleri: ResourceMetric[];
  ekipBuyuklugu: number;
  gorevSuresi: number;
  riskProfili: string;
  missionPurpose: string;
  energyStrategy: string;
  waterStrategy: string;
}) {
  return (
    <div className="stack-xl">
      {/* ── Aktif görev brief özeti ── */}
      <Panel className="analiz-brief-banner">
        <SectionHeader
          etiket="Aktif brief"
          baslik="Bu analiz aşağıdaki görev parametreleriyle hesaplandı"
          aciklama="Parametreler değişirse analiz sonuçları da güncellenir."
        />
        <div className="stats-grid">
          <StatCard etiket="Görev amacı" deger={missionPurpose} yardimci="Seçilen misyon tipi" />
          <StatCard etiket="Ekip" deger={`${ekipBuyuklugu} kişi`} yardimci={`${gorevSuresi} ay süre`} />
          <StatCard etiket="Risk profili" deger={riskProfili} yardimci="Brief risk çerçevesi" />
          <StatCard etiket="Enerji" deger={energyStrategy} yardimci={waterStrategy} />
        </div>
      </Panel>

      {/* ── Saha skorları ── */}
      <section className="two-column-grid">
        <Panel>
          <SectionHeader
            etiket="Analiz özeti"
            baslik="Türetilmiş saha değerlendirmesi"
            aciklama="Ham gezegen verilerinden çok, karar vermeyi kolaylaştıran yorumlanmış metrikler öne çıkar."
          />
          <div className="stats-grid">
            <StatCard etiket="Uygunluk" deger={`${seciliBolge.uygunlukSkoru}`} yardimci={
              seciliBolge.uygunlukSkoru >= 70 ? "Yüksek güven bandı" : seciliBolge.uygunlukSkoru >= 50 ? "Orta güven bandı" : "Düşük — brief iyileştirmesi önerilir"
            } />
            <StatCard etiket="Risk indeksi" deger={`${seciliBolge.riskIndeksi}`} yardimci={
              seciliBolge.riskIndeksi >= 60 ? "Yüksek — erken faz önlemleri kritik" : seciliBolge.riskIndeksi >= 35 ? "Orta — yönetilebilir seviyede" : "Düşük risk bandı"
            } />
            <StatCard etiket="Genişleme" deger={`${seciliBolge.genislemeSkoru}`} yardimci={
              seciliBolge.genislemeSkoru >= 70 ? "Faz III uyumlu" : seciliBolge.genislemeSkoru >= 50 ? "Sınırlı genişleme potansiyeli" : "Genişleme zorlu"
            } />
            <StatCard etiket="Lojistik" deger={`${seciliBolge.lojistikSkoru}`} yardimci={
              seciliBolge.lojistikSkoru >= 65 ? "Kurulum akışı güçlü" : seciliBolge.lojistikSkoru >= 45 ? "Optimizasyon gerekli" : "Lojistik darboğaz riski"
            } />
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Kritik bayraklar"
            baslik="Dikkat gerektiren alanlar"
            aciklama="Riskler kısa, eyleme dönük ve karşılaştırmalı dil ile sunulur."
          />
          <ul className="detail-list">
            {seciliBolge.kirmiziBayraklar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {seciliBolge.anaNotlar.length > 0 && (
            <>
              <SectionHeader
                etiket="Güçlü yönler"
                baslik="Saha avantajları"
                aciklama=""
              />
              <ul className="detail-list">
                {seciliBolge.anaNotlar.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </section>

      {/* ── Brief'e göre hesaplanan etki metrikleri ── */}
      <section className="two-column-grid">
        <Panel>
          <SectionHeader
            etiket="Brief etkisi"
            baslik="Görev brief'ine göre operasyonel etki"
            aciklama="Bu metrikler ekip büyüklüğü, süre, enerji ve risk profiline göre dinamik hesaplanır."
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

        <Panel>
          <SectionHeader
            etiket="Kaynak skorları"
            baslik="Backend kaynak analizi"
            aciklama="Plan ve senaryo motorundan türetilen kaynak erişim ve dayanıklılık skorları."
          />
          {kaynakMetrikleri.length > 0 ? (
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
          ) : (
            <p className="helper-text">Kaynak metrikleri henüz hesaplanmadı.</p>
          )}
        </Panel>
      </section>

      {/* ── Kaynak baskı tablosu ── */}
      {seciliBolge.kaynakBaski.length > 0 && (
        <Panel>
          <SectionHeader
            etiket="Kaynak baskısı"
            baslik="Normal ve fırtına senaryosunda kaynak baskıları"
            aciklama="Her sistemin normal ve stres altı tepkisi ile önerilen aksiyon."
          />
          <DataTable
            columns={["Sistem", "Normal", "Fırtına", "Aksiyon"]}
            rows={seciliBolge.kaynakBaski.map((item) => [
              item.sistem,
              item.normal,
              item.firtina,
              item.aksiyon
            ])}
          />
        </Panel>
      )}

      {/* ── Detay tablo ── */}
      <Panel>
        <SectionHeader
          etiket="Detay tablo"
          baslik="Saha veri kırılımı"
          aciklama="Analiz ekranı teknik ekip için detaylı, yönetici için ise okunabilir kalmalı."
        />
        <DataTable
          columns={["Metrik", "Seviye", "Yorum"]}
          rows={seciliBolge.analizSatirlari.map((item) => [item.metrik, item.deger, item.yorum])}
        />
      </Panel>

      {/* ── Çevresel özet ── */}
      {seciliBolge.cevreOzeti.length > 0 && (
        <section className="two-column-grid">
          <Panel>
            <SectionHeader
              etiket="Çevre"
              baslik="Çevresel koşullar özeti"
              aciklama="NASA referans verileri ve saha parametrelerinden türetilmiş çevresel değerlendirme."
            />
            <div className="telemetry-summary-grid">
              {seciliBolge.cevreOzeti.map((item) => (
                <article key={item.etiket} className="telemetry-card">
                  <span>{item.etiket}</span>
                  <strong>{item.deger}</strong>
                  <p>{item.yardimci}</p>
                </article>
              ))}
            </div>
          </Panel>

          {seciliBolge.fazlar.length > 0 && (
            <Panel>
              <SectionHeader
                etiket="Faz planı"
                baslik="Kurulum fazları"
                aciklama="Brief parametrelerine ve bölge analizine göre önerilen kurulum fazları."
              />
              <div className="stack-md">
                {seciliBolge.fazlar.map((faz) => (
                  <article key={faz.faz} className="summary-note-card">
                    <strong>{faz.faz}: {faz.odak}</strong>
                    <p>{faz.teslimler.join(" • ")}</p>
                  </article>
                ))}
              </div>
            </Panel>
          )}
        </section>
      )}
    </div>
  );
}
