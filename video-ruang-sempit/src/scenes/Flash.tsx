import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Arrow, Chalk, Halo, Label, Note, Spark, Stage} from '../components/primitives';
import {FlashDisk, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Penampang sel memori gerbang mengambang (skematis)
const SX = 130;
const SW = 600;

export const Flash: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const pIntro = win(t, -1, cue(1) - 0.3, 0.5, 0.6);
  const cell = ramp(t, cue(1) - 0.1, cue(1) + 1.4);
  const band = ramp(t, cue(2) - 0.1, cue(2) + 0.9);
  const tilt = ramp(t, wordOf(2, 'tegangan') - 0.2, wordOf(2, 'miring') + 0.4, EASE_IN_OUT) * (1 - ramp(t, cue(6) - 0.2, cue(6) + 0.8, EASE_IN_OUT));
  const erase = ramp(t, cue(8) - 0.1, cue(8) + 1.0, EASE_IN_OUT) * (1 - ramp(t, cue(9) - 0.3, cue(9) + 0.3));
  const tunnel = ramp(t, cue(3) - 0.1, cue(3) + 2.4);
  const stored = ramp(t, cue(3) + 0.4, cue(3) + 2.6) * (1 - ramp(t, cue(8) + 0.3, cue(8) + 2.0));
  const vth = win(t, cue(5) - 0.1, cue(6) - 0.2, 0.7, 0.5);
  const blocked = win(t, cue(6) + 0.6, cue(8) - 0.3, 0.6, 0.5);
  const leak = ramp(t, cue(9) + 0.2, cue(9) + 1.4);

  const oxTop = 600;
  const oxH = mix(36, 18, leak);
  const nE = Math.round(10 * stored);

  // diagram pita oksida: kiri = kanal, kanan = gerbang mengambang
  const BX0 = 1180;
  const BX1 = 1480;
  const BASE = 700;
  const TOP = 380;
  const sl = tilt * 260 - erase * 170; // kemiringan puncak penghalang
  const bar = `M1080,${BASE} H${BX0} V${TOP} L${BX1},${TOP + sl} V${BASE + sl * 0.6} H1760`;

  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={pIntro}>
          <FlashDisk x={700} y={520} s={1.6} />
          <g transform="translate(1180 520) rotate(8)">
            <path d="M-90,-130 H50 L90,-90 V130 H-90 Z" fill="none" stroke={C.ink} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-70 + i * 30} y={-120} width={16} height={34} fill="none" stroke={C.yellow} strokeWidth={3} />
            ))}
            <Label x={0} y={40} size={48} color={C.muted}>
              SD
            </Label>
          </g>
        </g>

        {/* penampang sel */}
        <g opacity={cell}>
          <rect x={SX} y={680} width={SW} height={160} fill={C.muted} opacity={0.12} />
          <Chalk d={`M${SX},680 H${SX + SW}`} color={C.muted} width={3} />
          <Label x={SX + SW / 2} y={800} size={40} color={C.muted}>
            silikon (kanal)
          </Label>
          <rect x={SX + 30} y={680} width={150} height={60} rx={8} fill={C.blue} opacity={0.3} />
          <rect x={SX + SW - 180} y={680} width={150} height={60} rx={8} fill={C.blue} opacity={0.3} />
          <Label x={SX + 105} y={712} size={34} color={C.blue}>
            sumber
          </Label>
          <Label x={SX + SW - 105} y={712} size={34} color={C.blue}>
            cerat
          </Label>
          {/* oksida terowongan */}
          <rect x={SX + 160} y={680 - oxH} width={SW - 320} height={oxH} fill={C.yellow} opacity={0.35} />
          <Label x={SX + SW + 20} y={680 - oxH / 2} size={36} color={C.yellow} anchor="start">
            oksida tipis
          </Label>
          {/* gerbang mengambang */}
          <rect x={SX + 160} y={oxTop - 130 + (36 - oxH)} width={SW - 320} height={94} rx={6} fill="none" stroke={C.orange} strokeWidth={5} />
          <Label x={SX + SW + 20} y={oxTop - 83 + (36 - oxH)} size={36} color={C.orange} anchor="start">
            gerbang mengambang
          </Label>
          <rect x={SX + 160} y={oxTop - 170 + (36 - oxH)} width={SW - 320} height={40} fill={C.muted} opacity={0.2} />
          <rect x={SX + 160} y={oxTop - 270 + (36 - oxH)} width={SW - 320} height={96} rx={6} fill="none" stroke={C.ink} strokeWidth={5} />
          <Label x={SX + SW + 20} y={oxTop - 222 + (36 - oxH)} size={36} color={C.ink} anchor="start">
            gerbang kendali
          </Label>
          <Halo x={SX + SW / 2} y={oxTop - 83} r={260} color="blue" opacity={0.7 * stored} squash={0.4} />
          {/* elektron tersimpan */}
          {Array.from({length: nE}, (_, i) => (
            <Spark key={i} x={SX + 200 + (i % 5) * 50 + 8 * Math.sin(t * 2 + i)} y={oxTop - 100 + Math.floor(i / 5) * 34 + (36 - oxH)} r={8} color={C.blue} halo={0.7} />
          ))}
          {/* elektron menerowong naik */}
          {tunnel > 0 && tunnel < 1
            ? Array.from({length: 5}, (_, i) => {
                const ph = (t * 0.9 + i / 5) % 1;
                return <Spark key={i} x={SX + 220 + i * 45} y={mix(700, 560, ph)} r={7} color={C.green} opacity={1 - ph * 0.6} trail={[0, 1, 2, 3, 4].map((k) => [SX + 220 + i * 45, mix(700, 560, Math.max(0, ph - k * 0.03))] as [number, number])} />;
              })
            : null}
          {/* bocor */}
          <g opacity={leak}>
            {[0, 1, 2].map((i) => {
              const ph = (t * 0.6 + i / 3) % 1;
              return <circle key={i} cx={SX + 260 + i * 120} cy={mix(560, 720, ph)} r={9} fill={C.red} opacity={1 - ph} />;
            })}
          </g>
        </g>

        {/* diagram pita penghalang oksida */}
        <g opacity={band * (1 - vth)}>
          <Chalk d={bar} color={C.ink} width={6} />
          <rect x={BX0} y={TOP} width={BX1 - BX0} height={BASE - TOP} fill="url(#hatch)" opacity={0.4} />
          <Chalk d={`M1080,${BASE - 80} H${BX0}`} color={C.blue} width={3} dash="6 8" />
          <Label x={1120} y={BASE + 50} size={38} color={C.muted}>
            kanal
          </Label>
          <Label x={1640} y={BASE + 50} size={38} color={C.muted}>
            gerbang
          </Label>
          <Label x={(BX0 + BX1) / 2} y={TOP - 40} size={42} color={C.yellow} opacity={1 - erase}>
            oksida
          </Label>
          {/* gelombang menembus penghalang segitiga */}
          <g opacity={tunnel * tilt}>
            <WaveLine x0={1080} x1={BX0} f={(u) => BASE - 80 - 30 * Math.cos(u * 10 - t * 6)} color={C.blue} width={4} />
            <WaveLine x0={BX0} x1={BX0 + 120} f={(u) => BASE - 80 - 30 * Math.exp(-u * 2.2) * Math.cos(-t * 6)} color={C.blue} width={4} />
            <WaveLine x0={BX0 + 120} x1={1720} f={(u) => BASE - 80 - 10 * Math.cos(u * 18 - t * 6)} color={C.blue} width={3} />
            <Label x={1580} y={BASE - 165} size={40} color={C.green}>
              menerowong
            </Label>
          </g>
          <g opacity={blocked}>
            <Chalk d={`M${BX0 - 60},${BASE - 140} l120,120 M${BX0 + 60},${BASE - 140} l-120,120`} color={C.red} width={6} />
            <Label x={(BX0 + BX1) / 2} y={BASE + 100} size={40} color={C.red}>
              tebal penuh: hampir mustahil
            </Label>
          </g>
          <g opacity={erase}>
            <Arrow x1={1640} y1={BASE - 40} x2={1110} y2={BASE - 40} color="pink" width={4} />
            <Label x={1360} y={BASE + 100} size={42} color={C.pink}>
              hapus: elektron menerowong keluar
            </Label>
          </g>
        </g>

        {/* pergeseran tegangan ambang */}
        <g opacity={vth}>
          <rect x={1080} y={230} width={700} height={540} rx={18} fill="#0b0c26" opacity={0.6} stroke={C.faint} strokeWidth={2} />
          <Chalk d="M1140,700 H1740 M1140,700 V300" color={C.muted} width={3} />
          <WaveLine x0={1140} x1={1740} f={(u) => 700 - 360 / (1 + Math.exp(-(u - 0.32) * 18))} color={C.green} width={5} />
          <WaveLine x0={1140} x1={1740} f={(u) => 700 - 360 / (1 + Math.exp(-(u - 0.68) * 18))} color={C.orange} width={5} />
          <Label x={1300} y={330} size={46} color={C.green}>
            kosong
          </Label>
          <Label x={1610} y={430} size={46} color={C.orange}>
            berisi
          </Label>
          <Label x={1440} y={740} size={38} color={C.muted}>
            tegangan gerbang →
          </Label>
          <Label x={1440} y={250} size={46} color={C.ink}>
            dibaca sebagai bit 1 atau 0
          </Label>
        </g>
      </Stage>
      <Note x={960} y={200} text="penerowongan Fowler–Nordheim" color={C.green} size={56} p={ramp(t, cue(4) - 0.1, cue(4) + 0.7)} opacity={1 - ramp(t, cue(5) - 0.3, cue(5))} />
      <Note x={960} y={200} text="data bertahan bertahun-tahun tanpa listrik" color={C.yellow} size={54} p={ramp(t, cue(7) - 0.1, cue(7) + 0.8)} opacity={1 - ramp(t, cue(8) - 0.3, cue(8))} />
      <Note x={960} y={200} text="oksida terlalu tipis → muatan bocor" color={C.red} size={54} p={leak} />
    </AbsoluteFill>
  );
};
