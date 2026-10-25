import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, win} from '../anim';
import {Arrow, Atom, Bond, Chalk, Formula, Frac, Hbar, Label, Note, Spark, Sqrt, Stage, Sub, Sup, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const BASE = 780;
const TOPV = 400;
const EY = 600; // tingkat energi partikel
const X0 = 180;
const X1 = 1740;
const PXNM = 600; // px per nm

export const Tunnel: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(6) - 0.4, 0.5, 0.6);
  const bar = ramp(t, 0.2, 1.2);
  const inc = ramp(t, 0.6, 2.0);
  const behind = ramp(t, cue(1) - 0.1, cue(1) + 1.0);
  const fT = win(t, cue(3) - 0.1, cue(6) - 0.4, 0.7, 0.5);
  const n1 = ramp(t, cue(4) + 1.0, cue(4) + 1.8, BACK);
  const widen = ramp(t, cue(5) - 0.1, cue(5) + 1.6, EASE_IN_OUT);
  const pB = win(t, cue(6) - 0.2, cue(8) - 0.4, 0.7, 0.6);
  const pC = ramp(t, cue(8) - 0.2, cue(8) + 0.8);
  const flipT = t - cue(8);
  const rate = t < cue(10) ? 1 : mix(1, 0.25, ramp(t, cue(10) + 0.6, cue(10) + 1.6));
  const deut = ramp(t, wordOf(10, 'deuterium') - 0.2, wordOf(10, 'deuterium') + 0.6);

  // tebal penghalang 0,2 → 0,5 nm; transmisi dari contoh Modul 3 (E = 1 eV, V₀ = 5 eV)
  const d = mix(0.2, 0.5, widen);
  const kap = 10.2463; // nm⁻¹
  const T = 0.04209 * Math.exp(-2 * kap * (d - 0.2));
  const w = d * PXNM;
  const bx0 = 960 - w / 2;
  const bx1 = 960 + w / 2;
  const amp = 85;
  const at = amp * Math.sqrt(T);
  const k = 0.045;
  const wv = (x: number) => {
    if (x < bx0) return EY - amp * Math.cos(k * (x - bx0) - t * 3.2) * 0.9;
    if (x > bx1) return EY - at * Math.cos(k * (x - bx1) - t * 3.2) * behind;
    const u = (x - bx0) / w;
    const env = amp * 0.9 * Math.pow(Math.sqrt(T) / 0.9, u);
    return EY - env * Math.cos(-t * 3.2) * (u < 1 ? 1 : behind);
  };
  // pembalikan amonia: N bolak-balik melewati bidang H
  const ph = Math.sin(flipT * 2.2 * rate);
  const nY = 540 - 90 * Math.sign(ph) * Math.min(1, Math.abs(ph) * 3);

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: penghalang & gelombang */}
        <g opacity={pA}>
          <Chalk d={`M${X0},${BASE} H${bx0} V${TOPV} H${bx1} V${BASE} H${X1}`} p={bar} color={C.ink} width={7} />
          <rect x={bx0} y={TOPV} width={w} height={BASE - TOPV} fill="url(#hatch)" opacity={0.6 * bar} />
          <Label x={960} y={TOPV - 40} size={46} font="serif" italic color={C.red} opacity={bar}>
            V₀ = 5 eV
          </Label>
          <Chalk d={`M${X0},${EY} H${X1}`} color={C.muted} width={2.5} dash="6 10" />
          <Label x={X0 + 10} y={EY - 125} size={42} color={C.muted} anchor="start">
            E = 1 eV
          </Label>
          <WaveLine x0={X0} x1={X1} n={400} f={(u) => wv(X0 + u * (X1 - X0))} color={C.blue} width={5} p={inc} />
          {/* aliran partikel: sebagian besar memantul, sesekali satu menembus (peluang = T) */}
          <g opacity={behind}>
            {pA > 0.001 && (() => {
              const out: React.ReactNode[] = [];
              const t0 = cue(1) - 2.5;
              const dt = 0.11;
              const v = 520; // px/s
              const yP = BASE - 50;
              const iMax = Math.floor((t - t0) / dt);
              for (let i = Math.max(0, iMax - 40); i <= iMax; i++) {
                const age = t - (t0 + i * dt);
                if (age < 0) continue;
                const xHit = bx0 - 8;
                const tHit = (xHit - X0) / v;
                const pass = rand(i * 3.17 + 0.5) < T;
                const yy = yP + (rand(i * 1.91) - 0.5) * 70;
                let x: number;
                let col: string = C.blue;
                let o = 1;
                if (age < tHit) x = X0 + age * v;
                else if (!pass) {
                  x = xHit - (age - tHit) * v;
                  o = Math.max(0, 1 - (age - tHit) / 1.1);
                } else {
                  x = bx1 + 8 + (age - tHit) * v;
                  col = C.green;
                }
                if (x < X0 - 10 || x > X1 + 10 || o <= 0.01) continue;
                out.push(<Spark key={i} x={x} y={yy} r={pass && age >= tHit ? 7 : 5} color={col} opacity={o * (pass && age >= tHit ? 1 : 0.75)} halo={pass && age >= tHit ? 1.6 : 0.6} />);
              }
              return out;
            })()}
          </g>
          <g opacity={behind}>
            <Label x={1450} y={EY - 130} size={46} color={C.green}>
              muncul di balik dinding
            </Label>
          </g>
          <Arrow x1={bx0} y1={BASE + 40} x2={bx1} y2={BASE + 40} color="yellow" width={3} both p={n1} />
          <Label x={960} y={BASE + 80} size={44} color={C.yellow} opacity={n1}>
            {`d = ${d.toFixed(1).replace('.', ',')} nm`}
          </Label>
        </g>

        {/* B: pengaruh massa */}
        <g opacity={pB}>
          <Chalk d="M300,780 H1100 M300,780 V320" color={C.muted} width={3} />
          <WaveLine x0={300} x1={1100} f={(u) => 780 - 400 * Math.exp(-u * 4)} color={C.blue} width={5} />
          <WaveLine x0={300} x1={1100} f={(u) => 780 - 400 * Math.exp(-u * 4 * 42.8)} color={C.orange} width={5} n={300} />
          <Label x={720} y={560} size={48} color={C.blue}>
            elektron
          </Label>
          <Label x={420} y={300} size={48} color={C.orange} anchor="start">
            proton: meluruh 43× lebih cepat
          </Label>
          <Label x={700} y={830} size={42} color={C.muted}>
            jarak di dalam penghalang →
          </Label>
          <Label x={1450} y={680} size={44} color={C.yellow} p={ramp(t, cue(7) - 0.1, cue(7) + 0.8)}>
            elektron, lalu hidrogen
          </Label>
        </g>

        {/* C: amonia membalik payung */}
        <g opacity={pC}>
          {/* sumur ganda */}
          <WaveLine x0={1060} x1={1700} f={(u) => 780 - 260 * (((u - 0.5) * 2) ** 2 - 1) ** 2 * 0.9 - 30} color={C.ink} width={5} />
          <Chalk d="M1150,700 H1610" color={C.blue} width={3} dash="8 8" />
          <path d="M1250,690 C1330,600 1430,600 1510,690" fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="10 8" markerEnd="url(#arrow-green)" />
          <Label x={1380} y={470} size={42} color={C.green}>
            menerowong
          </Label>
          <Label x={1180} y={830} size={42} color={C.muted}>
            N di atas
          </Label>
          <Label x={1580} y={830} size={42} color={C.muted}>
            N di bawah
          </Label>
          {/* molekul */}
          <g transform="translate(470 560) scale(1.6) translate(-470 -560)">
          {[
            [330, 560],
            [470, 520],
            [610, 560],
          ].map((h, i) => (
            <Bond key={i} x1={470} y1={nY} x2={h[0]} y2={h[1]} width={5} />
          ))}
          <Chalk d="M300,540 H640" color={C.muted} width={2} dash="6 8" />
          {[
            [330, 560],
            [470, 520],
            [610, 560],
          ].map((h, i) => (
            <Atom key={i} x={h[0]} y={h[1]} el="H" r={24} label={deut > 0.5 ? 'D' : 'H'} />
          ))}
          <Atom x={470} y={nY} el="N" r={34} />
          </g>
          <Label x={470} y={820} size={56} color={C.ink}>
            {deut > 0.5 ? 'ND₃' : 'NH₃'}
          </Label>
        </g>
      </Stage>

      <Formula x={1450} y={500} p={pB} accent={C.orange} size={56} caption="laju peluruhan di dalam penghalang">
        <V>κ</V> ={' '}
        <Frac
          n={
            <Sqrt>
              2<V>m</V>(<V>V</V>
              <Sub>0</Sub> − <V>E</V>)
            </Sqrt>
          }
          d={<Hbar />}
        />
      </Formula>
      <Note x={1440} y={250} text="penerowongan kuantum" color={C.green} size={58} p={ramp(t, cue(2) - 0.1, cue(2) + 0.7)} opacity={win(t, cue(2) - 0.1, cue(3) - 0.3, 0.3, 0.4)} />
      <Formula x={1450} y={260} p={fT} accent={C.yellow} caption="peluang tembus (penghalang tebal)">
        <V>T</V> ≈ <V>e</V>
        <Sup>
          −2<V>κd</V>
        </Sup>
      </Formula>
      <Note x={420} y={250} text={widen > 0.5 ? 'd = 0,5 nm → T ≈ 9 × 10⁻⁵ (≈ 460× lebih kecil)' : 'd = 0,2 nm → T ≈ 4%'} color={C.yellow} size={46} anchor="left" p={n1} opacity={pA} />
      <Formula x={1380} y={250} p={ramp(t, cue(9) - 0.1, cue(9) + 0.8)} accent={C.blue} size={56} caption={deut > 0.5 ? 'ND₃ ≈ 1,6 GHz, sekitar 15× lebih lambat' : 'pembalikan amonia'}>
        {deut > 0.5 ? (
          <>
            <V>ν</V> ≈ 1,6 × 10<Sup>9</Sup> /s
          </>
        ) : (
          <>
            <V>ν</V> ≈ 24 × 10<Sup>9</Sup> /s
          </>
        )}
      </Formula>
    </AbsoluteFill>
  );
};
