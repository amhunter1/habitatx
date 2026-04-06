import { useMemo, useState } from "react";
import { Panel } from "../../components/ui/Panel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Timeline } from "../../components/ui/Timeline";
import type { Region, ReportSection, Scenario, TimelineItem } from "../../types/mission";

export function AiReportView({
  seciliBolge,
  seciliSenaryo,
  executiveSummary,
  technicalSummary,
  raporBolumleri,
  sonrakiAdimlar
}: {
  seciliBolge: Region;
  seciliSenaryo: Scenario;
  executiveSummary: string;
  technicalSummary: string;
  raporBolumleri: ReportSection[];
  sonrakiAdimlar: TimelineItem[];
}) {
  const [detayAcik, setDetayAcik] = useState(false);
  const oneCikanBolumler = useMemo(() => raporBolumleri.slice(0, 3), [raporBolumleri]);

  return (
    <div className="stack-xl">
      <Panel>
        <SectionHeader
          etiket="Anlati"
          baslik="AI karar raporu"
          aciklama="Bu sayfa sadece raporun kendisine odaklanir: ozet, teknik cerceve, aksiyonlar ve detayli bolumler."
        />
        <article className="report-card professor-summary-card">
          <div className="professor-summary-head">
            <div>
              <span>Aktif saha</span>
              <strong>{seciliBolge.ad}</strong>
            </div>
            <div>
              <span>Secili senaryo</span>
              <strong>{seciliSenaryo.ad}</strong>
            </div>
            <div>
              <span>Rapor bolumu</span>
              <strong>{raporBolumleri.length}</strong>
            </div>
          </div>
          <p>{executiveSummary || `${seciliBolge.ad} icin ${seciliSenaryo.ad} senaryosu hazirlaniyor.`}</p>
        </article>

        <div className="report-action-row">
          <button
            className="secondary-button"
            onClick={() => setDetayAcik((current) => !current)}
            type="button"
          >
            {detayAcik ? "Detaylari gizle" : "Detaylari goster"}
          </button>
        </div>
      </Panel>

      <div className="two-column-grid">
        <Panel>
          <SectionHeader
            etiket="Hizli aksiyon"
            baslik="Once yapilacaklar"
            aciklama="Uretilen rapordan cikan ilk operasyon adimlari burada toplanir."
          />
          <Timeline items={sonrakiAdimlar.slice(0, 5)} />
        </Panel>

        <Panel>
          <SectionHeader
            etiket="Teknik not"
            baslik="Raporun cekirdegi"
            aciklama="Kisa teknik cerceve, raporun geri kalanini okumadan ana yonelimi gosterir."
          />
          <article className="report-section report-section-featured">
            <strong>Teknik ozet</strong>
            <p>{technicalSummary}</p>
          </article>
        </Panel>
      </div>

      <Panel>
        <SectionHeader
          etiket="Kisa cerceve"
          baslik="Gorev uyumu"
          aciklama="Detay acilmadan da saha, senaryo ve rapor yonelimi gorunur kalir."
        />
        <div className="three-column-grid">
          <article className="report-section">
            <strong>Secili saha</strong>
            <p>{seciliBolge.ad}</p>
          </article>
          <article className="report-section">
            <strong>Aktif senaryo</strong>
            <p>{seciliSenaryo.ad}</p>
          </article>
          <article className="report-section">
            <strong>Yonetici ozeti</strong>
            <p>{executiveSummary}</p>
          </article>
        </div>
      </Panel>

      {detayAcik ? (
        <div className="stack-xl">
          <Panel className="report-detail-panel">
            <SectionHeader
              etiket="Detayli rapor"
              baslik="Bolum bazli inceleme"
              aciklama="Rapor artik sade kart listesi yerine numarali, daha okunur bir dokuman akisiyla aciliyor."
            />
            <div className="report-highlight-strip">
              {oneCikanBolumler.map((section, index) => (
                <article key={section.baslik} className="report-highlight-card">
                  <span>{`0${index + 1}`}</span>
                  <strong>{section.baslik}</strong>
                  <p>{section.metin}</p>
                </article>
              ))}
            </div>
            <div className="report-detail-stack">
              {raporBolumleri.map((section, index) => (
                <article key={section.baslik} className="report-detail-card">
                  <div className="report-detail-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="report-detail-copy">
                    <strong>{section.baslik}</strong>
                    <p>{section.metin}</p>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel className="report-actions-panel">
            <SectionHeader
              etiket="Tam aksiyon listesi"
              baslik="Operasyon onerileri"
              aciklama="Raporun cikardigi tum sonraki adimlar burada tek bir operasyon panosunda tutulur."
            />
            <Timeline items={sonrakiAdimlar} />
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
