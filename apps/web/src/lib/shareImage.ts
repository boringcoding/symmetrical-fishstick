export interface ShareCardData {
  phaseName: string;
  illumination: number;
  waxing: boolean;
  lunarDay: number;
  khmerLine: string; // the localized Chhankitek line
  gregorianLabel: string;
  signSymbol?: string;
  signName?: string;
  caption?: string;
  footer: string;
  lang: 'en' | 'km';
}

function drawMoon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  illum: number,
  waxing: boolean,
) {
  const f = Math.min(1, Math.max(0, illum / 100));
  const rx = r * Math.abs(2 * f - 1);
  const gibbous = f > 0.5;

  // aurora glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2.2);
  glow.addColorStop(0, 'rgba(123,92,255,0.4)');
  glow.addColorStop(0.5, 'rgba(0,224,255,0.12)');
  glow.addColorStop(1, 'rgba(5,5,12,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - r * 2.2, cy - r * 2.2, r * 4.4, r * 4.4);

  // dark disk
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  const dark = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
  dark.addColorStop(0, '#171d36');
  dark.addColorStop(1, '#0a0e1f');
  ctx.fillStyle = dark;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(232,201,135,0.2)';
  ctx.stroke();

  // lit region
  const path = () => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, !waxing);
    const anti = waxing ? !gibbous : gibbous;
    ctx.ellipse(cx, cy, rx, r, 0, Math.PI / 2, -Math.PI / 2, anti);
    ctx.closePath();
  };
  ctx.save();
  path();
  ctx.shadowColor = 'rgba(244,240,230,0.6)';
  ctx.shadowBlur = 50;
  const lit = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r * 1.05);
  lit.addColorStop(0, '#fffdf6');
  lit.addColorStop(0.6, '#f1ece0');
  lit.addColorStop(1, '#cfc7b3');
  ctx.fillStyle = lit;
  ctx.fill();
  ctx.restore();

  // maria
  ctx.save();
  path();
  ctx.clip();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#7c745f';
  for (const [mx, my, mr] of [
    [-0.25, -0.2, 0.16],
    [0.1, 0.28, 0.12],
    [0.32, -0.1, 0.08],
  ] as const) {
    ctx.beginPath();
    ctx.arc(cx + r * mx, cy + r * my, r * mr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function wrapCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

export async function buildShareImage(d: ShareCardData): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  try {
    await (document as any).fonts?.ready;
  } catch {
    /* fonts best-effort */
  }

  // background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#070a18');
  bg.addColorStop(0.7, '#05050c');
  bg.addColorStop(1, '#04040a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const topGlow = ctx.createRadialGradient(W * 0.7, -120, 60, W * 0.7, -120, 760);
  topGlow.addColorStop(0, 'rgba(123,92,255,0.22)');
  topGlow.addColorStop(1, 'rgba(5,5,12,0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, W, H);

  // stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 70; i++) {
    ctx.globalAlpha = Math.random() * 0.5 + 0.1;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.6 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';

  // header
  ctx.fillStyle = '#9c98cc';
  ctx.font = '700 30px Sora, sans-serif';
  ctx.fillText('🌙  L U N A', W / 2, 110);

  // moon
  drawMoon(ctx, W / 2, 430, 215, d.illumination, d.waxing);

  // phase name (gradient)
  const grad = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
  grad.addColorStop(0, '#ff5ec7');
  grad.addColorStop(0.5, '#7b5cff');
  grad.addColorStop(1, '#00e0ff');
  ctx.fillStyle = grad;
  ctx.font = '800 76px Sora, sans-serif';
  ctx.fillText(d.phaseName, W / 2, 790);

  // khmer / traditional date line
  const khmerFont = d.lang === 'km' ? '"Noto Sans Khmer"' : 'Sora';
  ctx.fillStyle = '#f4f0e6';
  ctx.font = `600 40px ${khmerFont}, sans-serif`;
  const afterKhmer = wrapCentered(ctx, d.khmerLine, W / 2, 870, W - 160, 56);

  // gregorian label
  ctx.fillStyle = '#9c98cc';
  ctx.font = '500 30px Sora, sans-serif';
  ctx.fillText(d.gregorianLabel, W / 2, afterKhmer + 28);

  // stat pills
  const pillsY = afterKhmer + 110;
  const pills: [string, string][] = [
    [`${d.illumination}%`, d.lang === 'km' ? 'ពន្លឺ' : 'illum'],
    [`${d.lunarDay}`, d.lang === 'km' ? 'ថ្ងៃច័ន្ទ' : 'lunar day'],
  ];
  if (d.signSymbol) pills.push([d.signSymbol, d.signName ?? '']);
  const pw = 250;
  const gap = 28;
  const totalW = pills.length * pw + (pills.length - 1) * gap;
  let px = (W - totalW) / 2;
  for (const [main, sub] of pills) {
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRect(ctx, px, pillsY, pw, 120, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, px, pillsY, pw, 120, 28);
    ctx.stroke();
    ctx.fillStyle = '#f4f0e6';
    ctx.font = '700 46px Sora, "Noto Sans Khmer", sans-serif';
    ctx.fillText(main, px + pw / 2, pillsY + 58);
    ctx.fillStyle = '#9c98cc';
    ctx.font = '500 24px Sora, "Noto Sans Khmer", sans-serif';
    ctx.fillText(sub, px + pw / 2, pillsY + 96);
    px += pw + gap;
  }

  // footer
  ctx.fillStyle = '#6f6b9c';
  ctx.font = '500 26px Sora, sans-serif';
  ctx.fillText(d.footer, W / 2, H - 60);

  return new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), 'image/png', 0.95),
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
