import { useEffect, useRef } from 'react';

interface Props {
  illumination: number; // 0..100
  waxing: boolean;
  size?: number;
  /** hue accent for the aurora glow, degrees */
  accent?: 'violet' | 'gold';
}

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  c: string;
}

export function MoonOrb({ illumination, waxing, size = 300, accent = 'violet' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.3;
    const f = Math.min(1, Math.max(0, illumination / 100));
    const rx = r * Math.abs(2 * f - 1);
    const gibbous = f > 0.5;

    const dust: Dust[] = Array.from({ length: reduce ? 0 : 34 }, () => spawn());
    function spawn(): Dust {
      const palette =
        accent === 'gold'
          ? ['232,201,135', '255,223,170', '200,180,255']
          : ['190,170,255', '0,224,255', '255,94,199'];
      return {
        x: cx + (Math.random() - 0.5) * size * 0.8,
        y: cy + (Math.random() - 0.5) * size * 0.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.12 - Math.random() * 0.22,
        life: Math.random(),
        r: Math.random() * 1.8 + 0.4,
        c: palette[(Math.random() * palette.length) | 0],
      };
    }

    function moonPath() {
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, !waxing);
      const anti = waxing ? !gibbous : gibbous;
      ctx.ellipse(cx, cy, rx, r, 0, Math.PI / 2, -Math.PI / 2, anti);
      ctx.closePath();
    }

    let t0 = performance.now();
    let raf = 0;

    function frame(now: number) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, size, size);

      // --- aurora nebula glow ---
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
      const g1 = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 2.4);
      const a = accent === 'gold' ? '232,201,135' : '123,92,255';
      g1.addColorStop(0, `rgba(${a},${0.32 + pulse * 0.12})`);
      g1.addColorStop(0.45, `rgba(0,224,255,${0.1 + pulse * 0.06})`);
      g1.addColorStop(1, 'rgba(5,5,12,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, size, size);

      // --- dust ---
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        d.life -= 0.004;
        if (d.life <= 0 || d.y < cy - size * 0.5) Object.assign(d, spawn(), { life: 1 });
        const alpha = Math.sin(d.life * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${d.c},${alpha})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- moon dark disk ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      const dark = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      dark.addColorStop(0, '#171d36');
      dark.addColorStop(1, '#0a0e1f');
      ctx.fillStyle = dark;
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,201,135,0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // --- lit region with glow ---
      ctx.save();
      moonPath();
      ctx.shadowColor = 'rgba(244,240,230,0.55)';
      ctx.shadowBlur = 28;
      const lit = ctx.createRadialGradient(
        cx - r * 0.3,
        cy - r * 0.3,
        r * 0.1,
        cx,
        cy,
        r * 1.05,
      );
      lit.addColorStop(0, '#fffdf6');
      lit.addColorStop(0.6, '#f1ece0');
      lit.addColorStop(1, '#cfc7b3');
      ctx.fillStyle = lit;
      ctx.fill();
      ctx.restore();

      // --- maria, clipped to lit area ---
      ctx.save();
      moonPath();
      ctx.clip();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#7c745f';
      for (const [mx, my, mr] of [
        [-0.25, -0.2, 0.16],
        [0.1, 0.28, 0.12],
        [0.32, -0.1, 0.08],
        [-0.05, -0.45, 0.06],
      ] as const) {
        ctx.beginPath();
        ctx.arc(cx + r * mx, cy + r * my, r * mr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [illumination, waxing, size, accent]);

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Moon ${Math.round(illumination)}% illuminated`}
    />
  );
}
