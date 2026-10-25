import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Arrow, Atom, Bond, Chalk, Halo, Label, Note, Spark, Stage} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const SX0 = 360;
const SX1 = 1600;
const SY = 760;
const xl = (nm: number) => SX0 + ((nm - 380) / (820 - 380)) * (SX1 - SX0);
const nmColor = (nm: number) => interpolateColors(nm, [400, 450, 490, 530, 580, 620, 700], ['#8a5cff', '#4f7bff', '#3fc6e6', '#55d36a', '#f2de4a', '#f39a3c', '#e8463c']);

// Deret tiasianin (≈ nilai serapan maksimum di metanol, dibulatkan)
const SERIES = [
  {k: 0, nm: 423, look: '#f2de4a', name: 'kuning'},
  {k: 1, nm: 557, look: '#d9479a', name: 'magenta'},
  {k: 2, nm: 651, look: '#3f6fe0', name: 'biru'},
  {k: 3, nm: 760, look: '#9fb3a8', name: 'IR dekat'},
];

/** Rantai polimetin di antara dua N. */
const Chain: React.FC<{x: number; y: number; m: number; plus: number; equal?: number; s?: number}> = ({x, y, m, plus, equal = 0, s = 1}) => {
  const n = 3 + 2 * m; // atom C rantai
  const dx = 56 * s;
  const pts: [number, number][] = Array.from({length: n + 2}, (_, i) => [x + i * dx, y + (i % 2 ? -26 : 20) * s]);
  return (
    <g>
      {pts.slice(0, -1).map((a, i) => {
        const b = pts[i + 1];
        const dbl = (i % 2 === 0) !== plus > 0.5;
        return (
          <g key={i}>
            <Bond x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} order={1} width={4 * s} color={C.ink} />
            {/* ikatan kedua: penuh (lokal) atau putus-putus (merata) */}
            <Bond x1={a[0] + 0} y1={a[1] + 9 * s} x2={b[0]} y2={b[1] + 9 * s} order={1} width={3 * s} color={dbl ? C.ink : C.muted} opacity={equal > 0.5 ? 0.6 : dbl ? 1 : 0} />
          </g>
        );
      })}
      {pts.slice(1, -1).map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={5 * s} fill={C.ink} />
      ))}
      <Atom x={pts[0][0]} y={pts[0][1]} el="N" r={24 * s} />
      <Atom x={pts[n + 1][0]} y={pts[n + 1][1]} el="N" r={24 * s} />
      <Label x={pts[0][0] - 30 * s} y={pts[0][1] - 38 * s} size={40 * s} color={C.yellow} opacity={equal > 0.5 ? 0 : plus > 0.5 ? 0 : 1}>
        +
      </Label>
      <Label x={pts[n + 1][0] + 30 * s} y={pts[n + 1][1] - 38 * s} size={40 * s} color={C.yellow} opacity={equal > 0.5 ? 0 : plus > 0.5 ? 1 : 0}>
        +
      </Label>
    </g>
  );
};

export const Cyanine: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(5) - 0.4, 0.5, 0.6);
  const mol = ramp(t, 0.3, 1.4);
  const res = ramp(t, cue(1), cue(1) + 0.6);
  const flip = res > 0 && t < cue(2) ? (Math.floor((t - cue(1)) / 1.1) % 2) : 0;
  const equal = ramp(t, cue(2) - 0.1, cue(2) + 0.6);
  const floors = ramp(t, wordOf(2, 'lantai') - 0.6, wordOf(2, 'lantai') + 0.6);
  const kuhn = ramp(t, cue(3) - 0.1, cue(3) + 0.8, BACK);
  const grow = ramp(t, cue(4), cue(4) + 0.8);
  const pB = win(t, cue(5) - 0.2, cue(8) - 0.4, 0.7, 0.6);
  const row = (k: number) => ramp(t, cue(5) + 0.4 + k * 0.9, cue(5) + 1.1 + k * 0.9, BACK);
  const mark = (k: number) => ramp(t, cue(6) + k * 1.1 - 0.2, cue(6) + k * 1.1 + 0.5, BACK);
  const vial = (k: number) => ramp(t, cue(7) + k * 0.8 - 0.1, cue(7) + k * 0.8 + 0.5);
  const pC = ramp(t, cue(8) - 0.2, cue(8) + 0.8);

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: struktur, resonansi, lantai rata */}
        <g opacity={pA}>
          <Halo x={850} y={420} r={430} color="green" opacity={0.75 * equal} squash={0.22} />
          <g opacity={mol}>
            <Chain x={560} y={420} m={1} plus={flip} equal={equal} s={1.7} />
          </g>
          <g opacity={res * (1 - equal)}>
            <Label x={960} y={270} size={50} color={C.yellow}>
              muatan + berpindah lewat resonansi
            </Label>
          </g>
          <g opacity={equal}>
            <Label x={960} y={270} size={50} color={C.green}>
              semua ikatan hampir sama panjang
            </Label>
          </g>
          {/* lantai potensial: bergelombang vs rata */}
          <g opacity={floors}>
            <Chalk d="M200,580 V740 H600 V580" color={C.muted} width={5} />
            <WaveLine x0={200} x1={600} f={(u) => 720 - 22 * (0.5 + 0.5 * Math.cos(u * Math.PI * 10))} color={C.red} width={4} />
            <Label x={400} y={790} size={42} color={C.red}>
              poliena: lantai bergelombang
            </Label>
            <Chalk d="M700,580 V740 H1100 V580" color={C.ink} width={5} />
            <Chalk d="M700,725 H1100" color={C.green} width={4} />
            <Label x={900} y={790} size={42} color={C.green}>
              sianin: lantai rata
            </Label>
            {(() => {
              const u1 = 0.5 + 0.47 * Math.sin(t * 1.3);
              const u2 = 0.5 + 0.47 * Math.sin(t * 1.3 + 1);
              const yb = 720 - 22 * (0.5 + 0.5 * Math.cos(u1 * Math.PI * 10));
              return (
                <g>
                  <Spark x={200 + 400 * u1} y={yb - 14} r={8} color={C.red} />
                  <Spark x={700 + 400 * u2} y={711} r={8} color={C.green} />
                </g>
              );
            })()}
          </g>
        </g>

        {/* B: deret tiasianin & spektrum */}
        <g opacity={pB}>
          {SERIES.map((s, i) => {
            const p = row(i);
            return (
              <g key={i} opacity={p}>
                <Chain x={220} y={250 + i * 100} m={s.k} plus={0} equal={1} s={0.62} />
                <Label x={220 + (3 + 2 * s.k + 1) * 56 * 0.62 + 50} y={250 + i * 100} size={40} color={C.muted} anchor="start">
                  {`+${s.k} CH=CH`}
                </Label>
              </g>
            );
          })}
          {/* spektrum */}
          {Array.from({length: 64}, (_, i) => {
            const nm = 400 + i * 5;
            return <rect key={i} x={xl(nm)} y={SY} width={xl(405) - xl(400) + 1} height={46} fill={nmColor(nm + 2)} opacity={0.7} />;
          })}
          <rect x={xl(720)} y={SY} width={xl(820) - xl(720)} height={46} fill="#4a2a2a" opacity={0.5} />
          {[400, 500, 600, 700, 800].map((nm) => (
            <Label key={nm} x={xl(nm)} y={SY + 76} size={34} color={C.muted}>
              {`${nm}`}
            </Label>
          ))}
          {SERIES.map((s, i) => {
            const p = mark(i);
            return (
              <g key={i} opacity={p}>
                <Arrow x1={xl(s.nm)} y1={SY - 80} x2={xl(s.nm)} y2={SY - 6} color="ink" width={4} />
                <Label x={xl(s.nm)} y={SY - 110} size={46} color={C.ink}>
                  {`≈ ${s.nm}`}
                </Label>
              </g>
            );
          })}
          {/* tabung larutan */}
          {SERIES.map((s, i) => {
            const p = vial(i);
            const x = 1320 + i * 140;
            return (
              <g key={i} opacity={p}>
                <path d={`M${x - 30},300 V500 a30,30 0 0 0 60,0 V300`} fill={s.look} fillOpacity={0.55} stroke={C.ink} strokeWidth={4} />
                <Label x={x} y={580} size={38} color={s.look === '#9fb3a8' ? C.muted : s.look}>
                  {s.name}
                </Label>
              </g>
            );
          })}
        </g>

        {/* C: penanda fluoresens pada DNA */}
        <g opacity={pC}>
          {Array.from({length: 2}, (_, strand) => (
            <WaveLine key={strand} x0={300} x1={1620} n={240} f={(u) => 520 + 110 * Math.sin(u * Math.PI * 6 + strand * Math.PI + t * 0.6)} color={strand ? C.blue : C.lilac} width={5} />
          ))}
          {Array.from({length: 22}, (_, i) => {
            const u = (i + 0.5) / 22;
            const x = 300 + u * 1320;
            const ya = 520 + 110 * Math.sin(u * Math.PI * 6 + t * 0.6);
            const yb = 520 + 110 * Math.sin(u * Math.PI * 6 + Math.PI + t * 0.6);
            return <line key={i} x1={x} y1={ya} x2={x} y2={yb} stroke={C.muted} strokeWidth={3} opacity={0.6} />;
          })}
          {[
            {u: 0.2, c: '#7be37b', l: 'Cy3'},
            {u: 0.52, c: '#ff5b5b', l: 'Cy5'},
            {u: 0.8, c: '#7be37b', l: 'Cy3'},
          ].map((d, i) => {
            const x = 300 + d.u * 1320;
            const y = 520 + 110 * Math.sin(d.u * Math.PI * 6 + t * 0.6);
            const pulse = 0.7 + 0.3 * Math.sin(t * 4 + i);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={40 * pulse} fill={d.c} opacity={0.25} />
                <circle cx={x} cy={y} r={14} fill={d.c} />
                <Label x={x} y={y - 70} size={46} color={d.c}>
                  {d.l}
                </Label>
              </g>
            );
          })}
          <Label x={960} y={780} size={48} color={C.ink}>
            penanda fluoresens untuk melabel DNA
          </Label>
        </g>
      </Stage>
      <Note x={1860} y={640} anchor="right" text="model elektron bebas: Hans Kuhn" color={C.blue} size={48} p={kuhn} opacity={pA} />
      <Note x={1860} y={740} anchor="right" text="rantai panjang → celah mengecil" color={C.yellow} size={46} p={grow} opacity={pA} />
      <Note x={1100} y={190} text="tiap +CH=CH → serapan bergeser ≈ 100 nm" color={C.pink} size={50} p={ramp(t, wordOf(5, 'seratus') - 0.3, wordOf(5, 'seratus') + 0.6)} opacity={pB} />
    </AbsoluteFill>
  );
};
