export function StatCard({
  etiket,
  deger,
  yardimci
}: {
  etiket: string;
  deger: string;
  yardimci: string;
}) {
  return (
    <article className="stat-card">
      <p>{etiket}</p>
      <strong>{deger}</strong>
      <span>{yardimci}</span>
    </article>
  );
}
