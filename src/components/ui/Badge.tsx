export function Badge({
  ton,
  cocuk
}: {
  ton: "success" | "warning" | "info";
  cocuk: string;
}) {
  return <span className={`badge ${ton}`}>{cocuk}</span>;
}
