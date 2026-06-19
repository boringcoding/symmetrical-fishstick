interface Props {
  illumination: number; // 0..100
  waxing: boolean;
  size?: number;
}

/**
 * Renders the Moon with the actual illuminated fraction.
 * The lit region is built from the lit outer limb plus an elliptical terminator.
 */
export function MoonVisual({ illumination, waxing, size = 220 }: Props) {
  const r = size / 2;
  const f = Math.min(1, Math.max(0, illumination / 100));
  const rx = r * Math.abs(2 * f - 1); // terminator semi-width
  const gibbous = f > 0.5;
  const outerSweep = waxing ? 1 : 0; // lit limb side
  const termSweep = gibbous ? outerSweep : 1 - outerSweep;

  const litPath = [
    `M 0 ${-r}`,
    `A ${r} ${r} 0 0 ${outerSweep} 0 ${r}`,
    `A ${rx} ${r} 0 0 ${termSweep} 0 ${-r}`,
    'Z',
  ].join(' ');

  const id = `moon-${Math.round(illumination)}-${waxing ? 'w' : 'n'}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-r - 6} ${-r - 6} ${size + 12} ${size + 12}`}
      className="drop-shadow-[0_0_40px_rgba(244,240,230,0.25)]"
      role="img"
      aria-label={`Moon ${Math.round(illumination)}% illuminated`}
    >
      <defs>
        <radialGradient id={`${id}-lit`} cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="60%" stopColor="#f4f0e6" />
          <stop offset="100%" stopColor="#cfc7b3" />
        </radialGradient>
        <radialGradient id={`${id}-dark`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#171d36" />
          <stop offset="100%" stopColor="#0c1024" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* dark side of the disk */}
      <circle cx="0" cy="0" r={r} fill={`url(#${id}-dark)`} stroke="rgba(232,201,135,0.15)" />
      {/* lit region */}
      <path d={litPath} fill={`url(#${id}-lit)`} filter={`url(#${id}-glow)`} />

      {/* subtle maria/craters on the lit area, clipped to the disk */}
      <clipPath id={`${id}-clip`}>
        <path d={litPath} />
      </clipPath>
      <g clipPath={`url(#${id}-clip)`} opacity="0.12" fill="#7c745f">
        <circle cx={-r * 0.25} cy={-r * 0.2} r={r * 0.16} />
        <circle cx={r * 0.1} cy={r * 0.28} r={r * 0.12} />
        <circle cx={r * 0.32} cy={-r * 0.1} r={r * 0.08} />
        <circle cx={-r * 0.05} cy={-r * 0.45} r={r * 0.06} />
      </g>
    </svg>
  );
}
