import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp} from '../anim';
import {C, FONT} from '../theme';
import {ALL_LINES, type TWord} from '../timeline.ts';

type Page = {words: TWord[]; start: number; end: number; line: number; contIn?: boolean; contOut?: boolean};

const MAX_WORDS = 8;
const MAX_CHARS = 48;

// Pecah setiap baris narasi menjadi "halaman" subtitle (satu–dua baris layar).
const PAGES: Page[] = (() => {
  const pages: Page[] = [];
  for (const [li, line] of ALL_LINES.entries()) {
    let cur: TWord[] = [];
    const flush = () => {
      if (cur.length) pages.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end, line: li});
      cur = [];
    };
    line.words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((s, x) => s + x.text.length + 1, 0);
      const remaining = line.words.length - i - 1;
      const punct = /[,;:.]$/.test(w.text);
      if (remaining === 0) return;
      if (cur.length >= MAX_WORDS || chars >= MAX_CHARS || (punct && cur.length >= 3 && remaining >= 3)) flush();
    });
    flush();
  }
  const out: Page[] = pages.map((p, i) => {
    const next = pages[i + 1];
    const hold = p.end + 1.2;
    // halaman berikutnya langsung menyambung → kotak tidak berkedip (tanpa fade keluar/masuk)
    // (halaman dalam satu baris narasi selalu menyambung agar kapsul tidak sempat kosong)
    const contOut = !!next && (next.line === p.line || next.start - p.end < 0.5);
    return {...p, start: p.start - 0.12, end: next ? Math.min(hold, next.start - 0.12) : hold, contOut};
  });
  out.forEach((p, i) => {
    if (i > 0) p.contIn = out[i - 1].contOut;
  });
  return out;
})();

/** Subtitle kata-per-kata dalam kapsul kaca: kata kunci toska, kata yang sedang diucapkan bergaris magenta. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const page = PAGES.find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  const pin = page.contIn ? 1 : ramp(t, page.start, page.start + 0.22);
  const pout = page.contOut ? 1 : 1 - ramp(t, page.end - 0.2, page.end);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 84, pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 1500,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 500,
          lineHeight: 1.3,
          opacity: pin * pout,
          translate: `0px ${(1 - pin) * 10}px`,
          padding: '8px 30px 12px',
          borderRadius: 18,
          border: '1px solid transparent',
          background: `linear-gradient(rgba(10,11,34,0.8), rgba(10,11,34,0.8)) padding-box, linear-gradient(90deg, ${C.green}66, ${C.pink}66) border-box`,
          boxShadow: '0 8px 30px rgba(0,0,10,0.5)',
          color: C.ink,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = ramp(t, w.start - 0.04, w.start + 0.12);
          const active = Math.min(ramp(t, w.start - 0.06, w.start + 0.06), 1 - ramp(t, w.end, w.end + 0.16));
          const appear = ramp(t, page.start + i * 0.02, page.start + i * 0.02 + 0.28);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                position: 'relative',
                marginRight: '0.26em',
                opacity: appear * (0.55 + 0.45 * spoken),
                translate: `0px ${(1 - appear) * 8}px`,
                color: w.hl ? interpolateColors(spoken, [0, 1], [C.ink, C.green]) : C.ink,
                fontWeight: w.hl ? 600 : 400,
              }}
            >
              {w.text}
              <svg style={{position: 'absolute', left: '-2%', bottom: '-0.12em', width: '104%', height: '0.22em', overflow: 'visible', opacity: Math.max(active, w.hl ? spoken * 0.0 : 0)}} viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M1,5 H99" fill="none" stroke={w.hl ? C.green : C.pink} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              </svg>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
