import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Arrow, Chalk, Formula, Frac, Halo, Hbar, Label, Note, Spark, Stage, Sup, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const CX = 560;
const FLOOR = 800;

export const Squeeze: React.FC = () => {
  const {t, cue} = useScene();
  const pA = win(t, -1, cue(3) - 0.3, 0.5, 0.6);
  const sq = ramp(t, cue(0) + 1.0, cue(2) + 1.2, EASE_IN_OUT);
  const L = mix(1, 0.5, sq);
  const half = 360 * L;
  const fL = win(t, cue(1) - 0.1, cue(3) - 0.3, 0.7, 0.5);
  const four = ramp(t, cue(2) + 0.6, cue(2) + 1.4, BACK);
  const pB = win(t, cue(3) - 0.2, cue(8) - 0.3, 0.7, 0.6);
  const narrow = ramp(t, cue(4), cue(4) + 2.5, EASE_IN_OUT);
  const fH = win(t, cue(6) - 0.1, cue(8) - 0.3, 0.7, 0.5);
  const fBox = ramp(t, cue(7) - 0.1, cue(7) + 0.8);
  const pC = ramp(t, cue(8) - 0.2, cue(8) + 0.8);
  const colors = ramp(t, cue(9) - 0.1, cue(9) + 1.2);

  const U = 22; // px per E1 pada L = 1
  const yN = (n: number) => FLOOR - (n * n * U) / (L * L);
  const sx = mix(130, 40, narrow); // lebar sebaran posisi
  const sp = mix(70, 170, narrow); // lebar sebaran momentum

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: kotak menyempit, tangga naik */}
        <g opacity={pA}>
          <Chalk d={`M${CX - half},${FLOOR - 640} V${FLOOR} H${CX + half} V${FLOOR - 640}`} color={C.ink} width={8} />
          <Arrow x1={CX - half - 120} y1={FLOOR - 600} x2={CX - half - 20} y2={FLOOR - 600} color="pink" width={5} opacity={ramp(t, cue(0) + 0.6, cue(0) + 1.2) * (1 - sq * 0.3)} />
          <Arrow x1={CX + half + 120} y1={FLOOR - 600} x2={CX + half + 20} y2={FLOOR - 600} color="pink" width={5} opacity={ramp(t, cue(0) + 0.6, cue(0) + 1.2) * (1 - sq * 0.3)} />
          {[1, 2, 3].map((n) => {
            const y = yN(n);
            if (y < FLOOR - 640) return null;
            const col = [C.blue, C.green, C.pink][n - 1];
            return (
              <g key={n}>
                <Chalk d={`M${CX - half + 14},${y} H${CX + half - 14}`} color={col} width={5} />
                <Label x={CX + half + 30} y={y} size={42} font="serif" italic color={col} anchor="start">
                  {`n = ${n}`}
                </Label>
              </g>
            );
          })}
          <Arrow x1={CX - half} y1={FLOOR + 40} x2={CX + half} y2={FLOOR + 40} color="muted" width={3} both />
          <Label x={CX} y={FLOOR + 80} size={44} color={C.muted}>
            {`L = ${L.toFixed(2).replace('.', ',')}`}
          </Label>
        </g>

        {/* B: ketidakpastian: sebaran posisi vs momentum */}
        <g opacity={pB}>
          <Chalk d={`M${CX - 170},${FLOOR - 560} V${FLOOR - 300} H${CX + 170} V${FLOOR - 560}`} color={C.ink} width={6} />
          <WaveLine x0={CX - 170} x1={CX + 170} f={(u) => FLOOR - 300 - 200 * Math.exp(-(((u - 0.5) * 340) ** 2) / (2 * sx * sx))} color={C.blue} width={5} />
          <Label x={CX + 200} y={FLOOR - 470} size={46} color={C.blue} anchor="start">
            posisi
          </Label>
          <Arrow x1={CX - sx} y1={FLOOR - 270} x2={CX + sx} y2={FLOOR - 270} color="blue" width={3} both />
          <Label x={CX} y={FLOOR - 230} size={46} color={C.blue} font="serif" italic>
            Δx
          </Label>
          {/* momentum */}
          <Chalk d={`M${CX - 260},${FLOOR} H${CX + 260}`} color={C.muted} width={3} />
          <WaveLine x0={CX - 260} x1={CX + 260} f={(u) => FLOOR - (200 * 70 / sp) * Math.exp(-(((u - 0.5) * 520) ** 2) / (2 * sp * sp))} color={C.orange} width={5} />
          <Label x={CX + 280} y={FLOOR - 40} size={46} color={C.orange} anchor="start">
            momentum
          </Label>
          <Arrow x1={CX - sp} y1={FLOOR + 30} x2={CX + sp} y2={FLOOR + 30} color="orange" width={3} both />
          <Label x={CX} y={FLOOR + 70} size={46} color={C.orange} font="serif" italic>
            Δp
          </Label>
        </g>

        {/* C: partikel gelisah — kotak menyempit, partikel makin cepat, energi naik */}
        {(() => {
          const c = ramp(t, cue(8) + 0.2, cue(8) + 3.6, EASE_IN_OUT);
          const hw = mix(230, 95, c); // setengah lebar kotak
          const eLev = (230 / hw) ** 2 / 5.86; // energi ∝ 1/L², dinormalisasi 0..1
          const ph = (tt: number) => tt * 4.2 * (1 + 1.6 * c);
          const px = (tt: number) => CX + (hw - 22) * Math.sin(ph(tt) * 1.7 + 1.3 * Math.sin(ph(tt) * 0.6));
          const py = (tt: number) => FLOOR - 310 + 120 * Math.sin(ph(tt) * 1.31);
          const trail = Array.from({length: 8}, (_, i) => [px(t - i * 0.007), py(t - i * 0.007)] as [number, number]);
          return (
            <g opacity={pC}>
              <Halo x={CX} y={FLOOR - 310} r={hw + 200} color={c > 0.5 ? 'pink' : 'blue'} opacity={0.4 + 0.4 * c} />
              <Chalk d={`M${CX - hw},${FLOOR - 470} V${FLOOR - 150} H${CX + hw} V${FLOOR - 470}`} color={C.ink} width={8} />
              <Arrow x1={CX - hw - 100} y1={FLOOR - 310} x2={CX - hw - 18} y2={FLOOR - 310} color="pink" width={4} opacity={1 - c} />
              <Arrow x1={CX + hw + 100} y1={FLOOR - 310} x2={CX + hw + 18} y2={FLOOR - 310} color="pink" width={4} opacity={1 - c} />
              <Spark x={trail[0][0]} y={trail[0][1]} r={11} color={c > 0.5 ? C.pink : C.blue} trail={trail} />
              {/* meter energi pengurungan */}
              <g transform="translate(900 0)">
                <rect x={-22} y={FLOOR - 470} width={44} height={320} rx={22} fill="none" stroke={C.muted} strokeWidth={2} />
                <rect x={-16} y={FLOOR - 156 - 308 * Math.min(1, eLev)} width={32} height={308 * Math.min(1, eLev)} rx={16} fill={C.pink} opacity={0.8} />
                <Label x={0} y={FLOOR - 510} size={40} color={C.pink}>
                  energi
                </Label>
                <Label x={0} y={FLOOR - 100} size={36} color={C.muted} font="serif" italic>
                  ∝ 1/L²
                </Label>
              </g>
            </g>
          );
        })()}
        <g opacity={colors}>
          {[C.red, C.orange, C.yellow, C.green, C.blue, C.lilac].map((c, i) => (
            <rect key={i} x={1180 + i * 90 * ramp(colors, i * 0.12, i * 0.12 + 0.4)} y={600} width={80} height={140} rx={10} fill={c} opacity={0.75} />
          ))}
          <Label x={1405} y={790} size={46} color={C.ink}>
            warna molekul & titik kuantum
          </Label>
        </g>
      </Stage>

      <Formula x={1400} y={290} p={fL} accent={C.pink} caption="sempit sedikit, energi naik banyak">
        <V>E</V> ∝{' '}
        <Frac
          n="1"
          d={
            <>
              <V>L</V>
              <Sup>2</Sup>
            </>
          }
        />
      </Formula>
      <Note x={1400} y={520} text="L dibagi 2 → energi × 4" color={C.yellow} size={56} p={four} opacity={pA} />
      <Formula x={1400} y={290} p={fH} accent={C.orange} caption="prinsip ketidakpastian Heisenberg">
        <V>Δx</V> · <V>Δp</V> ≥ <Frac n={<Hbar />} d="2" />
      </Formula>
      <Formula x={1400} y={540} p={fBox * fH} accent={C.blue} caption="keadaan dasar kotak">
        <V>Δx</V> · <V>Δp</V> ≈ 1,14 × <Frac n={<Hbar />} d="2" />
      </Formula>
      <Note x={1400} y={330} text="kegelisahan = energi pengurungan" color={C.blue} size={58} p={pC} />
    </AbsoluteFill>
  );
};
