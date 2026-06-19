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

// ---- Vertical (9:16) fortune & compatibility cards for feed sharing ----

function verticalBase(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0a0c1e');
  bg.addColorStop(0.6, '#070a18');
  bg.addColorStop(1, '#05050c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H * 0.32, 60, W / 2, H * 0.32, W * 0.9);
  glow.addColorStop(0, 'rgba(123,92,255,0.28)');
  glow.addColorStop(0.5, 'rgba(255,94,199,0.1)');
  glow.addColorStop(1, 'rgba(5,5,12,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = Math.random() * 0.5 + 0.1;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function scoreArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, score: number) {
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.stroke();
  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  grad.addColorStop(0, '#ff5ec7');
  grad.addColorStop(0.5, '#7b5cff');
  grad.addColorStop(1, '#00e0ff');
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * score) / 100);
  ctx.strokeStyle = grad;
  ctx.stroke();
}

async function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  try {
    await (document as any).fonts?.ready;
  } catch {
    /* best effort */
  }
  return new Promise<Blob>((res) => canvas.toBlob((b) => res(b as Blob), 'image/png', 0.95));
}

export interface FortuneCard {
  animalEmoji: string;
  yearLabel: string; // "Year of the Pig" / "ឆ្នាំកុរ"
  score: number;
  luckyNumber: string;
  luckyColorName: string;
  luckyColorHex: string;
  headline: string;
  subs: { label: string; value: number }[];
  footer: string;
  lang: 'en' | 'km';
}

export async function buildFortuneImage(d: FortuneCard): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const khF = d.lang === 'km' ? '"Noto Sans Khmer"' : 'Sora';
  verticalBase(ctx, W, H);
  ctx.textAlign = 'center';

  ctx.fillStyle = '#9c98cc';
  ctx.font = '700 34px Sora, sans-serif';
  ctx.fillText('🌙  L U N A', W / 2, 150);

  ctx.font = '120px sans-serif';
  ctx.fillText(d.animalEmoji, W / 2, 350);

  ctx.fillStyle = '#f4f0e6';
  ctx.font = `700 56px ${khF}, sans-serif`;
  ctx.fillText(d.yearLabel, W / 2, 440);

  // score ring
  scoreArc(ctx, W / 2, 720, 180, d.score);
  ctx.fillStyle = '#fff';
  ctx.font = '800 150px Sora, sans-serif';
  ctx.fillText(`${d.score}`, W / 2, 760);
  ctx.fillStyle = '#9c98cc';
  ctx.font = `600 40px ${khF}, sans-serif`;
  ctx.fillText('%', W / 2, 830);

  // headline
  ctx.fillStyle = '#f4f0e6';
  ctx.font = `600 46px ${khF}, sans-serif`;
  const afterHead = wrapCentered(ctx, d.headline, W / 2, 1010, W - 150, 64);

  // sub scores row
  const subY = afterHead + 60;
  const sw = (W - 120) / d.subs.length;
  d.subs.forEach((s, i) => {
    const x = 60 + sw * i + sw / 2;
    ctx.fillStyle = '#fff';
    ctx.font = '800 64px Sora, sans-serif';
    ctx.fillText(`${s.value}`, x, subY + 10);
    ctx.fillStyle = '#9c98cc';
    ctx.font = `500 30px ${khF}, sans-serif`;
    ctx.fillText(s.label, x, subY + 56);
  });

  // lucky pills
  const ly = subY + 150;
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  roundRect(ctx, 90, ly, W - 180, 150, 32);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 90, ly, W - 180, 150, 32);
  ctx.stroke();
  ctx.fillStyle = '#9c98cc';
  ctx.font = `500 30px ${khF}, sans-serif`;
  ctx.fillText(d.lang === 'km' ? 'លេខសំណាង' : 'Lucky number', W / 2 - 220, ly + 56);
  ctx.fillText(d.lang === 'km' ? 'ពណ៌សំណាង' : 'Lucky colour', W / 2 + 220, ly + 56);
  ctx.fillStyle = '#f4f0e6';
  ctx.font = '800 70px Sora, sans-serif';
  ctx.fillText(d.luckyNumber, W / 2 - 220, ly + 120);
  ctx.fillStyle = d.luckyColorHex;
  ctx.beginPath();
  ctx.arc(W / 2 + 175, ly + 100, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f4f0e6';
  ctx.font = `700 44px ${khF}, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(d.luckyColorName, W / 2 + 205, ly + 116);
  ctx.textAlign = 'center';

  ctx.fillStyle = '#6f6b9c';
  ctx.font = '500 30px Sora, sans-serif';
  ctx.fillText(d.footer, W / 2, H - 80);

  return toPng(canvas);
}

export interface CompatCard {
  aEmoji: string;
  bEmoji: string;
  aLabel: string;
  bLabel: string;
  score: number;
  verdict: string;
  footer: string;
  lang: 'en' | 'km';
}

export async function buildCompatImage(d: CompatCard): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const khF = d.lang === 'km' ? '"Noto Sans Khmer"' : 'Sora';
  verticalBase(ctx, W, H);
  ctx.textAlign = 'center';

  ctx.fillStyle = '#9c98cc';
  ctx.font = '700 34px Sora, sans-serif';
  ctx.fillText('🌙  L U N A', W / 2, 150);

  // two animals + heart
  ctx.font = '150px sans-serif';
  ctx.fillText(d.aEmoji, W / 2 - 250, 470);
  ctx.fillText(d.bEmoji, W / 2 + 250, 470);
  ctx.font = '110px sans-serif';
  ctx.fillText('💞', W / 2, 460);

  ctx.fillStyle = '#f4f0e6';
  ctx.font = `600 44px ${khF}, sans-serif`;
  ctx.fillText(d.aLabel, W / 2 - 250, 560);
  ctx.fillText(d.bLabel, W / 2 + 250, 560);

  // big score
  scoreArc(ctx, W / 2, 900, 200, d.score);
  ctx.fillStyle = '#fff';
  ctx.font = '800 170px Sora, sans-serif';
  ctx.fillText(`${d.score}`, W / 2, 950);
  ctx.fillStyle = '#9c98cc';
  ctx.font = '600 44px Sora, sans-serif';
  ctx.fillText('%', W / 2, 1030);

  ctx.fillStyle = '#f4f0e6';
  ctx.font = `600 50px ${khF}, sans-serif`;
  wrapCentered(ctx, d.verdict, W / 2, 1300, W - 140, 70);

  ctx.fillStyle = '#6f6b9c';
  ctx.font = '500 30px Sora, sans-serif';
  ctx.fillText(d.footer, W / 2, H - 80);

  return toPng(canvas);
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
