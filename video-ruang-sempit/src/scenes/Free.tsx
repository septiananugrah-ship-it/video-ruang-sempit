import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, mix, ramp, win} from '../anim';
import {Arrow, Chalk, Formula, Frac, Halo, Hbar, Label, Note, Spark, Stage, Sup, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const X0 = 180;
const X1 = 1740;
const AY = 600;

export const Free: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const axis = ramp(t, 0.2, 1.4);
  const dotP = win(t, 0.4, cue(2) + 0.6, 0.5, 0.8);
  const vline = ramp(t, wordOf(1, 'potensialnya') - 0.3, wordOf(1, 'potensialnya') + 0.9);
  const fDB = win(t, cue(2) - 0.1, cue(3) - 0.3, 0.7, 0.5);
  const wave = ramp(t, cue(2) + 1.0, cue(2) + 2.4);
  const fPW = win(t, cue(3) - 0.1, cue(4) - 0.3, 0.7, 0.5);
  const fE = win(t, cue(4) - 0.1, cue(7) - 0.3, 0.7, 0.5);
  const anyK = ramp(t, cue(5), cue(5) + 0.6);
  const prob = win(t, cue(6) - 0.2, cue(7) - 0.2, 0.7, 0.5);
  const pE = ramp(t, cue(7) - 0.2, cue(7) + 1.2);
  const walls = ramp(t, cue(8) + 0.4, cue(8) + 1.4, BACK);
  const pMain = 1 - ramp(t, cue(7) - 0.4, cue(7) + 0.2);

  // k berubah halus saat "k boleh bernilai berapa saja"
  const k = 0.022 + (anyK > 0 ? 0.012 * Math.sin((t - cue(5)) * 1.3) * anyK : 0);
  const dotX = mix(X0 + 40, X1 - 40, ((t * 0.18) % 1));

  return (
    <AbsoluteFill>
      <Stage>
        {/* tiga jenis gerak: translasi disorot */}
        <g opacity={win(t, 0.3, cue(1) - 0.2, 0.6, 0.6)}>
          {(() => {
            const sl = ((t * 60) % 160) - 80;
            return (
              <g>
                <rect x={330 + sl} y={300} width={90} height={70} rx={6} fill="url(#hatch)" stroke={C.yellow} strokeWidth={4} />
                <Arrow x1={440 + sl} y1={335} x2={500 + sl} y2={335} color="yellow" width={4} />
                <Label x={410} y={420} size={46} color={C.yellow}>
                  translasi
                </Label>
                <g transform={`translate(960 335) rotate(${t * 90})`}>
                  <rect x={-40} y={-30} width={80} height={60} rx={6} fill="none" stroke={C.muted} strokeWidth={4} />
                </g>
                <Label x={960} y={420} size={44} color={C.muted}>
                  rotasi (Modul 5)
                </Label>
                <path d={`M1400,335 ${Array.from({length: 8}, (_, i) => `l12,${i % 2 ? 24 : -24}`).join(' ')}`} transform={`translate(${8 * Math.sin(t * 6)} 0)`} fill="none" stroke={C.muted} strokeWidth={4} />
                <Label x={1450} y={420} size={44} color={C.muted}>
                  vibrasi (Modul 4)
                </Label>
              </g>
            );
          })()}
        </g>
        <g opacity={pMain}>
          {/* sumbu x */}
          <Arrow x1={X0 - 40} y1={AY + 120} x2={X1 + 60} y2={AY + 120} color="muted" width={4} p={axis} />
          <Label x={X1 + 70} y={AY + 160} size={44} color={C.muted} font="serif" italic>
            x
          </Label>
          {/* titik bergerak */}
          <g opacity={dotP * (1 - wave)}>
            <Halo x={dotX} y={AY + 90} r={160} color="blue" opacity={0.7} />
            <Spark
              x={dotX}
              y={AY + 90}
              r={14}
              color={C.blue}
              trail={Array.from({length: 10}, (_, j) => [mix(X0 + 40, X1 - 40, Math.max(0, ((t - j * 0.03) * 0.18) % 1)), AY + 90] as [number, number]).filter((q) => q[0] <= dotX + 1)}
            />
            <Arrow x1={dotX + 30} y1={AY + 90} x2={dotX + 110} y2={AY + 90} color="blue" width={4} />
          </g>
          <Label x={960} y={AY - 90} size={50} color={C.yellow} p={ramp(t, wordOf(0, 'berpindah') - 0.2, wordOf(0, 'tempat') + 0.4)} opacity={1 - ramp(t, cue(2) - 0.4, cue(2) + 0.2)}>
            translasi = berpindah tempat
          </Label>
          {/* V = 0 */}
          <Chalk d={`M${X0},${AY + 120} H${X1}`} p={vline} color={C.green} width={6} />
          <Label x={X0 + 60} y={AY + 165} size={44} color={C.green} p={vline} anchor="start">
            V(x) = 0 di mana-mana
          </Label>
          {/* gelombang bidang merambat */}
          <g opacity={wave * (1 - prob)}>
            <WaveLine x0={X0} x1={X1} n={260} f={(u) => AY - 20 - 80 * Math.cos(k * (X0 + u * (X1 - X0)) - t * 3.2)} color={C.blue} width={5} />
            <Arrow x1={X1 - 220} y1={AY - 160} x2={X1 - 60} y2={AY - 160} color="blue" width={4} />
            <Label x={X1 - 140} y={AY - 200} size={40} color={C.blue}>
              merambat
            </Label>
          </g>

          {/* rapat peluang merata */}
          <g opacity={prob}>
            <rect x={X0} y={AY - 20} width={(X1 - X0) * ramp(t, cue(6), cue(6) + 1.2)} height={130} fill={C.blue} opacity={0.18} />
            <Chalk d={`M${X0},${AY - 20} H${X1}`} p={ramp(t, cue(6), cue(6) + 1.2)} color={C.blue} width={5} />
            <Label x={960} y={AY - 80} size={50} color={C.blue}>
              |ψ|² sama di mana pun
            </Label>
          </g>
        </g>

        {/* energi kontinu: parabola E(k) + landai vs tangga */}
        <g opacity={pE * (1 - walls)}>
          <Arrow x1={300} y1={760} x2={300} y2={300} color="muted" width={4} p={pE} />
          <Arrow x1={120} y1={720} x2={500} y2={720} color="muted" width={4} p={pE} />
          <WaveLine x0={130} x1={470} f={(u) => 720 - 380 * ((u - 0.5) * 2) ** 2} color={C.yellow} width={5} p={ramp(t, cue(7), cue(7) + 1.4)} />
          <Label x={318} y={290} size={44} font="serif" italic color={C.ink} anchor="start">
            E
          </Label>
          <Label x={510} y={750} size={44} font="serif" italic color={C.ink} anchor="start">
            k
          </Label>
          <Label x={300} y={810} size={40} color={C.yellow}>
            setiap k boleh → E kontinu
          </Label>
          {/* jalan landai vs tangga */}
          <Chalk d="M800,760 L1220,420" p={ramp(t, cue(7) + 0.8, cue(7) + 1.8)} color={C.green} width={7} />
          <Label x={1010} y={810} size={44} color={C.green}>
            partikel bebas: landai
          </Label>
          <Chalk d="M1340,760 H1420 V660 H1500 V560 H1580 V460 H1660" p={ramp(t, wordOf(7, 'tangga') - 0.3, wordOf(7, 'tangga') + 0.9)} color={C.muted} width={6} />
          <Label x={1500} y={810} size={44} color={C.muted}>
            belum ada anak tangga
          </Label>
        </g>
        {/* dinding datang */}
        <g opacity={walls}>
          <Chalk d={`M${mix(-40, 520, walls)},260 V760`} color={C.ink} width={10} />
          <Chalk d={`M${mix(1960, 1400, walls)},260 V760`} color={C.ink} width={10} />
          <WaveLine x0={mix(-40, 520, walls)} x1={mix(1960, 1400, walls)} f={(u) => 520 - 120 * Math.sin(Math.PI * u) * Math.cos(t * 3)} color={C.blue} width={5} />
          <Label x={960} y={830} size={56} color={C.yellow}>
            dikurung → terkuantisasi
          </Label>
        </g>
      </Stage>
      <Note x={960} y={AY - 190} text="k boleh berapa saja → panjang gelombang bebas" color={C.pink} size={46} p={anyK} opacity={anyK * (1 - prob) * pMain} />

      <Formula x={1340} y={260} p={win(t, cue(1) + 0.6, cue(2) - 0.3, 0.7, 0.5)} accent={C.green} size={56} caption="persamaan Schrödinger dengan V = 0">
        −<Frac n={<><Hbar /><Sup>2</Sup></>} d={<>2<V>m</V></>} />
        <Frac n={<>d<Sup>2</Sup><V>ψ</V></>} d={<>d<V>x</V><Sup>2</Sup></>} /> = <V>E</V> <V>ψ</V>
      </Formula>
      <Formula x={1340} y={250} p={fDB} accent={C.yellow} caption="panjang gelombang de Broglie">
        <V>λ</V> = <Frac n={<V>h</V>} d={<V>p</V>} />
      </Formula>
      <Formula x={1340} y={250} p={fPW} accent={C.blue} caption="gelombang bidang (partikel bebas)">
        <V>ψ</V>(<V>x</V>) = <V>A</V> <V>e</V>
        <Sup>
          <V>ikx</V>
        </Sup>
      </Formula>
      <Formula x={1340} y={250} p={fE} accent={C.green} caption="momentum & energi partikel bebas">
        <V>p</V> = <Hbar />
        <V>k</V>
        <span style={{margin: '0 0.6em', color: C.muted}}>·</span>
        <V>E</V> ={' '}
        <Frac
          n={
            <>
              <Hbar />
              <Sup>2</Sup>
              <V>k</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              2<V>m</V>
            </>
          }
        />
      </Formula>
    </AbsoluteFill>
  );
};

