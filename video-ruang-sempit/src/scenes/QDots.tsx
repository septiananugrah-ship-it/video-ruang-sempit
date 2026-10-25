import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Arrow, Formula, Frac, Halo, Label, Note, Spark, Stage, Sub, Sup, V} from '../components/primitives';
import {TV} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// ukuran (nm) → warna pendar (perkiraan untuk CdSe; 2 & 6 nm sesuai narasi, sisanya skematis)
const DOTS = [
  {nm: 2, col: '#3fd3c8', lab: '≈ 2 nm'},
  {nm: 3, col: '#5fe06a', lab: ''},
  {nm: 4, col: '#f2de4a', lab: ''},
  {nm: 5, col: '#f39a3c', lab: ''},
  {nm: 6, col: '#ec4b42', lab: '≈ 6 nm'},
];

const Crystal: React.FC<{x: number; y: number; r: number; col: string; glow: number; t: number}> = ({x, y, r, col, glow, t}) => (
  <g>
    <circle cx={x} cy={y} r={r * (1.8 + 0.2 * Math.sin(t * 3))} fill={col} opacity={0.18 * glow} />
    <circle cx={x} cy={y} r={r} fill={col} opacity={0.25 + 0.45 * glow} />
    <circle cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={3} />
    {r > 30
      ? Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={x + Math.cos(a) * r * 0.55} cy={y + Math.sin(a) * r * 0.55} r={3} fill={C.ink} opacity={0.5} />;
        })
      : null}
  </g>
);

export const QDots: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(3) - 0.4, 0.5, 0.6);
  const zoom = ramp(t, 0.4, cue(0) + 3.0, EASE_IN_OUT);
  const eh = ramp(t, cue(1) + 0.4, cue(1) + 1.2, BACK);
  const fE = win(t, cue(2) - 0.1, cue(3) - 0.4, 0.7, 0.5);
  const pB = win(t, cue(3) - 0.2, cue(7) - 0.4, 0.7, 0.6);
  const bulk = ramp(t, cue(3), cue(3) + 0.8);
  const d6 = ramp(t, cue(4) - 0.1, cue(4) + 0.7, BACK);
  const d2 = ramp(t, cue(5) - 0.1, cue(5) + 0.7, BACK);
  const mid = ramp(t, cue(6) - 0.1, cue(6) + 0.8);
  const vials = ramp(t, cue(6) + 0.4, cue(6) + 1.4);
  const pC = win(t, cue(7) - 0.2, cue(9) - 0.4, 0.7, 0.6);
  const growT = ramp(t, cue(7) + 0.8, cue(8) - 0.6, EASE_IN_OUT);
  const nobel = ramp(t, cue(8) - 0.1, cue(8) + 0.8, BACK);
  const pD = win(t, cue(9) - 0.2, cue(10) - 0.3, 0.7, 0.6);
  const pE = ramp(t, cue(10) - 0.2, cue(10) + 0.8);

  const growNm = mix(2, 6, growT);
  const growCol = DOTS[Math.min(4, Math.round(growNm - 2))].col;

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: bongkahan → kristal nano */}
        <g opacity={pA}>
          <g transform={`translate(520 520) scale(${mix(1, 2.6, zoom)})`}>
            <rect x={-120 + zoom * 60} y={-120 + zoom * 60} width={240 - zoom * 120} height={240 - zoom * 120} fill="none" stroke={C.ink} strokeWidth={4 / mix(1, 2.6, zoom)} opacity={1 - zoom} />
            {Array.from({length: 49}, (_, i) => {
              const gx = (i % 7) - 3;
              const gy = Math.floor(i / 7) - 3;
              const inside = Math.hypot(gx, gy) < 3.3;
              return inside ? <circle key={i} cx={gx * 16} cy={gy * 16} r={4} fill={i % 2 ? C.lilac : C.orange} opacity={zoom} /> : null;
            })}
            <circle cx={0} cy={0} r={58} fill="none" stroke={C.ink} strokeWidth={4 / mix(1, 2.6, zoom)} opacity={zoom} />
          </g>
          <Label x={520} y={240} size={46} color={C.muted} opacity={zoom}>
            kristal CdSe beberapa nanometer
          </Label>
          <Halo x={520} y={520} r={330} color="lilac" opacity={zoom * 0.9} />
          <g opacity={eh}>
            {(() => {
              const R = 112;
              const pos = (ph: number, a: number, b: number): [number, number] => [520 + R * 0.8 * Math.sin(ph * a) * Math.cos(ph * 0.37), 520 + R * 0.8 * Math.sin(ph * b + 1.1) * Math.cos(ph * 0.29)];
              const e = (tt: number) => pos(tt * 2.1, 1.3, 1.7);
              const h = (tt: number) => pos(tt * 1.6 + 2, 1.1, 1.45);
              const tr = (f: (tt: number) => [number, number]) => Array.from({length: 8}, (_, k) => f(t - k * 0.03));
              const E = e(t);
              const Hh = h(t);
              return (
                <g>
                  <Spark x={E[0]} y={E[1]} r={12} color={C.blue} trail={tr(e)} />
                  <Spark x={Hh[0]} y={Hh[1]} r={12} color={C.pink} trail={tr(h)} />
                  <Label x={E[0]} y={E[1] - 30} size={30} color={C.blue}>
                    e⁻
                  </Label>
                  <Label x={Hh[0]} y={Hh[1] - 30} size={30} color={C.pink}>
                    h⁺
                  </Label>
                </g>
              );
            })()}
            <Label x={520} y={760} size={46} color={C.ink}>
              elektron & hole terkurung
            </Label>
          </g>
        </g>

        {/* B: ukuran → warna */}
        <g opacity={pB}>
          <g opacity={bulk}>
            <rect x={180} y={300} width={330} height={260} rx={20} fill="#9b1f2a" opacity={0.45} />
            <rect x={180} y={300} width={330} height={260} rx={20} fill="none" stroke={C.ink} strokeWidth={4} />
            <Label x={345} y={610} size={44} color={C.red}>
              bongkahan ≈ 710 nm
            </Label>
            <Label x={345} y={660} size={38} color={C.muted}>
              merah tua, tepi IR
            </Label>
          </g>
          {DOTS.map((d, i) => {
            const show = i === 4 ? d6 : i === 0 ? d2 : mid;
            const x = 700 + i * 220;
            return (
              <g key={i} opacity={show}>
                <Crystal x={x} y={400} r={d.nm * 13} col={d.col} glow={show} t={t + i} />
                <Label x={x} y={525} size={44} color={d.col}>
                  {d.lab || `${d.nm} nm`}
                </Label>
                {/* botol larutan yang berpendar di bawah sinar UV */}
                <g opacity={vials}>
                  <ellipse cx={x} cy={690} rx={95} ry={110} fill={d.col} opacity={0.1 + 0.05 * Math.sin(t * 2 + i)} />
                  <ellipse cx={x} cy={700} rx={55} ry={70} fill={d.col} opacity={0.14} />
                  <path d={`M${x - 34},600 V745 Q${x - 34},770 ${x},770 Q${x + 34},770 ${x + 34},745 V600`} fill={d.col} opacity={0.55} />
                  <path d={`M${x - 38},575 V745 Q${x - 38},775 ${x},775 Q${x + 38},775 ${x + 38},745 V575`} fill="none" stroke={C.ink} strokeWidth={3} opacity={0.8} />
                  <rect x={x - 42} y={562} width={84} height={18} rx={4} fill={C.faint} stroke={C.ink} strokeWidth={2} opacity={0.9} />
                  <rect x={x - 22} y={612} width={8} height={120} rx={4} fill="#ffffff" opacity={0.25} />
                </g>
              </g>
            );
          })}
          <g opacity={mid}>
            <Arrow x1={620} y1={820} x2={1660} y2={820} color="muted" width={3} />
            <Label x={1140} y={862} size={40} color={C.muted}>
              makin besar → pengurungan melemah → makin merah
            </Label>
          </g>
        </g>

        {/* C: sintesis — kristal tumbuh di pelarut panas */}
        <g opacity={pC}>
          <path d="M420,320 V430 L300,700 H740 L620,430 V320" fill="none" stroke={C.ink} strokeWidth={5} />
          <path d="M340,610 H700 L740,700 H300 Z" fill={growCol} opacity={0.35} />
          {Array.from({length: 7}, (_, i) => (
            <circle key={i} cx={380 + i * 45} cy={650 - (i % 2) * 22} r={growNm * 2.5} fill={growCol} opacity={0.9} />
          ))}
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${440 + k * 80},780 q-14,-24 0,-44 q14,-20 0,-40`} fill="none" stroke={C.orange} strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(t * 4 + k)} />
          ))}
          <Label x={520} y={250} size={46} color={C.ink}>
            pelarut panas
          </Label>
          <circle cx={1180} cy={480} r={110} fill="none" stroke={C.ink} strokeWidth={5} />
          <line x1={1180} y1={480} x2={1180 + 90 * Math.sin(growT * Math.PI * 1.8)} y2={480 - 90 * Math.cos(growT * Math.PI * 1.8)} stroke={C.yellow} strokeWidth={5} strokeLinecap="round" />
          <Label x={1180} y={640} size={46} color={C.yellow}>
            makin lama → makin besar
          </Label>
          <Label x={1550} y={480} size={64} color={growCol}>
            {`${growNm.toFixed(1).replace('.', ',')} nm`}
          </Label>
        </g>

        {/* D: TV QLED */}
        <g opacity={pD}>
          <rect x={260} y={640} width={520} height={50} rx={8} fill={C.blue} opacity={0.6} />
          <Label x={520} y={730} size={40} color={C.blue}>
            lampu latar biru
          </Label>
          <rect x={260} y={520} width={520} height={50} rx={8} fill="none" stroke={C.ink} strokeWidth={4} />
          {Array.from({length: 14}, (_, i) => (
            <circle key={i} cx={290 + i * 36} cy={545} r={i % 2 ? 9 : 13} fill={i % 2 ? '#5fe06a' : '#ec4b42'} />
          ))}
          <Label x={890} y={545} size={40} color={C.ink} anchor="start">
            lapisan titik kuantum
          </Label>
          {[0, 1, 2].map((k) => (
            <Arrow key={k} x1={380 + k * 140} y1={630} x2={380 + k * 140} y2={580} color="blue" width={4} />
          ))}
          {[
            ['#5fe06a', 360],
            ['#ec4b42', 520],
            [C.blue, 680],
          ].map(([c, x], k) => (
            <line key={k} x1={x as number} y1={505} x2={x as number} y2={400} stroke={c as string} strokeWidth={6} markerEnd="url(#arrow-ink)" />
          ))}
          <Label x={520} y={360} size={44} color={C.ink}>
            hijau + merah + biru murni
          </Label>
          <Halo x={1500} y={470} r={360} color="lilac" opacity={0.7} />
          <TV x={1500} y={470} s={1.35} glow={0.8 + 0.2 * Math.sin(t * 2)} />
        </g>

        {/* E: pencitraan sel */}
        <g opacity={pE}>
          <path d="M600,330 C820,250 1180,280 1300,420 C1400,540 1300,720 1060,760 C820,800 560,740 520,580 C490,460 520,370 600,330 Z" fill="none" stroke={C.ink} strokeWidth={5} />
          <ellipse cx={930} cy={540} rx={120} ry={90} fill="none" stroke={C.lilac} strokeWidth={4} />
          {Array.from({length: 16}, (_, i) => {
            const a = i * 2.4;
            const r = 180 + (i % 3) * 60;
            const x = 920 + Math.cos(a) * r * 1.3;
            const y = 540 + Math.sin(a) * r * 0.6;
            const c = i % 2 ? '#5fe06a' : '#ec4b42';
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={20 + 4 * Math.sin(t * 3 + i)} fill={c} opacity={0.25} />
                <circle cx={x} cy={y} r={8} fill={c} />
              </g>
            );
          })}
          <Label x={960} y={840} size={46} color={C.ink}>
            penanda sel: terang & tidak mudah pudar
          </Label>
        </g>
      </Stage>

      <Note x={1380} y={300} text="titik kuantum = kotak 3D buatan" color={C.yellow} size={52} p={ramp(t, cue(1) - 0.1, cue(1) + 0.8)} opacity={pA * (1 - fE)} />
      <Formula x={1340} y={300} p={fE} accent={C.yellow} size={56} caption="celah pita + energi pengurungan (kubus sisi L)">
        <V>E</V>
        <Sub>cahaya</Sub> ≈ <V>E</V>
        <Sub>g</Sub> +{' '}
        <Frac
          n={
            <>
              3<V>h</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              8<V>L</V>
              <Sup>2</Sup>
            </>
          }
        />
        <span style={{fontSize: '1.2em'}}>(</span>
        <Frac
          n="1"
          d={
            <>
              <V>m</V>
              <Sub>e</Sub>
              <Sup>*</Sup>
            </>
          }
        />{' '}
        +{' '}
        <Frac
          n="1"
          d={
            <>
              <V>m</V>
              <Sub>h</Sub>
              <Sup>*</Sup>
            </>
          }
        />
        <span style={{fontSize: '1.2em'}}>)</span>
      </Formula>
      <Note x={1140} y={220} text="bahan sama, hanya ukurannya berbeda" color={C.yellow} size={52} p={ramp(t, wordOf(6, 'ukurannya') - 0.4, wordOf(6, 'ukurannya') + 0.5)} opacity={pB} />
      <Note x={1380} y={240} text="Nobel Kimia 2023: Bawendi, Brus, Ekimov" color={C.yellow} size={50} p={nobel} opacity={pC} />
    </AbsoluteFill>
  );
};
