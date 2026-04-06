import { Panel } from "../../components/ui/Panel";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import { StatusList } from "../../components/ui/StatusList";
import { Timeline } from "../../components/ui/Timeline";
import type { Region, ResourceMetric, TimelineItem } from "../../types/mission";

type DashboardStatusItem = {
  etiket: string;
  deger: string;
  ton: "success" | "warning" | "info";
};

export function DashboardHome({
  seciliBolge,
  ekipBuyuklugu,
  gorevSuresi,
  kaynakMetrikleri,
  gorevAkisi,
  operasyonKartlari
}: {
  seciliBolge: Region;
  ekipBuyuklugu: number;
  gorevSuresi: number;
  kaynakMetrikleri: ResourceMetric[];
  gorevAkisi: TimelineItem[];
  operasyonKartlari: DashboardStatusItem[];
}) {
  return (
    <div className="dashboard-grid">
      <Panel>
        <SectionHeader
          etiket="Görev durumu"
          baslik="Program görünümü"
          aciklama="Canlı state ile gelen yüksek etkili sinyaller üstte tutulur."
        />
        <div className="stats-row">
          <StatCard etiket="Hedef ekip" deger={`${ekipBuyuklugu} kişi`} yardimci="Ana görev profili" />
          <StatCard etiket="Görev süresi" deger={`${gorevSuresi} ay`} yardimci="Uzun kalış modu" />
          <StatCard etiket="Bölge" deger={seciliBolge.ad} yardimci={seciliBolge.sektor} />
        </div>
        <div className="stack-md">
          {kaynakMetrikleri.map((metric) => (
            <ProgressBar key={metric.etiket} etiket={metric.etiket} deger={metric.deger} yardimci={metric.yorum} />
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHeader
          etiket="Yaklaşan kararlar"
          baslik="Karar kuyruğu"
          aciklama="Plan ve rapor state'inden gelen sonraki adımlar burada toplanır."
        />
        <Timeline items={gorevAkisi} />
      </Panel>

      <Panel>
        <SectionHeader
          etiket="Sinyaller"
          baslik="Operasyon güveni"
          aciklama="Sayısal skorlar ile kısa yorumlar birlikte okunur."
        />
        <StatusList items={operasyonKartlari} />
      </Panel>
    </div>
  );
}
