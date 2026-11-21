import React from 'react';

interface BarcodeSvgProps {
  value?: string | null;
  compact?: boolean;
  displayValue?: boolean;
  height?: number;
  className?: string;
}

export const BarcodeSvg: React.FC<BarcodeSvgProps> = ({
  value,
  compact = false,
  displayValue = !compact,
  height = compact ? 18 : 36,
  className = '',
}) => {
  const code = (value || '89410000').trim();

  // Deterministic bar widths pattern based on string characters
  const bars: { width: number; space: number }[] = [];
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const w1 = (charCode % 3) + 1;
    const s1 = ((charCode >> 1) % 2) + 1;
    const w2 = ((charCode >> 2) % 3) + 1;
    const s2 = ((charCode >> 3) % 2) + 1;
    bars.push({ width: w1, space: s1 });
    bars.push({ width: w2, space: s2 });
  }

  // Calculate total SVG viewBox width
  let totalWidth = 6; // left margin
  bars.forEach((b) => {
    totalWidth += b.width + b.space;
  });
  totalWidth += 6; // right margin

  let currentX = 6;
  const barElements = bars.map((b, idx) => {
    const x = currentX;
    currentX += b.width + b.space;
    return (
      <rect
        key={idx}
        x={x}
        y={0}
        width={b.width}
        height={height}
        fill="currentColor"
      />
    );
  });

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{ height: `${height}px`, width: 'auto', maxWidth: compact ? '65px' : '130px' }}
        className="text-slate-800"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Guard bars at start and end */}
        <rect x={2} y={0} width={1.5} height={height} fill="currentColor" />
        <rect x={4} y={0} width={1} height={height} fill="currentColor" />
        {barElements}
        <rect x={totalWidth - 5} y={0} width={1} height={height} fill="currentColor" />
        <rect x={totalWidth - 3} y={0} width={1.5} height={height} fill="currentColor" />
      </svg>
      {displayValue && (
        <span className="text-[9.5px] font-mono font-medium text-slate-500 tracking-wider mt-0.5">
          {code}
        </span>
      )}
    </div>
  );
};
