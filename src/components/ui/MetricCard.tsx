import type { DashboardMetric } from "../../types/mission";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className={`metric-card ${metric.ton ?? "dogal"}`}>
      <p>{metric.etiket}</p>
      <div>
        <strong>{metric.deger}</strong>
        <span>{metric.vurgu}</span>
      </div>
    </article>
  );
}
