import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {rand} from '../anim';
import {C, H, MOOD_TINT, W} from '../theme';
import {TIMELINE} from '../timeline.ts';

const tintAt = (t: number) => {
  const stops: number[] = [];
  const colors: string[] = [];
  TIMELINE.scenes.forEach((s) => {
    stops.push(s.start + 0.01, Math.max(s.start + 0.02, s.end - 1.5));
    colors.push(MOOD_TINT[s.mood], MOOD_TINT[s.mood]);
  });
  return interpolateColors(t, stops, colors);
};

// Bintang tiga lapis (paralaks).
const STARS = Array.from({length: 260}, (_, i) => ({
  x: rand(i * 1.37) * W,
  y: rand(i * 2.91) * H,
  r: 0.5 + rand(i * 4.1) ** 3 * 2.2,
  layer: i % 3,
  tw: rand(i * 7.3) * 6.28,
  hue: rand(i * 5.9),
}));

// Jejak partikel ala kamar gelembung: spiral samar (motif "dunia partikel").
const TRACKS = Array.from({length: 7}, (_, i) => {
  const x0 = 120 + rand(i * 3.3) * (W - 240);
  const y0 = 120 + rand(i * 8.1) * (H - 240);
  const dir = rand(i * 2.2) > 0.5 ? 1 : -1;
  const a0 = rand(i * 6.6) * Math.PI * 2;
  const pts: string[] = [];
  for (let k = 0; k <= 90; k++) {
    const u = k / 90;
    const r = 260 * (1 - u) ** 1.6 + 8;
    const a = a0 + dir * u * Math.PI * 3.4;
    const cx = x0 + Math.cos(a0) * 220 * u;
    const cy = y0 + Math.sin(a0) * 220 * u;
    pts.push(`${k ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return {d: pts.join(' '), col: [C.green, C.pink, C.blue, C.lilac][i % 4], o: 0.05 + rand(i * 9.9) * 0.05};
});

/** Latar semesta: langit nila, nebula toska–magenta, bintang berkelip, jejak partikel samar. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const tint = tintAt(t);
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 75% at 50% 46%, ${tint} 0%, ${C.bg2} 45%, ${C.bg} 100%)`}} />
      {/* nebula */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 38% 30% at ${18 + 4 * Math.sin(t * 0.05)}% ${78 + 3 * Math.cos(t * 0.04)}%, rgba(95,240,207,0.13), transparent 70%),
            radial-gradient(ellipse 34% 28% at ${84 + 3 * Math.cos(t * 0.045)}% ${20 + 4 * Math.sin(t * 0.05)}%, rgba(255,111,207,0.12), transparent 70%),
            radial-gradient(ellipse 30% 22% at ${60 + 5 * Math.sin(t * 0.03)}% ${70}%, rgba(124,120,255,0.08), transparent 70%)`,
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {TRACKS.map((tr, i) => (
          <path key={i} d={tr.d} fill="none" stroke={tr.col} strokeOpacity={tr.o} strokeWidth={1.6} />
        ))}
        {STARS.map((s, i) => {
          const sp = [3, 7, 13][s.layer];
          const x = (((s.x - t * sp) % W) + W) % W;
          const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * (1 + s.layer) + s.tw));
          const col = s.hue < 0.15 ? C.pink : s.hue < 0.3 ? C.green : '#ffffff';
          return <circle key={i} cx={x} cy={s.y} r={s.r} fill={col} opacity={tw * (0.35 + 0.25 * s.layer)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Sudut HUD tipis bergradasi (pengganti bingkai). */
export const Frame: React.FC = () => {
  const L = 70;
  const m = 34;
  const corners = [
    [m, m, 1, 1],
    [W - m, m, -1, 1],
    [m, H - m, 1, -1],
    [W - m, H - m, -1, -1],
  ];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="hud" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.green} />
            <stop offset="100%" stopColor={C.pink} />
          </linearGradient>
        </defs>
        {corners.map(([x, y, sx, sy], i) => (
          <path key={i} d={`M${x},${y + sy * L} V${y} H${x + sx * L}`} fill="none" stroke="url(#hud)" strokeWidth={2} strokeOpacity={0.55} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Vignette gelap ke tepi. */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 95% 85% at 50% 45%, transparent 60%, rgba(0,0,8,0.55) 100%)'}} />
);
