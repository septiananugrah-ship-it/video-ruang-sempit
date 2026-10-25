import React from 'react';
import {smoothPath} from '../anim';
import {C, FONT} from '../theme';

// Gambar kapur sederhana. (x, y) = pusat; s = skala; p = progres goresan 0..1.
const dash = (p: number) => (p < 1 ? {pathLength: 1, strokeDasharray: `${p} 1`} : {});

export const Carrot: React.FC<{x: number; y: number; s?: number; p?: number}> = ({x, y, s = 1, p = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-28)`} strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M-34,-70 C-40,-10 -18,60 0,120 C18,60 40,-10 34,-70 C14,-82 -14,-82 -34,-70 Z" stroke={C.orange} strokeWidth={5} {...dash(p)} />
    <path d="M-34,-70 C-40,-10 -18,60 0,120 C18,60 40,-10 34,-70 C14,-82 -14,-82 -34,-70 Z" fill={C.orange} fillOpacity={0.18 * p} stroke="none" />
    {[-30, 0, 28, 58].map((yy, i) => (
      <path key={i} d={`M${-22 + i * 4},${yy} q14,-4 22,2`} stroke={C.orange} strokeWidth={3} opacity={0.7 * p} />
    ))}
    <path d="M0,-80 C-10,-120 -30,-140 -44,-150 M0,-80 C2,-125 6,-150 4,-170 M0,-80 C12,-118 34,-136 48,-146" stroke={C.green} strokeWidth={5} {...dash(p)} />
  </g>
);

export const TV: React.FC<{x: number; y: number; s?: number; p?: number; glow?: number}> = ({x, y, s = 1, p = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" strokeLinejoin="round" fill="none">
    <rect x={-150} y={-95} width={300} height={180} rx={10} stroke={C.ink} strokeWidth={5} {...dash(p)} />
    {[C.red, C.green, C.blue].map((c, i) => (
      <rect key={i} x={-130 + i * 87} y={-75} width={80} height={140} fill={c} opacity={(0.12 + 0.3 * glow) * p} />
    ))}
    <path d="M-40,85 L-60,125 M40,85 L60,125 M-80,125 H80" stroke={C.ink} strokeWidth={5} {...dash(p)} />
  </g>
);

export const FlashDisk: React.FC<{x: number; y: number; s?: number; p?: number}> = ({x, y, s = 1, p = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-20)`} strokeLinecap="round" strokeLinejoin="round" fill="none">
    <rect x={-50} y={-100} width={100} height={170} rx={16} stroke={C.ink} strokeWidth={5} {...dash(p)} />
    <rect x={-32} y={-150} width={64} height={50} rx={4} stroke={C.muted} strokeWidth={4} {...dash(p)} />
    <rect x={-18} y={-138} width={12} height={12} stroke={C.muted} strokeWidth={3} opacity={p} />
    <rect x={6} y={-138} width={12} height={12} stroke={C.muted} strokeWidth={3} opacity={p} />
    <circle cx={0} cy={40} r={8} stroke={C.blue} strokeWidth={4} opacity={p} />
    <text x={0} y={-20} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.hand} fontWeight={700} fontSize={34} fill={C.blue} stroke="none" opacity={p}>
      64 GB
    </text>
  </g>
);

export const Marble: React.FC<{x: number; y: number; r?: number; p?: number}> = ({x, y, r = 30, p = 1}) => (
  <g opacity={p}>
    <circle cx={x} cy={y} r={r} fill="url(#hatch)" />
    <circle cx={x} cy={y} r={r} fill="none" stroke={C.blue} strokeWidth={4} />
    <path d={`M${x - r * 0.5},${y - r * 0.2} q${r * 0.4},${-r * 0.5} ${r * 0.9},${-r * 0.2}`} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.6} />
  </g>
);

export const Guitar: React.FC<{x0: number; x1: number; y: number; p?: number}> = ({x0, x1, y, p = 1}) => (
  <g opacity={p} strokeLinecap="round">
    <rect x={x0 - 26} y={y - 40} width={20} height={80} rx={4} fill={C.woodDark} stroke={C.ink} strokeWidth={3} />
    <rect x={x1 + 6} y={y - 40} width={20} height={80} rx={4} fill={C.woodDark} stroke={C.ink} strokeWidth={3} />
  </g>
);

/** Bola lampu LED kecil. */
export const LedBulb: React.FC<{x: number; y: number; s?: number; on?: number; color?: string}> = ({x, y, s = 1, on = 1, color = C.blue}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={0} cy={-40} r={70 + 20 * on} fill={color} opacity={0.08 * on} />
    <path d="M-40,0 C-60,-30 -50,-90 0,-95 C50,-90 60,-30 40,0 Z" fill={color} fillOpacity={0.15 + 0.25 * on} stroke={C.ink} strokeWidth={4} />
    <path d="M-30,0 H30 V30 H-30 Z M-30,12 H30 M-30,22 H30" fill="none" stroke={C.muted} strokeWidth={4} />
    <path d="M-12,-10 V-50 L0,-40 L12,-50 V-10" fill="none" stroke={C.yellow} strokeWidth={3} opacity={0.5 + 0.5 * on} />
  </g>
);

/** Gelombang kapur y = f(x) di antara x0..x1. */
export const WaveLine: React.FC<{x0: number; x1: number; f: (u: number) => number; color?: string; width?: number; p?: number; n?: number; opacity?: number; dash?: string}> = ({
  x0,
  x1,
  f,
  color = C.ink,
  width = 4,
  p = 1,
  n = 120,
  opacity = 1,
  dash: dsh,
}) => {
  if (p <= 0.001) return null;
  const pts = Array.from({length: n + 1}, (_, i) => {
    const u = i / n;
    return [x0 + (x1 - x0) * u, f(u)] as [number, number];
  });
  return (
    <path
      d={smoothPath(pts)}
      fill="none"
      stroke={color}
      strokeWidth={width * 0.72}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      pathLength={dsh ? undefined : 1}
      strokeDasharray={dsh ?? (p < 1 ? `${p} 1` : undefined)}
    />
  );
};
