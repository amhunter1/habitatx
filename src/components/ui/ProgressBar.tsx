export function ProgressBar({
  etiket,
  deger,
  yardimci
}: {
  etiket: string;
  deger: number;
  yardimci?: string;
}) {
  return (
    <div className="progress-block">
      <div className="progress-copy">
        <span>{etiket}</span>
        <strong>{deger}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${deger}%` }} />
      </div>
      {yardimci ? <p className="helper-text">{yardimci}</p> : null}
    </div>
  );
}
