import type { TimelineItem } from "../../types/mission";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={item.baslik}>
          <strong>{item.baslik}</strong>
          <p>{item.detay}</p>
        </li>
      ))}
    </ol>
  );
}
