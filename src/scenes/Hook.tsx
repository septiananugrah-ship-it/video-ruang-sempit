import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Chalk, Dust, Halo, Label, Spark, Stage} from '../components/primitives';
import {Carrot, FlashDisk, TV, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

export const Hook: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const pObj = win(t, -1, cue(5) - 0.3, 0.5, 0.7);
  const carrot = ramp(t, 0.2, 1.8);
  const tv = ramp(t, cue(1) - 0.2, cue(1) + 1.4);
  const disk = ramp(t, cue(2) - 0.2, cue(2) + 1.4);
  const q = ramp(t, cue(3), cue(3) + 0.8, BACK);
  const boxes = ramp(t, cue(4), cue(4) + 1.2);
  const pBox = win(t, cue(5) - 0.4, cue(7) - 0.4, 0.7, 0.6);
  const shrink = ramp(t, cue(5) + 0.3, cue(5) + 4.5, EASE_IN_OUT);
  const ic1 = ramp(t, wordOf(6, 'Energinya') - 0.2, wordOf(6, 'Energinya') + 0.8);
  const ic2 = ramp(t, wordOf(6, 'warnanya') - 0.2, wordOf(6, 'warnanya') + 0.8);
  const ic3 = ramp(t, wordOf(6, 'menembus') - 0.2, wordOf(6, 'menembus') + 0.8);
  const ques = ramp(t, cue(7) + 0.2, cue(7) + 2.4);
  const end = 1 - ramp(t, dur - 0.6, dur);

  const W2 = mix(560, 200, shrink); // setengah lebar kotak
  const CX = 960;
  const CY = 470;
  // bola memantul → gelombang berdiri
  const ballX = CX + (W2 - 30) * Math.sin(t * (2.2 + 4 * shrink));
  const wave = ramp(shrink, 0.45, 1);

  return (
    <AbsoluteFill>
      <Stage>
        {/* tiga benda */}
        <g opacity={pObj}>
          <Halo x={420} y={430} r={260 * carrot} color="orange" opacity={0.9} />
          <Halo x={960} y={430} r={300 * tv} color="lilac" opacity={0.9} />
          <Halo x={1500} y={440} r={260 * disk} color="blue" opacity={0.9} />
          {/* benang tipis yang menghubungkan ketiganya: "satu rahasia" */}
          <Chalk d="M520,560 C700,640 820,640 960,600 C1100,640 1220,640 1400,560" p={boxes} color={C.lilac} width={2.4} dash="2 10" />
          <Carrot x={420} y={430} s={1.05} p={carrot} />
          <TV x={960} y={430} s={1.0} p={tv} glow={0.5 + 0.5 * Math.sin(t * 2)} />
          <FlashDisk x={1500} y={440} s={1.05} p={disk} />
          <g opacity={q * (1 - boxes)}>
            <Label x={690} y={430} size={90} color={C.muted}>
              ?
            </Label>
            <Label x={1230} y={430} size={90} color={C.muted}>
              ?
            </Label>
          </g>
          {/* kotak kecil berisi elektron di bawah tiap benda */}
          {[420, 960, 1500].map((x, i) => {
            const p = ramp(boxes, i * 0.2, i * 0.2 + 0.6);
            const ph = t * (5 + i) + i;
            const ex = x + 52 * Math.sin(ph);
            const trail = Array.from({length: 6}, (_, k) => [x + 52 * Math.sin(ph - k * 0.09), 745] as [number, number]);
            return (
              <g key={i} opacity={p}>
                <Halo x={x} y={740} r={110} color="yellow" opacity={0.6 * p} />
                <Chalk d={`M${x - 70},${700} V${770} H${x + 70} V${700}`} p={p} color={C.yellow} width={4} />
                <Spark x={ex} y={745} r={8} color={C.blue} trail={trail} />
                <Chalk d={`M${x},${640} L${x},${688}`} p={p} color={C.muted} width={3} dash="5 7" />
              </g>
            );
          })}
          <Label x={960} y={830} size={44} color={C.yellow} p={ramp(t, wordOf(4, 'ruang') - 0.2, wordOf(4, 'sempit') + 0.5)}>
            elektron di ruang yang sangat sempit
          </Label>
        </g>

        {/* kotak yang menyempit: bola → gelombang */}
        <g opacity={pBox}>
          <Dust x={CX} y={CY} r={420} opacity={0.6} />
          <Chalk d={`M${CX - W2},${CY - 200} V${CY + 120} H${CX + W2} V${CY - 200}`} color={C.ink} width={6} />
          <g opacity={1 - wave}>
            <Spark
              x={ballX}
              y={CY + 92}
              r={18}
              color={C.blue}
              trail={Array.from({length: 8}, (_, k) => [CX + (W2 - 30) * Math.sin((t - k * 0.025) * (2.2 + 4 * shrink)), CY + 92] as [number, number])}
            />
          </g>
          <g opacity={wave}>
            <WaveLine x0={CX - W2} x1={CX + W2} f={(u) => CY - 10 - 110 * Math.sin(Math.PI * u) * Math.cos(t * 3)} color={C.blue} width={6} />
            <WaveLine x0={CX - W2} x1={CX + W2} f={(u) => CY - 10 - 110 * Math.sin(Math.PI * u)} color={C.blue} width={2.5} dash="4 9" opacity={0.6} />
          </g>
          <Label x={CX} y={CY + 170} size={40} color={C.muted}>
            {shrink < 0.5 ? 'bola biasa' : 'seukuran molekul: gelombang'}
          </Label>
          {/* tiga keanehan */}
          <g opacity={ic1}>
            <Chalk d="M330,330 H450 M330,270 H450 M330,190 H450" color={C.yellow} width={5} />
            <Label x={390} y={390} size={36} color={C.yellow}>
              energi bertingkat
            </Label>
          </g>
          <g opacity={ic2}>
            {[C.red, C.orange, C.yellow, C.green, C.blue, C.lilac].map((c, i) => (
              <rect key={i} x={1430 + i * 24} y={190} width={20} height={140} fill={c} opacity={0.7} rx={3} />
            ))}
            <Label x={1500} y={390} size={36} color={C.pink}>
              warna dari ukuran
            </Label>
          </g>
          <g opacity={ic3}>
            <Chalk d={`M${CX + W2 + 40},${CY - 200} V${CY + 120}`} color={C.ink} width={8} />
            <WaveLine x0={CX + W2 + 40} x1={CX + W2 + 180} f={(u) => CY - 10 - 30 * Math.exp(-u * 2) * Math.sin(u * 14 - t * 4)} color={C.green} width={4} />
            <Label x={CX + W2 + 120} y={CY + 60} size={36} color={C.green}>
              menembus
            </Label>
          </g>
        </g>

        {/* pertanyaan */}
        <g opacity={end}>
          <Dust x={960} y={470} r={620} opacity={ques * 0.8} />
          <Chalk d="M610,610 C800,600 1100,622 1310,606" p={ramp(t, cue(8) + 2.4, cue(8) + 3.4)} color={C.yellow} width={3} />
        </g>
      </Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: end, pointerEvents: 'none'}}>
        <div style={{fontFamily: FONT.sans, fontSize: 22, letterSpacing: 9, fontWeight: 600, color: C.green, textTransform: 'uppercase', opacity: ques}}>satu pertanyaan sederhana</div>
        <div style={{fontFamily: FONT.display, fontSize: 104, lineHeight: 1.08, color: C.ink, marginTop: 18, opacity: ques, filter: `blur(${(1 - ques) * 6}px)`, translate: `0px ${(1 - ques) * 16}px`}}>
          Bagaimana partikel bergerak lurus
        </div>
        {(() => {
          const q2 = ramp(t, cue(8) + 0.4, cue(8) + 2.4);
          return (
            <div style={{fontFamily: FONT.display, fontStyle: 'italic', fontSize: 104, lineHeight: 1.08, color: C.yellow, opacity: q2, filter: `blur(${(1 - q2) * 6}px)`, translate: `0px ${(1 - q2) * 16}px`}}>
              menurut mekanika kuantum?
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};
