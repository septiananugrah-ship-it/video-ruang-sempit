import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ATOM, C, FONT, H, type Hue, W, hue} from '../theme';

const HUES: Hue[] = ['ink', 'muted', 'yellow', 'pink', 'blue', 'green', 'orange', 'lilac', 'red'];

/** Gradien & penanda bersama, dipasang sekali di setiap <Stage>. */
export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="dust">
      <stop offset="0%" stopColor="#9be8ff" stopOpacity="0.16" />
      <stop offset="55%" stopColor="#b49cff" stopOpacity="0.06" />
      <stop offset="100%" stopColor="#b49cff" stopOpacity="0" />
    </radialGradient>
    {Object.entries(ATOM).map(([el, a]) => (
      <radialGradient key={el} id={`orb-${el}`} cx="38%" cy="34%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="30%" stopColor={a.stroke} stopOpacity="0.75" />
        <stop offset="100%" stopColor={a.stroke} stopOpacity="0.08" />
      </radialGradient>
    ))}
    {HUES.map((k) => (
      <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0,0.5 L10,5 L0,9.5 L2.6,5 Z" fill={hue(k)} />
      </marker>
    ))}
    {HUES.map((k) => (
      <radialGradient key={`g${k}`} id={`glow-${k}`}>
        <stop offset="0%" stopColor={hue(k)} stopOpacity="0.42" />
        <stop offset="45%" stopColor={hue(k)} stopOpacity="0.12" />
        <stop offset="100%" stopColor={hue(k)} stopOpacity="0" />
      </radialGradient>
    ))}
    {/* "hatch" = kabut partikel halus (titik-titik) */}
    <pattern id="hatch" width={12} height={12} patternUnits="userSpaceOnUse">
      <circle cx={3} cy={3} r={1.3} fill="#cfe9ff" opacity={0.45} />
      <circle cx={9} cy={9} r={1.1} fill="#f2c6ff" opacity={0.35} />
    </pattern>
  </defs>
);

/** Kanvas SVG penuh 1920×1080 untuk sebuah adegan; garis diberi pendar lembut. HTML diletakkan DI LUAR Stage. */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties; rough?: boolean}> = ({children, style, rough = true}) => (
  <AbsoluteFill style={style}>
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{position: 'absolute', inset: 0, overflow: 'visible', filter: rough ? 'drop-shadow(0 0 4px rgba(140,200,255,0.35)) drop-shadow(0 0 16px rgba(180,120,255,0.14))' : undefined}}
    >
      <Defs />
      <g>{children}</g>
    </svg>
  </AbsoluteFill>
);

/** Awan nebula lembut. */
export const Dust: React.FC<{x: number; y: number; r: number; opacity?: number}> = ({x, y, r, opacity = 1}) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill="url(#dust)" opacity={opacity} />
);

/** Pendar lembut berwarna di belakang objek. */
export const Halo: React.FC<{x: number; y: number; r: number; color?: Hue; opacity?: number; squash?: number}> = ({x, y, r, color = 'blue', opacity = 1, squash = 0.85}) =>
  opacity <= 0.001 ? null : <ellipse cx={x} cy={y} rx={r} ry={r * squash} fill={`url(#glow-${color})`} opacity={opacity} />;

/** Partikel bercahaya (elektron, foton, hole): inti putih, halo berwarna, jejak opsional. */
export const Spark: React.FC<{x: number; y: number; r?: number; color?: string; opacity?: number; trail?: [number, number][]; halo?: number}> = ({
  x,
  y,
  r = 10,
  color = C.blue,
  opacity = 1,
  trail,
  halo = 1,
}) =>
  opacity <= 0.001 ? null : (
    <g opacity={opacity}>
      {trail && trail.length > 1
        ? trail.slice(1).map((q, i) => {
            const a = trail[i];
            const k = 1 - i / (trail.length - 1);
            return <line key={i} x1={a[0]} y1={a[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth={r * 1.1 * k} strokeLinecap="round" opacity={0.42 * k} />;
          })
        : null}
      <circle cx={x} cy={y} r={r * 3.4} fill={color} opacity={0.07 * halo} />
      <circle cx={x} cy={y} r={r * 2} fill={color} opacity={0.18 * halo} />
      <circle cx={x} cy={y} r={r} fill={color} />
      <circle cx={x - r * 0.18} cy={y - r * 0.18} r={r * 0.5} fill="#ffffff" opacity={0.85} />
    </g>
  );

/** Riak cahaya melingkar (mis. saat foton diserap/dipancarkan). q: 0..1. */
export const Ripple: React.FC<{x: number; y: number; q: number; r?: number; color?: string; rings?: number}> = ({x, y, q, r = 120, color = C.yellow, rings = 3}) =>
  q <= 0.001 || q >= 0.999 ? null : (
    <g>
      {Array.from({length: rings}, (_, i) => {
        const u = Math.max(0, Math.min(1, q * 1.4 - i * 0.18));
        if (u <= 0 || u >= 1) return null;
        return <circle key={i} cx={x} cy={y} r={r * u} fill="none" stroke={color} strokeWidth={3 * (1 - u) + 0.5} opacity={(1 - u) * 0.9} />;
      })}
    </g>
  );

/** Garis/path kapur yang tergambar progresif (p: 0..1). */
export const Chalk: React.FC<{d: string; p?: number; color?: string; width?: number; opacity?: number; dash?: string; fill?: string}> = ({
  d,
  p = 1,
  color = C.ink,
  width = 4,
  opacity = 1,
  dash,
  fill = 'none',
}) =>
  p <= 0.001 ? null : (
    <path
      d={d}
      pathLength={dash ? undefined : 1}
      fill={fill}
      stroke={color}
      strokeWidth={width * 0.62}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={opacity}
      fillOpacity={opacity}
      strokeDasharray={dash ?? (p < 1 ? `${p} 1` : undefined)}
    />
  );

/** Teks SVG (default tulisan tangan kapur). `p` < 1 = tertulis dari kiri ke kanan. */
export const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
  opacity?: number;
  font?: 'hand' | 'sans' | 'serif' | 'display' | 'mono';
  italic?: boolean;
  p?: number;
}> = ({x, y, children, size: size0 = 46, color = C.ink, anchor = 'middle', weight: w0, opacity = 1, font = 'hand', italic, p = 1}) => {
  if (p <= 0.001 || opacity <= 0.001) return null;
  // ukuran adegan disusun untuk label "hand"; Space Grotesk lebih lebar → diperkecil
  const size = font === 'hand' ? size0 * 0.84 : size0;
  const weight = w0 ? Math.min(w0, 600) : font === 'serif' ? 400 : 500;
  const txt = typeof children === 'string' ? children : '';
  const wEst = Math.max(40, txt.length * size * 0.58) + size;
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - wEst : x - wEst / 2;
  const id = `w${Math.round(x)}_${Math.round(y)}_${txt.length}`;
  return (
    <g opacity={opacity}>
      {p < 1 ? (
        <clipPath id={id}>
          <rect x={x0 - size * 0.3} y={y - size} width={(wEst + size * 0.6) * p} height={size * 2} />
        </clipPath>
      ) : null}
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="central"
        fontFamily={FONT[font]}
        fontSize={size}
        fontWeight={weight}
        fontStyle={italic ? 'italic' : undefined}
        letterSpacing={font === 'hand' ? 0.3 : undefined}
        fill={color}
        clipPath={p < 1 ? `url(#${id})` : undefined}
      >
        {children}
      </text>
    </g>
  );
};

export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color?: Hue; width?: number; opacity?: number; dash?: string; both?: boolean; p?: number}> = ({
  x1,
  y1,
  x2,
  y2,
  color = 'ink',
  width = 4,
  opacity = 1,
  dash,
  both,
  p = 1,
}) =>
  p <= 0.001 ? null : (
    <line
      x1={x1}
      y1={y1}
      x2={x1 + (x2 - x1) * p}
      y2={y1 + (y2 - y1) * p}
      stroke={hue(color)}
      strokeWidth={width * 0.7}
      strokeLinecap="round"
      opacity={opacity}
      strokeDasharray={dash}
      markerEnd={`url(#arrow-${color})`}
      markerStart={both ? `url(#arrow-${color})` : undefined}
    />
  );

/** Atom ala kapur: lingkaran garis + arsir tipis + simbol tulisan tangan. */
export const Atom: React.FC<{x: number; y: number; el: string; r?: number; opacity?: number; label?: string | null}> = ({x, y, el, r, opacity = 1, label}) => {
  const a = ATOM[el] ?? ATOM.C;
  const R = r ?? a.r;
  const text = label === undefined ? el : label;
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={R * 1.5} fill={a.stroke} opacity={0.08} />
      <circle cx={x} cy={y} r={R} fill={C.bg} />
      <circle cx={x} cy={y} r={R} fill={`url(#orb-${el in ATOM ? el : 'C'})`} />
      <circle cx={x} cy={y} r={R} fill="none" stroke={a.stroke} strokeWidth={Math.max(1.5, R * 0.06)} opacity={0.9} />
      {text ? (
        <text x={x} y={y + R * 0.04} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={R * 0.8} fill={C.bg}>
          {text}
        </text>
      ) : null}
    </g>
  );
};

/** Ikatan kapur (tunggal/rangkap). */
export const Bond: React.FC<{x1: number; y1: number; x2: number; y2: number; order?: number; width?: number; opacity?: number; color?: string}> = ({
  x1,
  y1,
  x2,
  y2,
  order = 1,
  width = 4,
  opacity = 1,
  color = C.ink,
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const offs = order === 1 ? [0] : order === 2 ? [-5, 5] : [-8, 0, 8];
  return (
    <g opacity={opacity}>
      {offs.map((o, i) => (
        <line key={i} x1={x1 + nx * o} y1={y1 + ny * o} x2={x2 + nx * o} y2={y2 + ny * o} stroke={color} strokeWidth={width} strokeLinecap="round" />
      ))}
    </g>
  );
};

// ---------------- HTML: rumus & catatan ----------------

/** Variabel miring (rumus). */
export const V: React.FC<{children: React.ReactNode; color?: string}> = ({children, color}) => (
  <span style={{fontStyle: 'italic', color, fontFamily: FONT.serif}}>{children}</span>
);
export const Hbar: React.FC<{color?: string}> = ({color}) => <V color={color}>ħ</V>;

/** Pecahan bertumpuk. */
export const Frac: React.FC<{n: React.ReactNode; d: React.ReactNode; size?: number}> = ({n, d, size = 0.84}) => (
  <span style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', fontSize: `${size}em`, margin: '0 0.14em', lineHeight: 1.1}}>
    <span style={{padding: '0 0.18em'}}>{n}</span>
    <span style={{alignSelf: 'stretch', height: '0.06em', minHeight: 2.5, background: 'currentColor', margin: '0.06em 0', borderRadius: 2}} />
    <span style={{padding: '0 0.18em'}}>{d}</span>
  </span>
);
export const Sub: React.FC<{children: React.ReactNode; color?: string}> = ({children, color}) => (
  <sub style={{fontSize: '0.6em', verticalAlign: '-0.3em', lineHeight: 0, color}}>{children}</sub>
);
export const Sup: React.FC<{children: React.ReactNode; color?: string}> = ({children, color}) => (
  <sup style={{fontSize: '0.6em', verticalAlign: '0.75em', lineHeight: 0, color}}>{children}</sup>
);

/** Akar kuadrat: tanda akar SVG setinggi isi, garis atas menempel. */
export const Sqrt: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{display: 'inline-block', position: 'relative', paddingLeft: '0.6em', whiteSpace: 'nowrap', lineHeight: 1.05}}>
    <svg viewBox="0 0 60 100" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: 0, width: '0.62em', height: '100%', overflow: 'visible'}}>
      <path d="M4,60 L16,53 L33,97 L60,1.5" fill="none" stroke="currentColor" strokeWidth="0.055em" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <span style={{display: 'inline-block', borderTop: '0.055em solid currentColor', padding: '0.1em 0.06em 0 0.08em', lineHeight: 1.05}}>{children}</span>
  </span>
);

/** Bagian rumus yang muncul bertahap. */
export const Part: React.FC<{p: number; children: React.ReactNode; color?: string}> = ({p, children, color}) => (
  <span style={{opacity: Math.max(0, Math.min(1, p)), color}}>{children}</span>
);

/**
 * Rumus utama "ditulis" di papan: kapur putih ≥ 56 px, muncul dari kiri ke kanan
 * seperti ditulis tangan, dengan bingkai kapur gambar-tangan berwarna aksen.
 */
export const Formula: React.FC<{
  x: number;
  y: number;
  p: number;
  children: React.ReactNode;
  accent?: string;
  size?: number;
  anchor?: 'center' | 'left' | 'right';
  caption?: React.ReactNode;
  box?: boolean;
  out?: number;
}> = ({x, y, p, children, accent = C.yellow, size = 62, anchor = 'center', caption, box = true, out = 0}) => {
  if (p <= 0.001 || out >= 0.999) return null;
  const write = Math.min(1, p * 1.2);
  const pin = Math.min(1, p * 1.6);
  const sweep = Math.max(0, Math.min(1, (p - 0.45) / 0.55));
  const tx = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, -50%) scale(${0.94 + 0.06 * pin})`,
        opacity: pin * (1 - out),
        filter: out > 0 ? `blur(${out * 6}px)` : undefined,
      }}
    >
      <div
        style={{
          position: 'relative',
          padding: '18px 42px 16px',
          borderRadius: 20,
          border: box ? '1.2px solid transparent' : undefined,
          background: box ? `linear-gradient(160deg, rgba(22,24,64,0.82), rgba(10,11,34,0.82)) padding-box, linear-gradient(135deg, ${accent}cc, ${C.pink}55 70%, ${C.blue}33) border-box` : undefined,
          boxShadow: box ? `0 18px 50px rgba(0,0,12,0.45), 0 0 28px ${accent}1f` : undefined,
        }}
      >
        {box && sweep > 0 && sweep < 1 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 20,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-40%',
                bottom: '-40%',
                width: '38%',
                left: `${-45 + sweep * 150}%`,
                transform: 'rotate(18deg)',
                background: `linear-gradient(90deg, transparent, ${accent}24 40%, rgba(255,255,255,0.16) 50%, ${accent}24 60%, transparent)`,
              }}
            />
          </div>
        ) : null}
        <div style={{clipPath: `inset(-20% ${(1 - write) * 100}% -20% -5%)`, position: 'relative'}}>
          <div style={{fontSize: size, lineHeight: 1.3, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: FONT.serif, color: C.ink, textShadow: `0 0 10px ${accent}33`}}>{children}</div>
          {caption ? (
            <div style={{fontSize: 19, color: accent, textAlign: 'center', marginTop: 8, fontFamily: FONT.sans, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: 2.4, textTransform: 'uppercase', opacity: 0.9}}>{caption}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** Catatan berbentuk kapsul bercahaya (pengganti lencana). */
export const Note: React.FC<{x: number; y: number; text: string; color?: string; opacity?: number; size?: number; anchor?: 'center' | 'left' | 'right'; p?: number; underline?: boolean}> = ({
  x,
  y,
  text,
  color = C.yellow,
  opacity = 1,
  size = 40,
  anchor = 'center',
  p,
}) => {
  const pp = p ?? opacity;
  if (pp <= 0.001 || opacity <= 0.001) return null;
  const tx = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%';
  const fs = size * 0.66;
  const pin = Math.min(1, pp * 1.6);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${tx}, -50%) scale(${0.92 + 0.08 * pin})`, opacity: Math.min(1, opacity * 1.5) * pin, whiteSpace: 'nowrap'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: fs * 0.5,
          padding: `${fs * 0.32}px ${fs * 0.8}px`,
          borderRadius: 999,
          background: 'linear-gradient(160deg, rgba(22,24,64,0.8), rgba(10,11,34,0.8))',
          border: `1px solid ${color}88`,
          boxShadow: `0 10px 30px rgba(0,0,12,0.4), 0 0 18px ${color}22`,
          fontFamily: FONT.sans,
          fontWeight: 500,
          letterSpacing: 0.2,
          fontSize: fs,
          color,
        }}
      >
        <span style={{width: fs * 0.3, height: fs * 0.3, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flex: 'none'}} />
        <span style={{clipPath: `inset(-30% ${(1 - Math.min(1, pp * 1.2)) * 100}% -30% -5%)`}}>{text}</span>
      </div>
    </div>
  );
};

/** Kotak teks HTML bebas di papan (judul kecil, daftar). */
export const Board: React.FC<{x: number; y: number; children: React.ReactNode; width?: number; opacity?: number; anchor?: 'center' | 'left' | 'right'; style?: React.CSSProperties}> = ({
  x,
  y,
  children,
  width,
  opacity = 1,
  anchor = 'center',
  style,
}) =>
  opacity <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        transform: `translate(${anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%'}, -50%)`,
        opacity,
        color: C.ink,
        fontFamily: FONT.hand,
        ...style,
      }}
    >
      {children}
    </div>
  );
