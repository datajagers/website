export function Sectiekop({
  num,
  label,
  rechts,
}: {
  num: string;
  label: string;
  rechts?: string;
}) {
  return (
    <div className="sectiekop">
      <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
        <span className="ruit" aria-hidden="true" />
        <span>({num})</span>
      </span>
      <span style={{ whiteSpace: "nowrap" }}>({label})</span>
      {rechts ? <span className="rechts">{rechts}</span> : null}
    </div>
  );
}
