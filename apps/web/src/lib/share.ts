import { buildShareImage, type ShareCardData } from './shareImage';

export async function shareResult(
  data: ShareCardData,
  link: string,
): Promise<'shared' | 'downloaded'> {
  const blob = await buildShareImage(data);
  const file = new File([blob], 'luna-moon.png', { type: 'image/png' });
  const nav = navigator as any;

  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: 'Luna', text: data.caption ?? 'My moon today', url: link });
    } catch {
      /* user cancelled — treat as done */
    }
    return 'shared';
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'luna-moon.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}

export async function shareImage(
  blob: Blob,
  opts: { filename?: string; text?: string; link?: string },
): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], opts.filename ?? 'luna.png', { type: 'image/png' });
  const nav = navigator as any;
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], text: opts.text, url: opts.link });
    } catch {
      /* cancelled */
    }
    return 'shared';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.filename ?? 'luna.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}

export function buildShareLink(opts: {
  date: string;
  lat?: number | null;
  lng?: number | null;
  tz?: number | null;
}): string {
  const params = new URLSearchParams({ share: opts.date });
  if (opts.lat != null) params.set('lat', String(opts.lat));
  if (opts.lng != null) params.set('lng', String(opts.lng));
  if (opts.tz != null) params.set('tz', String(opts.tz));
  return `${location.origin}/?${params.toString()}`;
}

export async function copyLink(link: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    return false;
  }
}
