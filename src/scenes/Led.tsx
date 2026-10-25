import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Arrow, Chalk, Halo, Label, Note, Spark, Stage} from '../components/primitives';
import {LedBulb, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

export const Led: React.FC = () => {
  const {t, cue} = useScene();
  const pA = win(t, -1, cue(2) - 0.4, 0.5, 0.6);
  const bulb = ramp(t, 0.2, 1.0, BACK);
  const stack = ramp(t, cue(1) - 0.1, cue(1) + 1.2);
  const pB = win(t, cue(2) - 0.2, cue(7) - 0.4, 0.7, 0.6);
  const trap = ramp(t, cue(2) + 0.6, cue(2) + 1.6);
  const recomb = ramp(t, cue(3) + 0.5, cue(3) + 1.6, EASE_IN_OUT);
  const thinP = ramp(t, cue(5) + 0.2, cue(5) + 2.4, EASE_IN_OUT);
  const nobel = ramp(t, cue(6) - 0.1, cue(6) + 0.8, BACK);
  const pC = win(t, cue(7) - 0.2, cue(8) - 0.3, 0.7, 0.6);
  const pD = ramp(t, cue(8) - 0.2, cue(8) + 0.8);

  // diagram pita: sumur di pita konduksi (atas) & valensi (bawah)
  const W = mix(220, 120, thinP); // lebar sumur (px)
  const cx = 760;
  const CB = 360;
  const VB = 720;
  const dep = 90;
  const e1 = CB + dep - (dep * 0.45 * (220 / W) ** 2) * 0.55; // tingkat elektron naik saat sumur menipis
  const h1 = VB - dep + (dep * 0.45 * (220 / W) ** 2) * 0.55;
  const photonCol = thinP > 0.5 ? C.lilac : C.blue;
  const elY = mix(e1 - 14, h1 - 14, recomb > 0.98 ? 0 : 0);
  return (
    <AbsoluteFill>
      <Stage>
        {/* A: lampu & tumpukan lapisan */}
        <g opacity={pA}>
          <g opacity={bulb}>
            <Halo x={420} y={520} r={360} color="blue" opacity={0.9} />
            {/* sinar & foton yang terpancar */}
            {Array.from({length: 14}, (_, i) => {
              const a = (i / 14) * Math.PI * 2 + t * 0.12;
              return <line key={i} x1={420 + Math.cos(a) * 200} y1={520 + Math.sin(a) * 200} x2={420 + Math.cos(a) * 250} y2={520 + Math.sin(a) * 250} stroke={C.blue} strokeWidth={2.4} strokeLinecap="round" opacity={0.35 + 0.25 * Math.sin(t * 3 + i)} />;
            })}
            {Array.from({length: 10}, (_, i) => {
              const a = i * 2.39996 + 0.4;
              const u = (t * 0.45 + i * 0.137) % 1;
              const r = 210 + u * 210;
              return <Spark key={i} x={420 + Math.cos(a) * r} y={520 + Math.sin(a) * r * 0.9} r={5} color={C.blue} opacity={(1 - u) * 0.9} halo={0.7} />;
            })}
            <LedBulb x={420} y={600} s={2.0} on={0.7 + 0.3 * Math.sin(t * 2)} color={C.blue} />
          </g>
          <g opacity={stack}>
            <Chalk d="M560,420 L900,340 M560,680 L900,760" color={C.muted} width={3} dash="8 8" />
            {[
              {y: 340, h: 170, c: '#7d8a84', l: 'GaN'},
              {y: 510, h: 46, c: C.blue, l: 'InGaN  (beberapa nm)'},
              {y: 556, h: 204, c: '#7d8a84', l: 'GaN'},
            ].map((L, i) => (
              <g key={i}>
                <rect x={920} y={L.y} width={560} height={L.h} fill={L.c} opacity={i === 1 ? 0.6 : 0.25} />
                <rect x={920} y={L.y} width={560} height={L.h} fill="none" stroke={C.ink} strokeWidth={3} />
                <Label x={1500} y={L.y + L.h / 2} size={44} color={i === 1 ? C.blue : C.ink} anchor="start">
                  {L.l}
                </Label>
              </g>
            ))}
            {/* elektron & hole bertemu di lapisan InGaN, lalu berkedip memancarkan cahaya */}
            {Array.from({length: 7}, (_, i) => {
              const ph = (t * 0.7 + i * 0.143) % 1;
              const x = 960 + ((i * 0.618 * 480) % 480);
              const flash = Math.max(0, 1 - Math.abs(ph - 0.5) * 6);
              return (
                <g key={i}>
                  <Spark x={x - 30 * (1 - ph)} y={533 - 8} r={5} color={C.blue} opacity={ph < 0.5 ? 1 : 0} halo={0.4} />
                  <Spark x={x + 30 * (1 - ph)} y={533 + 8} r={5} color={C.pink} opacity={ph < 0.5 ? 1 : 0} halo={0.4} />
                  <circle cx={x} cy={533} r={10 + 30 * flash} fill={C.blue} opacity={0.5 * flash} />
                </g>
              );
            })}
          </g>
        </g>

        {/* B: diagram pita & sumur kuantum */}
        <g opacity={pB}>
          <Chalk d={`M260,${CB} H${cx - W / 2} V${CB + dep} H${cx + W / 2} V${CB} H1260`} color={C.ink} width={6} />
          <Chalk d={`M260,${VB} H${cx - W / 2} V${VB - dep} H${cx + W / 2} V${VB} H1260`} color={C.ink} width={6} />
          <Label x={300} y={CB - 40} size={42} color={C.muted} anchor="start">
            pita konduksi
          </Label>
          <Label x={300} y={VB + 44} size={42} color={C.muted} anchor="start">
            pita valensi
          </Label>
          <Chalk d={`M${cx - W / 2 + 10},${e1} H${cx + W / 2 - 10}`} color={C.blue} width={4} />
          <Chalk d={`M${cx - W / 2 + 10},${h1} H${cx + W / 2 - 10}`} color={C.pink} width={4} />
          <g opacity={trap * (1 - recomb)}>
            <circle cx={cx + 40 * Math.sin(t * 6)} cy={elY} r={14} fill={C.blue} />
            <circle cx={cx - 40 * Math.sin(t * 6 + 1)} cy={h1 - 14} r={14} fill={C.pink} />
          </g>
          <g opacity={recomb}>
            <Arrow x1={cx} y1={e1 + 8} x2={cx} y2={h1 - 10} color="yellow" width={4} />
            <WaveLine x0={cx + 60} x1={cx + 380} f={(u) => (CB + VB) / 2 - 24 * Math.sin(u * (thinP > 0.5 ? 9 : 7) * Math.PI - t * 6)} color={photonCol} width={5} />
            <Label x={cx + 220} y={(CB + VB) / 2 - 60} size={46} color={photonCol}>
              {thinP > 0.5 ? 'foton lebih ungu' : 'foton biru'}
            </Label>
          </g>
          <Arrow x1={cx - W / 2} y1={VB + 110} x2={cx + W / 2} y2={VB + 110} color="yellow" width={3} both />
          <Label x={cx} y={VB + 150} size={42} color={C.yellow}>
            tebal sumur
          </Label>
        </g>

        {/* C: biru + fosfor kuning → putih */}
        <g opacity={pC}>
          <Halo x={800} y={520} r={300} color="blue" />
          <Halo x={1040} y={520} r={300} color="yellow" />
          <circle cx={800} cy={520} r={170} fill="#4f8dff" opacity={0.75} style={{mixBlendMode: 'screen'}} />
          <circle cx={1040} cy={520} r={170} fill="#ffd34f" opacity={0.75} style={{mixBlendMode: 'screen'}} />
          <ellipse cx={920} cy={520} rx={58} ry={126} fill="#ffffff" opacity={0.35 + 0.1 * Math.sin(t * 2)} style={{mixBlendMode: 'screen'}} />
          <Label x={720} y={740} size={46} color={C.blue}>
            biru (LED)
          </Label>
          <Label x={1120} y={740} size={46} color={C.yellow}>
            kuning (fosfor)
          </Label>
          <Label x={920} y={300} size={56} color={C.ink}>
            = tampak putih
          </Label>
        </g>

        {/* D: laser & serat optik */}
        <g opacity={pD}>
          <rect x={220} y={470} width={240} height={110} rx={10} fill="none" stroke={C.ink} strokeWidth={5} />
          <rect x={250} y={515} width={180} height={20} fill={C.red} opacity={0.6} />
          <Label x={340} y={630} size={42} color={C.ink}>
            laser sumur kuantum
          </Label>
          <Chalk d="M460,500 C800,500 900,430 1200,430 S1600,520 1720,500 M460,550 C800,550 900,480 1200,480 S1600,570 1720,550" color={C.muted} width={4} />
          <path
            d={Array.from({length: 13}, (_, i) => {
              const u = i / 12;
              const x = 460 + u * 1260;
              const yc = 525 - 50 * Math.sin(Math.PI * Math.min(1, u * 1.4)) * (u < 0.6 ? 1 : 0.5);
              return `${i ? 'L' : 'M'}${x},${yc + (i % 2 ? -18 : 18)}`;
            }).join(' ')}
            fill="none"
            stroke={C.red}
            strokeWidth={3.5}
            pathLength={1}
            strokeDasharray={`${ramp(t, cue(8) + 0.4, cue(8) + 2.4)} 1`}
          />
          <Label x={1100} y={640} size={46} color={C.red}>
            cahaya inframerah dalam serat optik
          </Label>
        </g>
      </Stage>
      <Note x={1500} y={260} text="warna = komposisi indium + tebal sumur" color={C.yellow} size={46} p={ramp(t, cue(4) - 0.1, cue(4) + 0.8)} opacity={pB * (1 - nobel)} />
      <Note x={1480} y={260} text="Nobel Fisika 2014: Akasaki, Amano, Nakamura" color={C.yellow} size={46} p={nobel} opacity={pB} />
      <Note x={1860} y={800} anchor="right" text="sumur tipis → pengurungan kuat → λ pendek" color={C.lilac} size={44} p={thinP} opacity={pB} />
    </AbsoluteFill>
  );
};
