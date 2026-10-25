import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Chalk, Formula, Frac, Label, Note, Sqrt, Stage, Sub, V} from '../components/primitives';
import {Guitar, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const X0 = 260;
const X1 = 1060;
const TOP = 300;
const BOT = 780;
const MID = 560;

export const Walls: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const walls = ramp(t, 0.2, 1.4);
  const inf = win(t, cue(1) - 0.2, cue(3) - 0.3, 0.7, 0.6);
  const zero = win(t, wordOf(2, 'nol') - 0.3, cue(3) + 0.5, 0.6, 0.6);
  const guitar = win(t, cue(3) - 0.2, cue(4) + 0.2, 0.6, 0.6);
  const travel = win(t, cue(4) - 0.2, cue(5) - 0.2, 0.7, 0.6);
  const sum = ramp(t, wordOf(4, 'berdiri') - 0.6, wordOf(4, 'berdiri') + 0.6);
  const modes = ramp(t, cue(5) - 0.2, cue(5) + 0.6);
  const fL = win(t, cue(6) - 0.1, cue(7) - 0.3, 0.7, 0.5);
  const fPsi = ramp(t, cue(7) - 0.1, cue(7) + 1.0);
  const stack = ramp(t, cue(8) - 0.2, cue(8) + 0.8);
  const pick = ramp(t, cue(9) - 0.1, cue(9) + 0.8, BACK);

  // n mengikuti narasi baris 5: setengah → satu → satu setengah gelombang
  const n5 = t < wordOf(5, 'satu') ? 1 : t < wordOf(5, 'setengah', 1) ? 2 : 3;
  const n = t >= cue(5) - 0.2 ? n5 : 1;
  const A = 150;
  const om = 3.2;
  const xs = (u: number) => X0 + u * (X1 - X0);

  return (
    <AbsoluteFill>
      <Stage>
        {/* daerah luar: V tak berhingga */}
        <g opacity={inf}>
          <rect x={60} y={TOP - 40} width={X0 - 60} height={BOT - TOP + 40} fill="url(#hatch)" opacity={0.8} />
          <rect x={X1} y={TOP - 40} width={1300 - X1} height={BOT - TOP + 40} fill="url(#hatch)" opacity={0.8} />
          <Label x={(60 + X0) / 2} y={TOP + 40} size={50} color={C.red}>
            V = ∞
          </Label>
          <Label x={(X1 + 1300) / 2} y={TOP + 40} size={50} color={C.red}>
            V = ∞
          </Label>
          <Label x={(X0 + X1) / 2} y={BOT - 40} size={50} color={C.green}>
            V = 0
          </Label>
        </g>
        {/* dinding */}
        <Chalk d={`M${X0},${TOP - 40} V${BOT}`} p={walls} color={C.ink} width={9} opacity={1 - stack} />
        <Chalk d={`M${X1},${TOP - 40} V${BOT}`} p={walls} color={C.ink} width={9} opacity={1 - stack} />
        <Chalk d={`M${X0},${BOT} H${X1}`} p={walls} color={C.muted} width={3} opacity={1 - stack} />
        <Label x={X0} y={BOT + 46} size={44} font="serif" italic color={C.ink} p={walls} opacity={1 - stack}>
          x = 0
        </Label>
        <Label x={X1} y={BOT + 46} size={44} font="serif" italic color={C.ink} p={walls} opacity={1 - stack}>
          x = L
        </Label>

        {/* ψ = 0 di dinding */}
        <g opacity={zero}>
          <circle cx={X0} cy={MID} r={16} fill="none" stroke={C.red} strokeWidth={5} />
          <circle cx={X1} cy={MID} r={16} fill="none" stroke={C.red} strokeWidth={5} />
          <Label x={X0 + 30} y={MID - 50} size={46} color={C.red} anchor="start">
            ψ = 0
          </Label>
          <Label x={X1 - 30} y={MID - 50} size={46} color={C.red} anchor="end">
            ψ = 0
          </Label>
        </g>

        {/* senar gitar */}
        <g opacity={guitar}>
          <Guitar x0={X0} x1={X1} y={MID} />
          <WaveLine x0={X0} x1={X1} f={(u) => MID - 60 * Math.sin(Math.PI * u) * Math.cos(t * 9)} color={C.yellow} width={4} />
          <Label x={(X0 + X1) / 2} y={TOP + 10} size={48} color={C.yellow}>
            senar terikat di kedua ujung
          </Label>
        </g>

        {/* gelombang ke kanan + ke kiri → berdiri */}
        <g opacity={travel}>
          <WaveLine x0={X0} x1={X1} f={(u) => MID - 75 * Math.sin(2 * Math.PI * u - t * om)} color={C.blue} width={3} dash="10 8" opacity={1 - 0.5 * sum} />
          <WaveLine x0={X0} x1={X1} f={(u) => MID + 75 * Math.sin(2 * Math.PI * u + t * om)} color={C.pink} width={3} dash="10 8" opacity={1 - 0.5 * sum} />
          <g opacity={sum}>
            <WaveLine x0={X0} x1={X1} f={(u) => MID - 75 * (Math.sin(2 * Math.PI * u - t * om) - Math.sin(2 * Math.PI * u + t * om))} color={C.ink} width={5} />
          </g>
          <Label x={X0 + 140} y={TOP + 10} size={42} color={C.blue}>
            → ke kanan
          </Label>
          <Label x={X1 - 140} y={TOP + 10} size={42} color={C.pink}>
            ke kiri ←
          </Label>
          <Label x={(X0 + X1) / 2} y={BOT - 40} size={46} color={C.ink} opacity={sum}>
            jumlahnya: gelombang berdiri
          </Label>
        </g>

        {/* pola yang lolos */}
        <g opacity={modes * (1 - stack)}>
          <WaveLine x0={X0} x1={X1} f={(u) => MID - A * Math.sin(n * Math.PI * u) * Math.cos(t * om)} color={C.blue} width={6} />
          <WaveLine x0={X0} x1={X1} f={(u) => MID - A * Math.sin(n * Math.PI * u)} color={C.blue} width={2.5} dash="4 9" opacity={0.55} />
          <WaveLine x0={X0} x1={X1} f={(u) => MID + A * Math.sin(n * Math.PI * u)} color={C.blue} width={2.5} dash="4 9" opacity={0.55} />
          {/* tanda λ/2 */}
          {Array.from({length: n}, (_, k) => (
            <g key={k} opacity={fL}>
              <path d={`M${xs(k / n) + 6},${BOT - 70} q${(X1 - X0) / n / 2 - 6},-34 ${(X1 - X0) / n - 12},0`} fill="none" stroke={C.yellow} strokeWidth={3} />
              <Label x={xs((k + 0.5) / n)} y={BOT - 112} size={40} color={C.yellow} font="serif" italic>
                λ/2
              </Label>
            </g>
          ))}
          <Label x={(X0 + X1) / 2} y={TOP - 4} size={50} color={C.blue}>
            {n === 1 ? 'setengah gelombang' : n === 2 ? 'satu gelombang' : 'satu setengah gelombang'}
          </Label>
        </g>

        {/* tumpukan n = 1, 2, 3 + gelombang yang ditolak */}
        <g opacity={stack}>
          {[3, 2, 1].map((m, i) => {
            const y = 380 + i * 150;
            const pp = ramp(t, cue(8) + i * 0.4, cue(8) + 0.8 + i * 0.4);
            return (
              <g key={m} opacity={pp}>
                <Chalk d={`M${X0},${y - 60} V${y + 60} M${X1},${y - 60} V${y + 60}`} color={C.ink} width={6} />
                <path
                  d={`M${X0},${y} ${Array.from({length: 81}, (_, j) => `L${(X0 + ((X1 - X0) * j) / 80).toFixed(1)},${(y - 55 * Math.abs(Math.sin((m * Math.PI * j) / 80))).toFixed(1)}`).join(' ')} ${Array.from({length: 81}, (_, j) => `L${(X1 - ((X1 - X0) * j) / 80).toFixed(1)},${(y + 55 * Math.abs(Math.sin((m * Math.PI * (80 - j)) / 80))).toFixed(1)}`).join(' ')} Z`}
                  fill={[C.blue, C.green, C.pink][m - 1]}
                  opacity={0.08}
                />
                <WaveLine x0={X0} x1={X1} f={(u) => y - 55 * Math.sin(m * Math.PI * u)} color={[C.blue, C.green, C.pink][m - 1]} width={2} dash="3 8" opacity={0.5} />
                <WaveLine x0={X0} x1={X1} f={(u) => y + 55 * Math.sin(m * Math.PI * u)} color={[C.blue, C.green, C.pink][m - 1]} width={2} dash="3 8" opacity={0.5} />
                <WaveLine x0={X0} x1={X1} f={(u) => y - 55 * Math.sin(m * Math.PI * u) * Math.cos(t * om)} color={[C.blue, C.green, C.pink][m - 1]} width={5} />
                <Label x={X0 - 60} y={y} size={48} color={[C.blue, C.green, C.pink][m - 1]} font="serif" italic anchor="end">
                  {`n = ${m}`}
                </Label>
              </g>
            );
          })}
          <g opacity={pick}>
            <WaveLine x0={X0} x1={X1 + 60} f={(u) => 830 - 30 * Math.sin(2.6 * Math.PI * u)} color={C.red} width={3.5} opacity={0.8} />
            <Chalk d={`M${X1 + 20},800 l60,60 M${X1 + 80},800 l-60,60`} color={C.red} width={6} />
          </g>
        </g>
      </Stage>

      <Formula x={1480} y={280} p={fL} accent={C.yellow} caption="panjang kotak = bilangan bulat × λ/2">
        <V>L</V> = <V>n</V> <Frac n={<V>λ</V>} d="2" />
      </Formula>
      <Formula x={1480} y={280} p={fPsi} accent={C.blue} caption="n = 1, 2, 3, …">
        <V>ψ</V>
        <Sub>
          <V>n</V>
        </Sub>
        (<V>x</V>) ={' '}
        <Sqrt>
          <Frac n="2" d={<V>L</V>} size={0.7} />
        </Sqrt>{' '}
        sin
        <span style={{fontSize: '1.15em'}}>(</span>
        <Frac
          n={
            <>
              <V>n</V>π<V>x</V>
            </>
          }
          d={<V>L</V>}
        />
        <span style={{fontSize: '1.15em'}}>)</span>
      </Formula>
      <Note x={1480} y={560} text="n = bilangan kuantum translasi" color={C.green} size={48} p={stack} />
      <Note x={1480} y={700} text="dinding memilih gelombang yang boleh ada" color={C.yellow} size={46} p={pick} />
    </AbsoluteFill>
  );
};
