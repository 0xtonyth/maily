import { ScanIcon } from 'lucide-react';

type BorderRadiusProps = {
  value: number;
  onChange: (value: number) => void;
};

export function BorderRadius(props: BorderRadiusProps) {
  const { value, onChange } = props;

  return (
    <div className="mly-relative mly-flex mly-items-center mly-justify-center">
      <ScanIcon size={14} className="mly-absolute mly-left-1.5" />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="hide-number-controls focus-visible:outline-none mly-h-auto mly-max-w-12 mly-border-0 mly-border-none mly-p-1 mly-pl-[26px] mly-text-sm mly-tabular-nums mly-outline-none"
        min={0}
      />
    </div>
  );
}
