type Option = {
  label: string;
  value: string | number;
};

export function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
}) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
