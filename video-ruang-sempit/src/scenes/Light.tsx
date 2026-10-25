import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, nmColor, ramp, win} from '../anim';
import {Arrow, Chalk, Formula, Frac, Halo, Label, Note, Ripple, Spark, Stage, Sub, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const X0 = 200;
const X1 = 760;
const FLOOR = 820;
const U = 34;
const yN = (n: number) => FLOOR - n * n * U - 40;

export const Light: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pA = win(t, -1, cue(8) - 0.4, 0.5, 0.6);
  const box = ramp(t, 0.2, 1.2);
  const photon = ramp(t, wordOf(0, 'foton') - 1.2, wordOf(0, 'foton') + 0.3, EASE_IN_OUT);
  const jump = ramp(t, wordOf(0, 'foton') + 0.2, wordOf(0, 'foton') + 0.9, BACK);
  const dE = ramp(t, cue(1), cue(1) + 0.7);
  const f1 = win(t, cue(1) - 0.1, cue(3) - 0.3, 0.7, 0.5);
  const f2 = win(t, cue(2) - 0.1, cue(3) - 0.3, 0.7, 0.5);
  const f3 = win(t, cue(3) - 0.1, cue(5) - 0.3, 0.7, 0.5);
  const spec = win(t, cue(4) - 0.2, cue(5) - 0.2, 0.7, 0.6);
  const rules = ramp(t, cue(5) - 0.1, cue(5) + 0.6);
  const ok = ramp(t, wordOf(7, 'diizinkan') - 0.3, wordOf(7, 'diizinkan') + 0.5, BACK);
  const no = ramp(t, wordOf(7, 'terlarang') - 0.3, wordOf(7, 'terlarang') + 0.5, BACK);
  const pSym = ramp(t, cue(8) - 0.2, cue(8) + 0.8);
  const fin = ramp(t, cue(9) - 0.1, cue(9) + 0.8, BACK);

  const dotY = mix(yN(1), yN(2), t > cue(5) - 0.3 ? 0 : jump);
  const EX = (X0 + X1) / 2 - 80;
  const phX = mix(1500, EX, photon);
  const absorb = ramp(t, wordOf(0, 'foton') + 0.2, wordOf(0, 'foton') + 1.6);
  const table = ramp(t, cue(6) - 0.1, cue(6) + 0.8);

  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={pA}>
          <Chalk d={`M${X0},${yN(4) - 60} V${FLOOR} H${X1} V${yN(4) - 60}`} p={box} color={C.ink} width={7} />
          {[1, 2, 3, 4].map((n) => (
            <g key={n} opacity={box}>
              <Chalk d={`M${X0 + 20},${yN(n)} H${X1 - 20}`} color={[C.blue, C.green, C.pink, C.orange][n - 1]} width={5} />
              <Label x={X0 - 24} y={yN(n)} size={42} font="serif" italic color={[C.blue, C.green, C.pink, C.orange][n - 1]} anchor="end">
                {`${n}`}
              </Label>
            </g>
          ))}
          {/* foton masuk: paket gelombang bercahaya */}
          {photon > 0.001 && photon < 0.999 ? (
            <g>
              <WaveLine x0={phX} x1={phX + 300} n={120} f={(u) => yN(1) - 16 - 26 * Math.exp(-(((u - 0.18) * 4) ** 2)) * Math.sin(u * 14 * Math.PI - t * 18)} color={C.yellow} width={4} />
              <Spark x={phX + 30} y={yN(1) - 16} r={8} color={C.yellow} />
              <Label x={phX + 110} y={yN(1) - 90} size={42} color={C.yellow}>
                foton
              </Label>
            </g>
          ) : null}
          <Ripple x={EX} y={dotY - 16} q={absorb} r={150} color={C.yellow} />
          <Halo x={EX} y={dotY - 16} r={120} color="yellow" opacity={(1 - rules) * Math.sin(Math.PI * absorb) * 1.2} />
          <Spark x={EX} y={dotY - 16} r={13} color={C.blue} opacity={1 - rules} trail={jump > 0.02 && jump < 0.98 ? Array.from({length: 7}, (_, k) => [EX, dotY - 16 + k * 14] as [number, number]) : undefined} />
          {/* ΔE */}
          <g opacity={dE * (1 - rules)}>
            <Arrow x1={X1 + 40} y1={yN(1)} x2={X1 + 40} y2={yN(2) + 4} color="yellow" width={4} both />
            <Label x={X1 + 60} y={(yN(1) + yN(2)) / 2} size={46} color={C.yellow} anchor="start" font="serif" italic>
              ΔE
            </Label>
          </g>
          {/* aturan seleksi */}
          <g opacity={rules}>
            <Arrow x1={X0 + 140} y1={yN(1) - 6} x2={X0 + 140} y2={yN(2) + 8} color="green" width={5} p={ok} />
            <Label x={X0 + 140} y={yN(2) - 42} size={46} color={C.green} opacity={ok}>
              1 → 2 ✓
            </Label>
            <Arrow x1={X0 + 380} y1={yN(1) - 6} x2={X0 + 380} y2={yN(3) + 8} color="red" width={5} dash="12 10" p={no} />
            <Label x={X0 + 380} y={yN(3) - 42} size={46} color={C.red} opacity={no}>
              1 → 3 ✗
            </Label>
          </g>
        </g>

        {/* spektrum: tampak & inframerah (skala 380–1300 nm) */}
        {(() => {
          const xl = (nm: number) => 1000 + ((nm - 380) / 920) * 780;
          return (
            <g opacity={spec}>
              {Array.from({length: 61}, (_, i) => {
                const nm = 400 + i * 5;
                return <rect key={i} x={xl(nm)} y={630} width={xl(405) - xl(400) + 0.6} height={74} fill={nmColor(nm)} opacity={0.85} />;
              })}
              <rect x={xl(700)} y={630} width={xl(1300) - xl(700)} height={74} fill="url(#hatch)" opacity={0.6} />
              <rect x={xl(700)} y={630} width={xl(1300) - xl(700)} height={74} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" />
              {[400, 700, 1000, 1300].map((nm) => (
                <Label key={nm} x={xl(nm)} y={740} size={30} color={C.muted} font="mono">
                  {`${nm}`}
                </Label>
              ))}
              <Label x={xl(550)} y={600} size={38} color={C.ink}>
                tampak
              </Label>
              <Label x={xl(1235)} y={600} size={38} color={C.muted}>
                inframerah
              </Label>
              <Halo x={xl(1100)} y={667} r={90} color="red" opacity={0.9} />
              <Chalk d={`M${xl(1100)},540 V${625}`} color={C.yellow} width={4} />
              <circle cx={xl(1100)} cy={667} r={10} fill="none" stroke={C.yellow} strokeWidth={3} />
              <Label x={xl(1100)} y={510} size={46} color={C.yellow}>
                ≈ 1100 nm
              </Label>
            </g>
          );
        })()}

        {/* simetri fungsi gelombang */}
        <g opacity={pSym}>
          {[1, 2, 3].map((n, i) => {
            const x0 = 160 + i * 560;
            const x1 = x0 + 440;
            const sym = n % 2 === 1;
            const col = [C.blue, C.green, C.pink][i];
            const p = ramp(t, cue(8) + i * 0.6, cue(8) + 0.8 + i * 0.6);
            return (
              <g key={n} opacity={p}>
                <Chalk d={`M${x0},360 V680 M${x1},360 V680`} color={C.ink} width={6} />
                <Chalk d={`M${(x0 + x1) / 2},340 V700`} color={C.muted} width={3} dash="8 10" />
                <Chalk d={`M${x0},520 H${x1}`} color={C.faint} width={2.4} />
                <WaveLine x0={x0} x1={x1} f={(u) => 520 - 120 * Math.sin(n * Math.PI * u)} color={col} width={5} />
                <Label x={(x0 + x1) / 2} y={300} size={48} font="serif" italic color={col}>
                  {`n = ${n}`}
                </Label>
                <Label x={(x0 + x1) / 2} y={740} size={46} color={sym ? C.blue : C.orange}>
                  {sym ? 'simetris' : 'antisimetris'}
                </Label>
              </g>
            );
          })}
        </g>
      </Stage>

      <Formula x={1380} y={260} p={f1} accent={C.yellow} caption="energi foton = selisih tingkat">
        <V>h</V>
        <V>ν</V> = Δ<V>E</V> = <V>E</V>
        <Sub>2</Sub> − <V>E</V>
        <Sub>1</Sub>
      </Formula>
      <Formula x={1380} y={470} p={f2} accent={C.yellow} caption="panjang gelombang yang diserap">
        <V>λ</V> = <Frac n={<V>hc</V>} d={<>Δ<V>E</V></>} />
      </Formula>
      <Formula x={1380} y={300} p={f3} accent={C.blue} caption="elektron, kotak 1 nm, lompatan 1 → 2">
        Δ<V>E</V> = 3<V>E</V>
        <Sub>1</Sub> ≈ 1,13 eV
      </Formula>
      {table > 0.001 && pSym < 0.999 ? (
        <div style={{position: 'absolute', left: 1080, top: 400, width: 520, opacity: table * (1 - pSym), fontFamily: FONT.sans, fontSize: 34, color: C.ink}}>
          {[
            ['1 → 2', '1 + 2 = 3', true],
            ['1 → 3', '1 + 3 = 4', false],
            ['2 → 3', '2 + 3 = 5', true],
            ['1 → 4', '1 + 4 = 5', true],
          ].map(([a, b, ok2], i) => {
            const q = ramp(t, cue(6) + 0.2 + i * 0.35, cue(6) + 0.8 + i * 0.35);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '12px 22px', marginBottom: 10, borderRadius: 14, background: 'rgba(16,18,52,0.7)', border: `1px solid ${ok2 ? C.green : C.red}55`, opacity: q, translate: `${(1 - q) * 20}px 0px`}}>
                <span style={{fontFamily: FONT.serif, fontStyle: 'italic', width: 110}}>{a as string}</span>
                <span style={{color: C.muted, flex: 1}}>{b as string}</span>
                <span style={{color: ok2 ? C.green : C.red, fontWeight: 600}}>{ok2 ? 'ganjil ✓' : 'genap ✗'}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <Note x={1320} y={300} text="diizinkan bila n awal + n akhir ganjil" color={C.green} size={48} p={ramp(t, wordOf(6, 'ganjil') - 0.4, wordOf(6, 'ganjil') + 0.4)} opacity={1 - pSym} />
      <Note x={1380} y={170} text="contoh pertama aturan seleksi" color={C.yellow} size={58} p={fin} />
    </AbsoluteFill>
  );
};
