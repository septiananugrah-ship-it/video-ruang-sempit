import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, nmColor, ramp, win} from '../anim';
import {Arrow, Atom, Bond, Chalk, Dust, Formula, Frac, Halo, Label, Note, Spark, Stage, Sub, Sup, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Kerangka butadiena (atom C saja), zigzag
const BUT: [number, number][] = [
  [260, 430],
  [420, 340],
  [580, 430],
  [740, 340],
];
const LX0 = 1120;
const LX1 = 1360;
const FLOOR = 830;
const U = 26;
const yN = (n: number) => FLOOR - n * n * U;

const Elec: React.FC<{x: number; y: number; up: boolean; p: number}> = ({x, y, up, p}) => (
  <g opacity={p}>
    <line x1={x} y1={y + (up ? 16 : -16)} x2={x} y2={y + (up ? -16 : 16)} stroke={C.yellow} strokeWidth={4} markerEnd="url(#arrow-yellow)" />
  </g>
);

export const Polyene: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const q = win(t, 0.2, cue(1) - 0.2, 0.6, 0.5);
  const mol = ramp(t, cue(1) - 0.2, cue(1) + 1.4);
  const conj = ramp(t, wordOf(1, 'terkonjugasi') - 0.3, wordOf(1, 'terkonjugasi') + 0.6);
  const cloud = ramp(t, cue(2), cue(2) + 1.0);
  const box = win(t, cue(3), cue(8) - 0.4, 0.9, 0.6);
  const len = ramp(t, cue(4), cue(4) + 0.8);
  const ladder = ramp(t, cue(5) - 0.2, cue(5) + 0.7);
  const e12 = (k: number) => ramp(t, cue(5) + 0.8 + k * 0.35, cue(5) + 1.1 + k * 0.35, BACK);
  const hl = ramp(t, cue(6), cue(6) + 0.6);
  const jump = ramp(t, cue(7), cue(7) + 1.0);
  const fG = win(t, cue(7) - 0.1, cue(9) - 0.4, 0.7, 0.5);
  const cmp = win(t, cue(8) - 0.2, cue(10) - 0.3, 0.7, 0.5);
  const hex = ramp(t, cue(9) - 0.1, cue(9) + 0.8);
  const trend = ramp(t, cue(10) - 0.1, cue(10) + 1.0);
  const pMol = 1 - ramp(t, cue(8) - 0.4, cue(8) + 0.2);

  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={q}>
          <Dust x={960} y={520} r={560} opacity={0.8} />
          {/* "kotak" satu dimensi yang tergambar, lalu rantai samar di dalamnya */}
          <Chalk d="M560,560 V640 H1360 V560" p={ramp(t, 0.5, 1.6)} color={C.ink} width={4} />
          <WaveLine x0={560} x1={1360} f={(u) => 615 - 26 * Math.sin(Math.PI * u) * Math.cos(t * 3)} color={C.blue} width={3} p={ramp(t, 1.2, 2.2)} />
          {Array.from({length: 9}, (_, k) => (
            <circle key={k} cx={600 + k * 90} cy={k % 2 ? 590 : 625} r={7} fill={C.muted} opacity={0.5 * ramp(t, 1.8 + k * 0.08, 2.3 + k * 0.08)} />
          ))}
        </g>
        <g opacity={pMol}>
          <g transform={`translate(500 390) scale(${1.35 - 0.35 * box}) translate(-500 -390)`}>
          {/* awan elektron pi sepanjang rantai */}
          <g opacity={cloud}>
            <path d="M230,400 C330,300 420,300 500,340 C580,380 660,300 770,310 L770,370 C660,360 580,440 500,400 C420,360 330,360 230,460 Z" fill={C.blue} opacity={0.15} />
            {Array.from({length: 4}, (_, i) => {
              const u = (t * 0.25 + i / 4) % 1;
              const x = 260 + u * 480;
              const y = 385 + 45 * Math.cos(u * Math.PI * 3);
              return <Spark key={i} x={x} y={y - 4} r={8} color={C.blue} />;
            })}
            <Label x={500} y={250} size={36} color={C.blue}>
              elektron pi bebas di sepanjang rantai
            </Label>
          </g>
          {/* kerangka */}
          <g opacity={mol}>
            {BUT.slice(0, -1).map((a, i) => (
              <Bond key={i} x1={a[0]} y1={a[1]} x2={BUT[i + 1][0]} y2={BUT[i + 1][1]} order={i % 2 === 0 ? 2 : 1} width={5} color={i % 2 === 0 ? C.ink : C.muted} />
            ))}
            {BUT.map((a, i) => (
              <Atom key={i} x={a[0]} y={a[1]} el="C" r={26} />
            ))}
            <Label x={500} y={510} size={34} color={C.green} p={conj}>
              rangkap – tunggal – rangkap: terkonjugasi
            </Label>
          </g>
          </g>
          {/* kotak satu dimensi */}
          <g opacity={box}>
            <Chalk d="M220,600 V760 H780 V600" color={C.ink} width={7} />
            <WaveLine x0={220} x1={780} f={(u) => 700 - 40 * Math.sin(2 * Math.PI * u) * Math.cos(t * 3)} color={C.blue} width={4} />
            <Arrow x1={220} y1={800} x2={780} y2={800} color="yellow" width={3} both p={len} />
            <Label x={500} y={845} size={48} color={C.yellow} p={len}>
              L ≈ 0,578 nm · 4 elektron pi
            </Label>
          </g>
        </g>
        {/* perbandingan model vs ukur */}
        <g opacity={cmp}>
          <Label x={520} y={360} size={56} color={C.ink}>
            butadiena
          </Label>
          <Label x={360} y={450} size={46} color={C.muted}>
            model
          </Label>
          <Label x={680} y={450} size={46} color={C.muted}>
            terukur
          </Label>
          <Label x={360} y={520} size={58} color={C.blue}>
            ≈ 220 nm
          </Label>
          <Label x={680} y={520} size={58} color={C.green}>
            ≈ 217 nm
          </Label>
          <g opacity={hex}>
            <Label x={520} y={630} size={56} color={C.ink}>
              heksatriena
            </Label>
            <Label x={360} y={710} size={58} color={C.blue}>
              ≈ 354 nm
            </Label>
            <Label x={680} y={710} size={58} color={C.red}>
              ≈ 258 nm
            </Label>
            <Label x={520} y={790} size={42} color={C.muted}>
              ikatan rangkap 1,35 Å ≠ tunggal 1,54 Å
            </Label>
          </g>
        </g>

        {/* tangga energi + pengisian Pauli */}
        <g opacity={ladder * (1 - trend)}>
          {[1, 2, 3, 4].map((n) => (
            <g key={n}>
              <Chalk d={`M${LX0},${yN(n)} H${LX1}`} color={n <= 2 ? C.blue : C.muted} width={5} />
              <Label x={LX0 - 24} y={yN(n)} size={42} font="serif" italic color={C.muted} anchor="end">
                {`${n}`}
              </Label>
            </g>
          ))}
          <Elec x={1215} y={yN(1) - 18} up p={e12(0)} />
          <Elec x={1265} y={yN(1) - 18} up={false} p={e12(1)} />
          <Elec x={1215} y={yN(2) - 18} up p={e12(2) * (1 - jump)} />
          <Elec x={1265} y={yN(2) - 18} up={false} p={e12(3)} />
          <Elec x={1215} y={yN(3) - 18} up p={jump} />
          <g opacity={hl}>
            <Label x={LX1 + 30} y={yN(2)} size={46} color={C.blue} anchor="start">
              HOMO
            </Label>
            <Label x={LX1 + 30} y={yN(3)} size={46} color={C.pink} anchor="start">
              LUMO
            </Label>
          </g>
          <g opacity={jump}>
            <Arrow x1={LX0 - 70} y1={yN(2) - 6} x2={LX0 - 70} y2={yN(3) + 8} color="yellow" width={4} />
            <WaveLine x0={LX0 - 300} x1={LX0 - 100} f={(u) => (yN(2) + yN(3)) / 2 - 18 * Math.sin(u * 8 * Math.PI)} color={C.lilac} width={4} />
            <Label x={LX0 - 200} y={(yN(2) + yN(3)) / 2 + 50} size={40} color={C.lilac}>
              UV
            </Label>
          </g>
        </g>
        {/* tren: rantai makin panjang → serapan makin ke kanan (satu spektrum mini per rantai) */}
        {(() => {
          const xl = (nm: number) => 1060 + ((nm - 200) / 600) * 700;
          const rows = [
            {nb: 2, name: 'butadiena', nm: 217, lab: '217 nm', col: C.blue, hue: 'blue' as const},
            {nb: 3, name: 'heksatriena', nm: 258, lab: '258 nm', col: C.green, hue: 'green' as const},
            {nb: 11, name: 'β-karoten', nm: 450, lab: '≈ 450 nm', col: C.orange, hue: 'orange' as const},
          ];
          return (
            <g opacity={trend}>
              {rows.map((r, i) => {
                const q2 = ramp(t, cue(10) + 0.1 + i * 0.6, cue(10) + 0.8 + i * 0.6);
                const y = 400 + i * 165;
                const seg = r.nb > 5 ? 37 : 62;
                const n = r.nb * 2;
                const pts: [number, number][] = Array.from({length: n}, (_, k) => [120 + k * seg, y + (k % 2 ? -16 : 16)]);
                const sy = y + 14;
                return (
                  <g key={i} opacity={q2}>
                    {pts.slice(0, -1).map((a2, k) => (
                      <Bond key={k} x1={a2[0]} y1={a2[1]} x2={pts[k + 1][0]} y2={pts[k + 1][1]} order={k % 2 === 0 ? 2 : 1} width={3.4} color={k % 2 === 0 ? C.ink : C.muted} />
                    ))}
                    <Label x={120} y={y - 56} size={40} color={r.col} anchor="start">
                      {r.name}
                    </Label>
                    {/* spektrum mini 200–800 nm */}
                    <rect x={xl(200)} y={sy - 14} width={xl(400) - xl(200)} height={28} fill={C.lilac} opacity={0.16} />
                    <rect x={xl(200)} y={sy - 14} width={xl(400) - xl(200)} height={28} fill="url(#hatch)" opacity={0.7} />
                    {Array.from({length: 61}, (_, j) => {
                      const nm = 400 + j * 5;
                      return <rect key={j} x={xl(nm)} y={sy - 14} width={xl(405) - xl(400) + 0.6} height={28} fill={nmColor(nm)} opacity={0.8} />;
                    })}
                    <rect x={xl(700)} y={sy - 14} width={xl(800) - xl(700)} height={28} fill="url(#hatch)" opacity={0.4} />
                    <Halo x={xl(r.nm)} y={sy} r={80} color={r.hue} opacity={q2} />
                    <circle cx={xl(r.nm)} cy={sy} r={16} fill="none" stroke={r.col} strokeWidth={3.4} />
                    <Label x={xl(r.nm)} y={sy - 48} size={40} color={r.col}>
                      {r.lab}
                    </Label>
                  </g>
                );
              })}
              <Label x={xl(300)} y={870} size={34} color={C.lilac}>
                ultraviolet
              </Label>
              <Label x={xl(550)} y={870} size={34} color={C.ink}>
                cahaya tampak
              </Label>
              <Label x={960} y={290} size={50} color={C.yellow}>
                makin panjang rantai → makin panjang λ serapan
              </Label>
            </g>
          );
        })()}
      </Stage>

      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: q, pointerEvents: 'none'}}>
        <div style={{fontFamily: FONT.display, fontSize: 92, color: C.ink, lineHeight: 1.05, opacity: ramp(t, 0.2, 1.0), filter: `blur(${(1 - ramp(t, 0.2, 1.0)) * 6}px)`}}>
          Kotak satu dimensi <span style={{fontStyle: 'italic', color: C.yellow}}>di dunia kimia?</span>
        </div>
      </div>
      <Formula x={1450} y={260} p={fG} accent={C.yellow} size={58} caption="celah HOMO → LUMO, N elektron pi">
        Δ<V>E</V> ={' '}
        <Frac
          n={
            <>
              (<V>N</V> + 1) <V>h</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              8<V>m</V>
              <Sub>e</Sub>
              <V>L</V>
              <Sup>2</Sup>
            </>
          }
        />
      </Formula>
      <Note x={1840} y={250} anchor="right" text="model kasar: meleset untuk rantai panjang" color={C.red} size={46} p={ramp(t, wordOf(9, 'meleset') - 0.3, wordOf(9, 'meleset') + 0.5)} opacity={win(t, cue(9) - 0.1, cue(10) - 0.3, 0.6, 0.5)} />
    </AbsoluteFill>
  );
};
