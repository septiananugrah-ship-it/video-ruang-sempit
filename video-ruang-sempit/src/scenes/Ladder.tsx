import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Arrow, Chalk, Formula, Frac, Halo, Label, Note, Spark, Stage, Sub, Sup, V} from '../components/primitives';
import {Marble, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const X0 = 220;
const X1 = 820;
const FLOOR = 830;
const U = 34; // px per E1

const Row: React.FC<{p: number; children: React.ReactNode; note?: string}> = ({p, children, note}) => (
  <div style={{opacity: p, translate: `${(1 - p) * 24}px 0px`, marginBottom: 10, whiteSpace: 'nowrap'}}>
    <span style={{fontFamily: FONT.serif, fontSize: 56, color: C.ink}}>{children}</span>
    {note ? <span style={{fontFamily: FONT.hand, fontSize: 36, color: C.muted, marginLeft: 22}}>{note}</span> : null}
  </div>
);

export const Ladder: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pDer = win(t, 0.2, cue(1) - 0.3, 0.6, 0.5);
  const r1 = ramp(t, 0.2, 0.9);
  const r2 = ramp(t, wordOf(0, 'momentumnya') - 0.3, wordOf(0, 'momentumnya') + 0.5);
  const r3 = ramp(t, wordOf(0, 'energinya') - 0.3, wordOf(0, 'energinya') + 0.5);
  const fE = win(t, cue(1) - 0.1, cue(7) - 0.4, 0.7, 0.5);
  const box = ramp(t, cue(1) + 0.4, cue(1) + 1.4);
  const lv = (n: number) => ramp(t, cue(1) + 2.0 + (n - 1) * 0.6, cue(1) + 2.7 + (n - 1) * 0.6, BACK);
  const gaps = ramp(t, wordOf(2, 'lebar') - 0.2, wordOf(2, 'lebar') + 0.6);
  const zero = win(t, cue(3) - 0.1, cue(5) + 0.2, 0.6, 0.6);
  const zpe = ramp(t, cue(5) - 0.1, cue(5) + 0.8);
  const pBox = 1 - ramp(t, cue(7) - 0.5, cue(7) + 0.1);
  const pEl = ramp(t, cue(7) - 0.2, cue(7) + 0.6);
  const pMar = ramp(t, cue(8) - 0.2, cue(8) + 0.8);
  const last = ramp(t, cue(9) - 0.1, cue(9) + 0.8);
  const yN = (n: number) => FLOOR - n * n * U;

  return (
    <AbsoluteFill>
      <Stage>
        {/* kotak dengan gelombang n = 3 selama penurunan */}
        <g opacity={pDer}>
          <Chalk d={`M${X0},${360} V${700} H${X1} V${360}`} color={C.ink} width={7} />
          <WaveLine x0={X0} x1={X1} f={(u) => 560 - 110 * Math.sin(3 * Math.PI * u) * Math.cos(t * 3)} color={C.green} width={5} />
          {[0, 1, 2].map((k) => (
            <Label key={k} x={X0 + (k + 0.5) * 200} y={740} size={40} font="serif" italic color={C.yellow}>
              λ/2
            </Label>
          ))}
          <Label x={(X0 + X1) / 2} y={300} size={46} color={C.green}>
            n = 3
          </Label>
        </g>
        <g opacity={pBox}>
          <Chalk d={`M${X0},${yN(4) - 80} V${FLOOR} H${X1} V${yN(4) - 80}`} p={box} color={C.ink} width={7} />
          <Arrow x1={X0 - 70} y1={FLOOR} x2={X0 - 70} y2={yN(4) - 90} color="muted" width={3} p={box} />
          <Label x={X0 - 70} y={yN(4) - 120} size={44} font="serif" italic color={C.muted} p={box}>
            E
          </Label>
          {[1, 2, 3, 4].map((n) => {
            const p = lv(n);
            const col = [C.blue, C.green, C.pink, C.orange][n - 1];
            const y = yN(n);
            return (
              <g key={n} opacity={p}>
                <Chalk d={`M${X0 + 20},${y} H${X1 - 20}`} color={col} width={5} p={p} />
                <WaveLine x0={X0 + 20} x1={X1 - 20} f={(u) => y - 26 * Math.sin(n * Math.PI * u) * Math.cos(t * (2 + n))} color={col} width={2.5} opacity={0.6} />
                <Label x={X1 + 30} y={y} size={44} font="serif" italic color={col} anchor="start">
                  {`n = ${n}`}
                </Label>
                <Label x={X1 + 190} y={y} size={44} color={C.ink} anchor="start">
                  {`${n * n} E₁`}
                </Label>
              </g>
            );
          })}
          <g opacity={gaps}>
            {[1, 2, 3].map((n) => (
              <g key={n}>
                <Arrow x1={X0 - 24} y1={yN(n) - 4} x2={X0 - 24} y2={yN(n + 1) + 6} color="yellow" width={3} both />
                <Label x={X0 - 34} y={(yN(n) + yN(n + 1)) / 2} size={40} color={C.yellow} anchor="end">
                  {`${2 * n + 1}`}
                </Label>
              </g>
            ))}
          </g>
          {/* n = 0 dilarang */}
          <g opacity={zero}>
            <Chalk d={`M${X0 + 20},${FLOOR - 8} H${X1 - 20}`} color={C.red} width={4} dash="12 10" />
            <Label x={(X0 + X1) / 2} y={FLOOR + 46} size={44} color={C.red}>
              n = 0 → ψ = 0 di mana-mana ✗
            </Label>
          </g>
          {/* energi titik nol */}
          <g opacity={zpe}>
            <Arrow x1={X1 - 50} y1={FLOOR} x2={X1 - 50} y2={yN(1) + 4} color="blue" width={3} both />
            <Label x={X1 - 70} y={yN(1) - 48} size={42} color={C.blue} anchor="end">
              E₁ &gt; 0
            </Label>
          </g>
        </g>

        {/* perbandingan berdampingan: elektron vs kelereng */}
        {(() => {
          const EF = 790; // lantai kotak
          const yE = (n: number) => EF - n * n * 33;
          const ex = 500 + 150 * Math.sin(t * 6.5);
          return (
            <g>
              <g opacity={pEl}>
                <Halo x={500} y={620} r={330} color="blue" opacity={0.6} />
                <Label x={500} y={250} size={48} color={C.blue}>
                  elektron · kotak 1 nm
                </Label>
                <Chalk d={`M320,${EF - 340} V${EF} H680 V${EF - 340}`} color={C.ink} width={6} />
                {[1, 2, 3].map((n) => {
                  const col = [C.blue, C.green, C.pink][n - 1];
                  const q = ramp(t, cue(7) + 0.3 + n * 0.35, cue(7) + 0.9 + n * 0.35, BACK);
                  return (
                    <g key={n} opacity={q}>
                      <Chalk d={`M335,${yE(n)} H665`} color={col} width={4} />
                      <Label x={700} y={yE(n)} size={38} font="serif" italic color={col} anchor="start">
                        {`n = ${n}`}
                      </Label>
                    </g>
                  );
                })}
                <WaveLine x0={335} x1={665} f={(u) => yE(1) - 30 * Math.sin(Math.PI * u) * Math.cos(t * 3)} color={C.blue} width={2.5} opacity={0.7} />
                <Spark x={ex} y={yE(1) - 4} r={9} color={C.blue} />
                <Arrow x1={260} y1={yE(1)} x2={260} y2={yE(2)} color="yellow" width={3} both opacity={ramp(t, cue(7) + 1.6, cue(7) + 2.4)} />
                <Label x={240} y={(yE(1) + yE(2)) / 2} size={36} color={C.yellow} anchor="end" opacity={ramp(t, cue(7) + 1.6, cue(7) + 2.4)}>
                  lebar
                </Label>
                <Arrow x1={320} y1={EF + 40} x2={680} y2={EF + 40} color="muted" width={3} both />
                <Label x={500} y={EF + 78} size={40} color={C.muted}>
                  L = 1 nm
                </Label>
              </g>
              <g opacity={pMar}>
                <Halo x={1420} y={620} r={330} color="lilac" opacity={0.5} />
                <Label x={1420} y={250} size={48} color={C.lilac}>
                  kelereng 1 g · kotak 1 cm
                </Label>
                <Chalk d={`M1240,${EF - 340} V${EF} H1600 V${EF - 340}`} color={C.ink} width={6} />
                {Array.from({length: 60}, (_, i) => (
                  <line key={i} x1={1255} y1={EF - 6 - i * 5} x2={1585} y2={EF - 6 - i * 5} stroke={C.lilac} strokeWidth={1.3} opacity={0.55 * ramp(t, cue(8) + 0.5 + i * 0.02, cue(8) + 0.9 + i * 0.02)} />
                ))}
                <Marble x={1420 + 130 * Math.sin(t * 1.3)} y={EF - 36} r={30} />
                <Label x={1420} y={EF + 60} size={40} color={C.muted}>
                  tingkat sangat rapat → tampak kontinu
                </Label>
              </g>
            </g>
          );
        })()}
      </Stage>

      <div style={{position: 'absolute', left: 1040, top: 210, opacity: pDer}}>
        <Row p={r1} note="dari L = nλ/2">
          <V>λ</V> = <Frac n={<>2<V>L</V></>} d={<V>n</V>} />
        </Row>
        <Row p={r2} note="de Broglie">
          <V>p</V> = <Frac n={<V>h</V>} d={<V>λ</V>} /> = <Frac n={<><V>nh</V></>} d={<>2<V>L</V></>} />
        </Row>
        <Row p={r3} note="energi kinetik">
          <V>E</V> = <Frac n={<><V>p</V><Sup>2</Sup></>} d={<>2<V>m</V></>} />
        </Row>
      </div>
      <Formula x={1450} y={270} p={fE} accent={C.yellow} size={66} caption="tingkat energi partikel dalam kotak">
        <V>E</V>
        <Sub>
          <V>n</V>
        </Sub>{' '}
        ={' '}
        <Frac
          n={
            <>
              <V>n</V>
              <Sup>2</Sup>
              <V>h</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              8<V>mL</V>
              <Sup>2</Sup>
            </>
          }
        />
      </Formula>
      <Note x={1450} y={540} text="inilah energi titik nol" color={C.blue} size={50} p={ramp(t, cue(6) - 0.1, cue(6) + 0.7)} opacity={1 - ramp(t, cue(7) - 0.5, cue(7))} />
      <Formula x={500} y={350} p={pEl} accent={C.blue} size={52} caption="energi terendah">
        <V>E</V>
        <Sub>1</Sub> ≈ 0,38 eV
      </Formula>
      <Formula x={1420} y={350} p={pMar} accent={C.lilac} size={52} caption="energi terendah">
        <V>E</V>
        <Sub>1</Sub> ≈ 5 × 10
        <Sup>−61</Sup> J
      </Formula>
      <Note x={1280} y={170} text="massa kecil + ruang sempit = sifat kuantum terlihat" color={C.yellow} size={50} p={last} />
    </AbsoluteFill>
  );
};
