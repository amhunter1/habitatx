export function SectionHeader({
  etiket,
  baslik,
  aciklama
}: {
  etiket: string;
  baslik: string;
  aciklama: string;
}) {
  return (
    <div className="section-header">
      <p className="eyebrow">{etiket}</p>
      <h3>{baslik}</h3>
      <p>{aciklama}</p>
    </div>
  );
}
