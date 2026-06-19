import { Injectable } from '@nestjs/common';
import { Resvg } from '@resvg/resvg-js';
import * as fs from 'fs';
import * as path from 'path';
import { ANIMALS } from '../fortune/fortune.content';

// Render OG cards with Latin + digits only (resvg lacks Khmer shaping); the
// Khmer hook lives in the share page's og:title/description instead.
function soraDir(): string {
  return path.dirname(require.resolve('@expo-google-fonts/sora/package.json'));
}

@Injectable()
export class OgService {
  private fontBuffers: Buffer[] = [];

  constructor() {
    try {
      const dir = soraDir();
      this.fontBuffers = [
        fs.readFileSync(path.join(dir, '800ExtraBold/Sora_800ExtraBold.ttf')),
        fs.readFileSync(path.join(dir, '700Bold/Sora_700Bold.ttf')),
        fs.readFileSync(path.join(dir, '600SemiBold/Sora_600SemiBold.ttf')),
        fs.readFileSync(path.join(dir, '400Regular/Sora_400Regular.ttf')),
      ];
    } catch {
      this.fontBuffers = [];
    }
  }

  private render(svg: string): Buffer {
    const opts: any = {
      font: { fontBuffers: this.fontBuffers, defaultFontFamily: 'Sora', loadSystemFonts: false },
      fitTo: { mode: 'width', value: 1200 },
    };
    const r = new Resvg(svg, opts);
    return Buffer.from(r.render().asPng());
  }

  private frame(inner: string): string {
    return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0c1e"/><stop offset="0.65" stop-color="#070a18"/><stop offset="1" stop-color="#05050c"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.1" r="0.9">
      <stop offset="0" stop-color="#7b5cff" stop-opacity="0.30"/><stop offset="0.5" stop-color="#ff5ec7" stop-opacity="0.10"/><stop offset="1" stop-color="#05050c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff5ec7"/><stop offset="0.5" stop-color="#7b5cff"/><stop offset="1" stop-color="#00e0ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${inner}
</svg>`;
  }

  private ring(cx: number, cy: number, r: number, score: number): string {
    const c = 2 * Math.PI * r;
    const off = c * (1 - score / 100);
    return `<g transform="rotate(-90 ${cx} ${cy})">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="22"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#ring)" stroke-width="22" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
    </g>`;
  }

  fortunePng(p: {
    animalIndex: number;
    score: number;
    love: number;
    money: number;
    health: number;
    luckyNumber: number;
    colorHex: string;
  }): Buffer {
    const animal = ANIMALS[p.animalIndex]?.en ?? '';
    const inner = `
      <text x="80" y="110" font-size="40" font-weight="700" fill="#9c98cc">L U N A</text>
      <text x="80" y="155" font-size="30" font-weight="600" fill="#6f6b9c">YOUR FORTUNE TODAY</text>
      ${this.ring(290, 360, 170, p.score)}
      <text x="290" y="345" font-size="150" font-weight="800" fill="#ffffff" text-anchor="middle">${p.score}</text>
      <text x="290" y="420" font-size="40" font-weight="700" fill="#9c98cc" text-anchor="middle">%</text>
      <text x="600" y="270" font-size="44" font-weight="700" fill="#e8c987">YEAR OF THE ${animal.toUpperCase()}</text>
      <text x="600" y="350" font-size="34" font-weight="600" fill="#cfc7e0">LOVE ${p.love}   ·   MONEY ${p.money}   ·   HEALTH ${p.health}</text>
      <rect x="600" y="400" width="520" height="96" rx="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)"/>
      <text x="628" y="448" font-size="26" font-weight="600" fill="#9c98cc">LUCKY NUMBER</text>
      <text x="628" y="486" font-size="34" font-weight="800" fill="#f4f0e6">${p.luckyNumber}</text>
      <text x="900" y="448" font-size="26" font-weight="600" fill="#9c98cc">COLOUR</text>
      <circle cx="918" cy="478" r="18" fill="${p.colorHex}"/>
      <text x="600" y="585" font-size="26" font-weight="600" fill="#6f6b9c">tap to see yours →</text>`;
    return this.render(this.frame(inner));
  }

  compatPng(p: { aIndex: number; bIndex: number; score: number }): Buffer {
    const a = ANIMALS[p.aIndex]?.en ?? '';
    const b = ANIMALS[p.bIndex]?.en ?? '';
    const inner = `
      <text x="600" y="120" font-size="40" font-weight="700" fill="#9c98cc" text-anchor="middle">L U N A · LOVE MATCH</text>
      <text x="600" y="210" font-size="56" font-weight="800" fill="#f4f0e6" text-anchor="middle">${a.toUpperCase()}  +  ${b.toUpperCase()}</text>
      ${this.ring(600, 400, 140, p.score)}
      <text x="600" y="430" font-size="150" font-weight="800" fill="#ffffff" text-anchor="middle">${p.score}</text>
      <text x="600" y="585" font-size="28" font-weight="600" fill="#6f6b9c" text-anchor="middle">check your match →</text>`;
    return this.render(this.frame(inner));
  }
}
