import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Lang } from '../types';

const ITEM = 40;
const VISIBLE = 5;

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  km: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
};

function daysInMonth(year: number, month1: number) {
  return new Date(year, month1, 0).getDate();
}

interface ColProps {
  items: string[];
  index: number;
  onIndex: (i: number) => void;
  width?: string;
}

function WheelColumn({ items, index, onIndex, width = 'flex-1' }: ColProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const settle = useRef<ReturnType<typeof setTimeout>>();

  // Position to the active index when it changes from outside (e.g. open / clamp).
  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = index * ITEM;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current!;
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM)));
      if (i !== index) onIndex(i);
    });
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const el = ref.current!;
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM)));
      el.scrollTo({ top: i * ITEM, behavior: 'smooth' });
    }, 90);
  };

  const pad = ((VISIBLE - 1) / 2) * ITEM;

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className={`pcol ${width} snap-y snap-mandatory overflow-y-scroll`}
      style={{
        height: VISIBLE * ITEM,
        scrollSnapType: 'y mandatory',
        WebkitMaskImage: 'linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent)',
        maskImage: 'linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent)',
      }}
    >
      <div style={{ height: pad }} />
      {items.map((it, i) => {
        const dist = Math.abs(i - index);
        return (
          <div
            key={i}
            className="flex snap-center items-center justify-center font-semibold tabular-nums"
            style={{
              height: ITEM,
              scrollSnapAlign: 'center',
              opacity: dist === 0 ? 1 : dist === 1 ? 0.45 : 0.2,
              transform: `scale(${dist === 0 ? 1 : 0.86})`,
              color: dist === 0 ? '#fff' : '#9c98cc',
              transition: 'opacity .15s, transform .15s',
            }}
          >
            {it}
          </div>
        );
      })}
      <div style={{ height: pad }} />
    </div>
  );
}

interface Props {
  open: boolean;
  lang: Lang;
  value: string | null; // YYYY-MM-DD
  title: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

export function DateWheel({ open, lang, value, title, confirmLabel, onClose, onConfirm }: Props) {
  const now = new Date();
  const init = value ? value.split('-').map(Number) : [1998, 1, 1];
  const years = Array.from({ length: now.getFullYear() - 1924 }, (_, i) => 1925 + i).reverse();

  const [yi, setYi] = useState(Math.max(0, years.indexOf(init[0])));
  const [mi, setMi] = useState((init[1] || 1) - 1);
  const [di, setDi] = useState((init[2] || 1) - 1);

  const year = years[yi] ?? now.getFullYear();
  const month1 = mi + 1;
  const dim = daysInMonth(year, month1);
  const days = Array.from({ length: dim }, (_, i) => String(i + 1));

  // Clamp the day if the month/year shrinks.
  useEffect(() => {
    if (di > dim - 1) setDi(dim - 1);
  }, [dim, di]);

  if (!open) return null;

  const confirm = () => {
    const d = String(Math.min(di + 1, dim)).padStart(2, '0');
    const m = String(month1).padStart(2, '0');
    onConfirm(`${year}-${m}-${d}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-xl animate-sheetup rounded-t-[26px] border-t p-4 pb-7"
        style={{
          borderColor: 'var(--line)',
          background: 'linear-gradient(180deg,#15132a,#0c0a18)',
          boxShadow: '0 -20px 60px rgba(0,0,0,.6)',
        }}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />
        <div className="mb-1 px-1 text-center text-sm font-semibold text-muted">{title}</div>

        <div className="relative my-2">
          {/* center highlight band */}
          <div
            className="pointer-events-none absolute inset-x-2 rounded-2xl border border-white/10 bg-white/5"
            style={{ top: 2 * ITEM, height: ITEM }}
          />
          <div className="flex gap-1">
            <WheelColumn items={days} index={di} onIndex={setDi} />
            <WheelColumn items={MONTHS[lang]} index={mi} onIndex={setMi} width="flex-[1.4]" />
            <WheelColumn items={years.map(String)} index={yi} onIndex={setYi} />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 text-center">
            {lang === 'km' ? 'បោះបង់' : 'Cancel'}
          </button>
          <button onClick={confirm} className="btn-primary flex-[1.6]">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function formatHumanDate(value: string | null, lang: Lang): string {
  if (!value) return '';
  const [y, m, d] = value.split('-').map(Number);
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}
