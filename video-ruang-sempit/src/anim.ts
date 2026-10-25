import {Easing, interpolate} from 'remotion';

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.5, 0, 0.75, 0);
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 antara detik a dan b. */
export const ramp = (t: number, a: number, b: number, easing: (x: number) => number = EASE) =>
  interpolate(t, [a, b], [0, 1], {...clamp, easing});

/** Muncul pada a..a+inDur lalu hilang pada b..b+outDur. */
export const win = (t: number, a: number, b: number, inDur = 0.6, outDur = 0.6) =>
  Math.min(ramp(t, a, a + inDur), 1 - ramp(t, b, b + outDur, EASE_IN_OUT));

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const lerpPts = (a: [number, number], b: [number, number], p: number): [number, number] => [
  mix(a[0], b[0], p),
  mix(a[1], b[1], p),
];

/** Osilasi halus yang dimulai dari amplitudo nol. */
export const osc = (t: number, freq: number, amp = 1, phase = 0) => amp * Math.sin(2 * Math.PI * freq * t + phase);

/** Pseudo-random deterministik. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Path SVG dari daftar titik. */
export const pathOf = (pts: [number, number][]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Path halus (Catmull-Rom → Bezier). */
export const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Sampel fungsi y = f(x) menjadi titik. */
export const sample = (f: (x: number) => number, x0: number, x1: number, n = 200): [number, number][] =>
  Array.from({length: n + 1}, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    return [x, f(x)];
  });

/** Warna kira-kira untuk panjang gelombang cahaya tampak (nm). Di luar 400–700 nm: abu-abu redup. */
export const nmColor = (nm: number) => {
  const stops: [number, number[]][] = [
    [400, [138, 92, 255]],
    [450, [79, 123, 255]],
    [490, [63, 198, 230]],
    [530, [85, 211, 106]],
    [580, [242, 222, 74]],
    [620, [243, 154, 60]],
    [700, [232, 70, 60]],
  ];
  if (nm < 400 || nm > 700) return 'rgba(110,115,160,0.35)';
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i];
    const [b, cb] = stops[i + 1];
    if (nm <= b) {
      const f = (nm - a) / (b - a);
      const c = ca.map((v, k) => Math.round(v + (cb[k] - v) * f));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return 'rgb(232,70,60)';
};
