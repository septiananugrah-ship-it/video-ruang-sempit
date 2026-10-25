import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Chalk, Formula, Halo, Label, Note, Spark, Stage, Sub, Sup, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {smoothPath} from '../anim';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const X0 = 200;
const X1 = 1000;
const FLOOR = 800;
const HMAX = 360;

/** Luas |ψn|² pada [a, b] (dalam satuan L). */
const prob = (n: number, a: number, b: number) => b - a - (Math.sin(2 * n * Math.PI * b) - Math.sin(2 * n * Math.PI * a)) / (2 * n * Math.PI);

export const Where: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const box = ramp(t, 0.2, 1.2);
  const psi = win(t, 0.4, cue(0) + 3.0, 0.6, 0.8);
  const fP = win(t, cue(0) + 0.6, cue(4) - 0.4, 0.7, 0.5);
  // n yang ditampilkan mengikuti narasi
  let n = 1;
  if (t >= cue(2) - 0.2) n = 2;
  if (t >= cue(3)) n = 1 + (Math.floor((t - cue(3)) / 1.3) % 4);
  if (t >= cue(4) - 0.2) n = 1;
  if (t >= cue(6) - 0.2) n = 2;
  const big = ramp(t, cue(8) - 0.2, cue(8) + 1.5);
  if (t >= cue(8) - 0.2) n = 12;
  const dens = ramp(t, 0.6, 1.8);
  const band = ramp(t, cue(4), cue(4) + 0.8);
  const fill = (k: number) => ramp(t, cue(k) - 0.1, cue(k) + 0.8);
  const classical = ramp(t, cue(7) - 0.1, cue(7) + 0.8);
  const bars = ramp(t, cue(5) - 0.2, cue(5) + 0.6);
  const node = win(t, wordOf(2, 'simpul') - 0.3, cue(3) - 0.2, 0.5, 0.4);
  const corr = ramp(t, cue(9) - 0.1, cue(9) + 0.8, BACK);

  const xs = (u: number) => X0 + u * (X1 - X0);
  const rho = (m: number) => (u: number) => FLOOR - HMAX * 0.5 * Math.sin(m * Math.PI * u) ** 2;
  // area terarsir di sepertiga tengah
  const areaPath = (m: number) => {
    const pts: [number, number][] = Array.from({length: 61}, (_, i) => {
      const u = 1 / 3 + (i / 60) / 3;
      return [xs(u), rho(m)(u)];
    });
    return `${smoothPath(pts)} L${xs(2 / 3)},${FLOOR} L${xs(1 / 3)},${FLOOR} Z`;
  };
  const showFill = t >= cue(5) - 0.1 && t < cue(7) + 0.2 ? (n === 1 ? fill(5) : fill(6)) : 0;
  const col = n === 1 ? C.blue : n === 2 ? C.green : n === 12 ? C.pink : [C.blue, C.green, C.pink, C.orange][(n - 1) % 4];

  return (
    <AbsoluteFill>
      <Stage>
        <Chalk d={`M${X0},${FLOOR - HMAX + 40} V${FLOOR} H${X1} V${FLOOR - HMAX + 40}`} p={box} color={C.ink} width={7} />
        <Label x={X0} y={FLOOR + 44} size={42} font="serif" italic color={C.muted} p={box}>
          0
        </Label>
        <Label x={X1} y={FLOOR + 44} size={42} font="serif" italic color={C.muted} p={box}>
          L
        </Label>
        {/* ψ (garis putus) lalu |ψ|² */}
        <g opacity={psi}>
          <WaveLine x0={X0} x1={X1} f={(u) => FLOOR - 160 - 130 * Math.sin(Math.PI * u)} color={C.muted} width={3} dash="8 8" />
          <Label x={X0 + 120} y={FLOOR - 330} size={44} color={C.muted} font="serif" italic>
            ψ
          </Label>
        </g>
        {/* sepertiga tengah */}
        <g opacity={band * (1 - big)}>
          <rect x={xs(1 / 3)} y={FLOOR - HMAX + 40} width={(X1 - X0) / 3} height={HMAX - 40} fill={C.yellow} opacity={0.07} />
          <Chalk d={`M${xs(1 / 3)},${FLOOR - HMAX + 40} V${FLOOR} M${xs(2 / 3)},${FLOOR - HMAX + 40} V${FLOOR}`} color={C.yellow} width={3} dash="8 8" />
          <Label x={xs(0.5)} y={FLOOR - HMAX + 10} size={42} color={C.yellow}>
            sepertiga tengah
          </Label>
        </g>
        <Halo x={xs(0.5)} y={FLOOR - 120} r={420} color="blue" opacity={0.55 * dens} squash={0.5} />
        {showFill > 0 ? <path d={areaPath(n)} fill={col} opacity={0.3 * showFill} /> : null}
        {/* rapat peluang sebagai "awan" titik-titik: makin rapat di tempat |ψ|² besar */}
        <g opacity={0.75 * dens}>
          {Array.from({length: 90}, (_, i) => {
            const u = ((i * 0.6180339) % 1) * 0.98 + 0.01;
            const w = Math.sin(n * Math.PI * u) ** 2;
            const v = (i * 0.38196 + t * 0.05) % 1;
            return v < w ? <circle key={i} cx={xs(u)} cy={FLOOR - 12 - ((i * 0.7548776) % 1) * 34} r={2.2 + 1.6 * w} fill={col} opacity={0.35 + 0.5 * w} /> : null;
          })}
        </g>
        <WaveLine x0={X0} x1={X1} n={n > 4 ? 400 : 160} f={rho(n)} color={col} width={5} p={dens} />
        <Label x={X1 - 34} y={FLOOR - HMAX + 76} size={48} font="serif" italic color={col} p={dens} anchor="end">
          {`n = ${n}`}
        </Label>
        {/* simpul */}
        <g opacity={node}>
          <circle cx={xs(0.5)} cy={FLOOR} r={18} fill="none" stroke={C.red} strokeWidth={5} />
          <Label x={xs(0.5)} y={FLOOR - 70} size={46} color={C.red}>
            simpul
          </Label>
        </g>
        {/* klasik merata */}
        <g opacity={classical}>
          <Chalk d={`M${X0},${FLOOR - HMAX * 0.25} H${X1}`} color={C.ink} width={4} dash="14 10" />
          <Label x={X0 + 10} y={FLOOR - HMAX - 10} size={40} color={C.ink} anchor="start">
            klasik: merata
          </Label>
          <Spark x={xs(0.5 + 0.45 * Math.sin(t * 2.2))} y={FLOOR - 22} r={10} color={C.ink} opacity={1 - big} />
        </g>
        {/* diagram batang peluang di sepertiga tengah */}
        <g opacity={bars * (1 - big)}>
          {[
            {k: 5, m: 1, v: prob(1, 1 / 3, 2 / 3), c: C.blue, lab: 'n = 1'},
            {k: 6, m: 2, v: prob(2, 1 / 3, 2 / 3), c: C.green, lab: 'n = 2'},
            {k: 7, m: 0, v: 1 / 3, c: C.ink, lab: 'klasik'},
          ].map((b, i) => {
            const p = fill(b.k);
            const x = 1220 + i * 190;
            const h = 420 * b.v * p;
            return (
              <g key={i} opacity={Math.min(1, p * 2)}>
                <rect x={x - 50} y={FLOOR - h} width={100} height={h} fill={b.c} opacity={0.25} />
                <Chalk d={`M${x - 50},${FLOOR} V${FLOOR - h} H${x + 50} V${FLOOR}`} color={b.c} width={4} />
                <Label x={x} y={FLOOR - h - 40} size={50} color={b.c}>
                  {`≈ ${Math.round(b.v * 100)}%`}
                </Label>
                <Label x={x} y={FLOOR + 44} size={42} color={b.c}>
                  {b.lab}
                </Label>
              </g>
            );
          })}
          <Chalk d={`M1140,${FLOOR} H1780`} color={C.muted} width={3} />
        </g>
        {/* rata-rata pada n besar */}
        <g opacity={big}>
          <Label x={1390} y={560} size={52} color={C.pink}>
            n besar: puncak makin rapat
          </Label>
          <Label x={1390} y={630} size={48} color={C.ink}>
            rata-ratanya → merata
          </Label>
        </g>
      </Stage>

      <Formula x={1400} y={300} p={fP} accent={C.blue} caption="rapat peluang = kuadrat fungsi gelombang">
        <V>P</V>(<V>x</V>) = |<V>ψ</V>
        <Sub>
          <V>n</V>
        </Sub>
        (<V>x</V>)|
        <Sup>2</Sup>
      </Formula>
      <Note x={1400} y={500} text="tingkat n punya n − 1 simpul" color={C.red} size={50} p={ramp(t, cue(3), cue(3) + 0.8)} opacity={1 - ramp(t, cue(4) - 0.4, cue(4))} />
      <Note x={1400} y={300} text="prinsip korespondensi" color={C.yellow} size={60} p={corr} />
    </AbsoluteFill>
  );
};
