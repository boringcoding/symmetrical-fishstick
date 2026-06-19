import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { OgService } from './og.service';
import { ANIMALS } from '../fortune/fortune.content';

const n = (v: string | undefined, d = 0) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : d;
};
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function webUrl(): string {
  let o = (process.env.CORS_ORIGIN || '').split(',')[0].trim();
  if (o && !/^https?:\/\//.test(o)) o = `https://${o}`;
  return o || 'https://lunar-web-zhl9.onrender.com';
}

function apiBase(req: Request): string {
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0] || 'https';
  return `${proto}://${req.headers.host}`;
}

@Controller()
export class OgController {
  constructor(private readonly og: OgService) {}

  private sendPng(res: Response, buf: Buffer) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.end(buf);
  }

  private sharePage(res: Response, title: string, desc: string, image: string) {
    const web = webUrl();
    const html = `<!doctype html><html lang="km"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${esc(image)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:image" content="${esc(image)}"/>
<title>${esc(title)}</title>
<meta http-equiv="refresh" content="0; url=${esc(web)}"/>
<script>location.replace(${JSON.stringify(web)})</script>
</head><body style="background:#05050c"></body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(html);
  }

  // ---- PNG cards ----
  @Get('og/fortune.png')
  fortunePng(@Res() res: Response, @Query() q: Record<string, string>) {
    this.sendPng(
      res,
      this.og.fortunePng({
        animalIndex: n(q.ai),
        score: n(q.s),
        love: n(q.lo),
        money: n(q.mo),
        health: n(q.he),
        luckyNumber: n(q.num, 1),
        colorHex: `#${(q.c || 'e8c987').replace('#', '')}`,
      }),
    );
  }

  @Get('og/compat.png')
  compatPng(@Res() res: Response, @Query() q: Record<string, string>) {
    this.sendPng(res, this.og.compatPng({ aIndex: n(q.a), bIndex: n(q.b), score: n(q.s) }));
  }

  // ---- Share pages (crawler reads OG meta; humans get redirected to the app) ----
  @Get('s/fortune')
  shareFortune(@Req() req: Request, @Res() res: Response, @Query() q: Record<string, string>) {
    const km = q.lang === 'km';
    const animal = ANIMALS[n(q.ai)];
    const score = n(q.s);
    const img = `${apiBase(req)}/api/og/fortune.png?ai=${n(q.ai)}&s=${score}&lo=${n(q.lo)}&mo=${n(
      q.mo,
    )}&he=${n(q.he)}&num=${n(q.num, 1)}&c=${(q.c || 'e8c987').replace('#', '')}`;
    const title = km
      ? `🌙 រាសីខ្ញុំថ្ងៃនេះ ${score}%`
      : `🌙 My fortune today: ${score}%`;
    const desc = km
      ? `ឆ្នាំ${animal?.km ?? ''} · លេខសំណាង ${n(q.num, 1)} · មកមើលរាសីអ្នកផង →`
      : `Year of the ${animal?.en ?? ''} · lucky number ${n(q.num, 1)} · see your own fortune →`;
    this.sharePage(res, title, desc, img);
  }

  @Get('s/compat')
  shareCompat(@Req() req: Request, @Res() res: Response, @Query() q: Record<string, string>) {
    const km = q.lang === 'km';
    const a = ANIMALS[n(q.a)];
    const b = ANIMALS[n(q.b)];
    const score = n(q.s);
    const img = `${apiBase(req)}/api/og/compat.png?a=${n(q.a)}&b=${n(q.b)}&s=${score}`;
    const title = km ? `💞 យើងត្រូវគ្នា ${score}%` : `💞 We match ${score}%`;
    const desc = km
      ? `${a?.km ?? ''} + ${b?.km ?? ''} · មកសាកគូស្នេហ៍អ្នកផង →`
      : `${a?.en ?? ''} + ${b?.en ?? ''} · check your own love match →`;
    this.sharePage(res, title, desc, img);
  }
}
