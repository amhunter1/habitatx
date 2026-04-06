import { Badge } from "./Badge";

export function StatusList({
  items
}: {
  items: {
    etiket: string;
    deger: string;
    ton: "success" | "warning" | "info";
  }[];
}) {
  return (
    <div className="status-list">
      {items.map((item) => (
        <div key={item.etiket} className="status-row">
          <div>
            <strong>{item.etiket}</strong>
            <p>{item.deger}</p>
          </div>
          <Badge ton={item.ton} cocuk={item.ton === "success" ? "iyi" : item.ton === "warning" ? "izle" : "bilgi"} />
        </div>
      ))}
    </div>
  );
}
