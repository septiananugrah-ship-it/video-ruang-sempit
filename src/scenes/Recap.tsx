import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Chalk, Halo, Label, Spark, Stage} from '../components/primitives';
import {Carrot, FlashDisk, LedBulb, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const ROWS = [
  {k: 1, text: 'dinding → gelombang berdiri → E ∝ n²', col: C.blue},
  {k: 2, text: 'makin sempit, makin besar energi · E₁ > 0', col: C.pink},
  {k: 3, text: 'panjang rantai pi menentukan warna', col: C.orange},
  {k: 4, text: 'dinding berhingga → penerowongan (amonia)', col: C.green},
  {k: 5, text: 'titik kuantum · sumur kuantum LED · memori flash', col: C.yellow},
];

export const Recap: React.FC = () => {
  const {t, cue, dur} = useScene();
  const pA = win(t, -1, cue(6) - 0.4, 0.5, 0.7);
  const head = ramp(t, 0.1, 1.0);
  const pB = win(t, cue(6) - 0.2, cue(7) - 0.2, 0.7, 0.6);
  const pC = ramp(t, cue(7) - 0.2, cue(7) + 0.8);
  const sq = ramp(t, cue(7) + 0.4, cue(8) + 1.0, EASE_IN_OUT);
  const fin = ramp(t, cue(8) + 0.6, cue(8) + 3.2);
  const half = mix(330, 170, sq);
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={pA}>
          <Label x={260} y={250} size={64} color={C.ink} anchor="start" p={head}>
            Ringkasan
          </Label>
          <Chalk d="M255,290 C330,284 420,296 520,288" p={head} color={C.yellow} width={4} />
          {ROWS.map((r, i) => {
            const p = ramp(t, cue(r.k) - 0.2, cue(r.k) + 1.6);
            const tick = ramp(t, cue(r.k) + 1.2, cue(r.k) + 1.7, BACK);
            const y = 380 + i * 100;
            return (
              <g key={i}>
                <path d={`M280,${y} l14,16 l26,-34`} fill="none" stroke={r.col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={tick} />
                <Label x={350} y={y} size={47} color={C.ink} anchor="start" p={p}>
                  {r.text}
                </Label>
              </g>
            );
          })}
        </g>
        {/* rasi ringkasan: tiap poin menyalakan satu bintang, lalu semuanya terhubung */}
        <g opacity={pA}>
          {(() => {
            const P: [number, number][] = [
              [1560, 330],
              [1745, 440],
              [1760, 640],
              [1590, 760],
              [1460, 560],
            ];
            const on = ROWS.map((r) => ramp(t, cue(r.k) + 0.9, cue(r.k) + 1.7));
            const close = ramp(t, cue(5) + 2.0, cue(5) + 3.2);
            return (
              <g>
                {P.map((q, i) => {
                  const nx = P[(i + 1) % 5];
                  const pl = i < 4 ? on[i + 1] : close;
                  return <Chalk key={`l${i}`} d={`M${q[0]},${q[1]} L${nx[0]},${nx[1]}`} p={pl} color={C.lilac} width={2.2} opacity={0.65} />;
                })}
                {P.map((q, i) => (
                  <g key={i} opacity={on[i]}>
                    <Halo x={q[0]} y={q[1]} r={70 + 10 * Math.sin(t * 2 + i)} color={(['blue', 'pink', 'orange', 'green', 'yellow'] as const)[i]} />
                    <Spark x={q[0]} y={q[1]} r={9} color={ROWS[i].col} />
                    <text x={q[0] + 22} y={q[1] - 22} fontFamily={FONT.mono} fontSize={20} fill={ROWS[i].col} opacity={0.85}>
                      {`0${i + 1}`}
                    </text>
                  </g>
                ))}
                <Halo x={1610} y={545} r={260} color="lilac" opacity={0.6 * close} />
              </g>
            );
          })()}
        </g>
        <g opacity={pB}>
          <Carrot x={480} y={500} s={1.0} />
          <LedBulb x={960} y={600} s={1.6} on={0.8 + 0.2 * Math.sin(t * 3)} color={C.blue} />
          <FlashDisk x={1440} y={520} s={1.1} />
        </g>
        <g opacity={pC * (1 - ramp(t, dur - 0.9, dur - 0.2))}>
          <Chalk d={`M${960 - half},280 V620 H${960 + half} V280`} color={C.ink} width={8} />
          <WaveLine x0={960 - half} x1={960 + half} f={(u) => 470 - 110 * Math.sin(Math.PI * u) * Math.cos(t * (3 + 5 * sq))} color={C.blue} width={6} />
          <Label x={960} y={690} size={60} color={C.yellow}>
            ruang sempit
          </Label>
          <Label x={960} y={790} size={50} color={C.ink} p={fin}>
            → warna & ingatan dunia kita
          </Label>
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
