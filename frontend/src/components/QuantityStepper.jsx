"use client";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}) {
  const buttonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-base font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label="Quantity">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
