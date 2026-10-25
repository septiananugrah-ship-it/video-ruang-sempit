import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, win} from '../anim';
import {Arrow, Bond, Chalk, Halo, Label, Note, Stage} from '../components/primitives';
import {Carrot, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

const SX0 = 260;
const SX1 = 1660;
const SY = 700;
const xl = (nm: number) => SX0 + ((nm - 200) / 600) * (SX1 - SX0);
/** warna kira-kira untuk panjang gelombang tampak */
const nmColor = (nm: number) =>
  nm < 400 ? '#6b6080' : interpolateColors(nm, [400, 450, 490, 530, 580, 620, 700], ['#8a5cff', '#4f7bff', '#3fc6e6', '#55d36a', '#f2de4a', '#f39a3c', '#e8463c']);

const NC = 22; // atom karbon rantai terkonjugasi (11 C=C)

export const CarrotScene: React.FC = () => {
  const {t, cue} = useScene();
  const spec = ramp(t, 0.3, 1.5);
  const uv = ramp(t, 0.8, 1.8);
  const grow = ramp(t, cue(1) - 0.2, cue(1) + 2.6, EASE_IN_OUT);
  const name = ramp(t, cue(2) - 0.1, cue(2) + 0.8);
  const shift = ramp(t, cue(3) + 0.6, cue(3) + 3.0, EASE_IN_OUT);
  const absorb = ramp(t, cue(4) - 0.1, cue(4) + 1.2);
  const comp = ramp(t, cue(5) - 0.1, cue(5) + 0.9, BACK);
  const fill22 = win(t, cue(6) - 0.2, cue(7) - 0.2, 0.7, 0.6);
  const pChain = 1 - fill22;
  const tomato = ramp(t, cue(8) - 0.1, cue(8) + 0.9, BACK);

  const nShown = Math.max(4, Math.round(4 + grow * (NC - 4)));
  const dx = 64;
  const cx0 = 960 - ((NC - 1) * dx) / 2;
  const atom = (i: number): [number, number] => [cx0 + i * dx, i % 2 ? 300 : 345];
  const peak = 217 + shift * (450 - 217);
  // cincin β-ionon di kedua ujung: segi enam yang memuat ikatan rangkap terakhir
  const ring = (A: [number, number], B: [number, number]) => {
    const d: [number, number] = [A[0] - B[0], A[1] - B[1]];
    const build = (sg: number) => {
      const pts: [number, number][] = [B, A];
      for (let k = 1; k < 5; k++) {
        const ang = (sg * k * Math.PI) / 3;
        const prev = pts[pts.length - 1];
        pts.push([prev[0] + d[0] * Math.cos(ang) - d[1] * Math.sin(ang), prev[1] + d[0] * Math.sin(ang) + d[1] * Math.cos(ang)]);
      }
      return pts.slice(0, 6);
    };
    const c1 = build(1);
    const c2 = build(-1);
    const far = (q: [number, number][]) => Math.abs(q.reduce((a, v) => a + v[0], 0) / 6 - 960);
    return far(c1) > far(c2) ? c1 : c2;
  };
  const rings = ramp(grow, 0.92, 1);

  return (
    <AbsoluteFill>
      <Stage>
        {/* rantai terkonjugasi tumbuh */}
        <g opacity={pChain}>
          {Array.from({length: nShown - 1}, (_, i) => {
            const a = atom(i);
            const b = atom(i + 1);
            return <Bond key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} order={i % 2 === 0 ? 2 : 1} width={4} color={i % 2 === 0 ? C.orange : C.muted} />;
          })}
          {Array.from({length: nShown}, (_, i) => (
            <circle key={i} cx={atom(i)[0]} cy={atom(i)[1]} r={6} fill={C.ink} />
          ))}
          <g opacity={rings}>
            {[ring(atom(0), atom(1)), ring(atom(NC - 1), atom(NC - 2))].map((r, k) => (
              <path key={k} d={`M${r.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L')} Z`} fill="none" stroke={C.muted} strokeWidth={2.6} strokeLinejoin="round" />
            ))}
          </g>
          {/* pendar jingga di sepanjang rantai: elektron pi terdelokalisasi */}
          <Halo x={960} y={322} r={760} color="orange" opacity={0.5 * name} squash={0.16} />
          <Label x={960} y={230} size={50} color={C.orange} p={ramp(t, cue(1) + 1.6, cue(1) + 2.8)} opacity={1 - ramp(t, cue(7) - 0.4, cue(7))}>
            11 ikatan rangkap terkonjugasi
          </Label>
          <g opacity={name}>
            <Label x={960} y={420} size={60} color={C.ink}>
              β-karoten
            </Label>
            <Carrot x={1800} y={560} s={0.5} p={name} />
          </g>
        </g>

        {/* 22 elektron pi mengisi 11 tingkat */}
        <g opacity={fill22}>
          {Array.from({length: 13}, (_, k) => {
            const n = k + 1;
            const y = 840 - n * n * 3.6;
            const filled = n <= 11;
            const p = ramp(t, cue(6) + k * 0.12, cue(6) + 0.3 + k * 0.12);
            return (
              <g key={k} opacity={p}>
                <Chalk d={`M760,${y} H1160`} color={n === 11 ? C.blue : n === 12 ? C.pink : C.muted} width={n >= 11 ? 4 : 2.5} />
                {filled ? (
                  <g>
                    <circle cx={940} cy={y - 7} r={5} fill={C.yellow} />
                    <circle cx={980} cy={y - 7} r={5} fill={C.yellow} />
                  </g>
                ) : null}
              </g>
            );
          })}
          <Label x={1190} y={840 - 121 * 3.6} size={42} color={C.blue} anchor="start">
            HOMO (n = 11)
          </Label>
          <Label x={1190} y={840 - 144 * 3.6} size={42} color={C.pink} anchor="start">
            LUMO (n = 12)
          </Label>
          <Label x={560} y={560} size={52} color={C.yellow}>
            22 elektron pi
          </Label>
        </g>

        {/* spektrum UV–tampak */}
        <g opacity={spec * (1 - fill22)}>
          <rect x={xl(200)} y={SY} width={xl(400) - xl(200)} height={56} fill="#3a3550" opacity={0.6} />
          {Array.from({length: 60}, (_, i) => {
            const nm = 400 + i * 5;
            return <rect key={i} x={xl(nm)} y={SY} width={xl(405) - xl(400) + 1} height={56} fill={nmColor(nm + 2)} opacity={0.75} />;
          })}
          <rect x={xl(700)} y={SY} width={xl(800) - xl(700)} height={56} fill="#4a2a2a" opacity={0.5} />
          {[200, 300, 400, 500, 600, 700, 800].map((nm) => (
            <g key={nm}>
              <line x1={xl(nm)} y1={SY + 56} x2={xl(nm)} y2={SY + 68} stroke={C.muted} strokeWidth={2} />
              <Label x={xl(nm)} y={SY + 92} size={34} color={C.muted}>
                {`${nm}`}
              </Label>
            </g>
          ))}
          <Label x={xl(300)} y={SY - 30} size={44} color={C.lilac}>
            ultraviolet
          </Label>
          <Label x={xl(550)} y={SY - 30} size={44} color={C.ink} opacity={1 - absorb}>
            cahaya tampak
          </Label>
          <Label x={SX1 + 60} y={SY + 92} size={34} color={C.muted} anchor="start">
            nm
          </Label>
          {/* penanda serapan */}
          <g opacity={uv * (1 - shift)}>
            <Arrow x1={xl(217)} y1={SY - 120} x2={xl(217)} y2={SY - 6} color="blue" width={4} />
            <Arrow x1={xl(258)} y1={SY - 120} x2={xl(258)} y2={SY - 6} color="green" width={4} />
            <Label x={xl(205)} y={SY - 150} size={38} color={C.blue} anchor="end">
              butadiena 217
            </Label>
            <Label x={xl(270)} y={SY - 150} size={38} color={C.green} anchor="start">
              heksatriena 258
            </Label>
            <Label x={xl(240)} y={SY - 210} size={42} color={C.muted}>
              tak berwarna
            </Label>
          </g>
          <g opacity={shift > 0 ? 1 : 0}>
            <Arrow x1={xl(peak)} y1={SY - 120} x2={xl(peak)} y2={SY - 6} color="orange" width={5} />
          </g>
          {/* pita serapan β-karoten (puncak ≈ 450, bahu 425 & 478) */}
          <g opacity={absorb}>
            <WaveLine
              x0={xl(360)}
              x1={xl(540)}
              f={(u) => {
                const nm = 360 + u * 180;
                const g = (c: number, w: number, a: number) => a * Math.exp(-((nm - c) ** 2) / (2 * w * w));
                return SY - 4 - 150 * (g(425, 14, 0.75) + g(452, 15, 1) + g(479, 14, 0.85));
              }}
              color={C.orange}
              width={5}
              p={absorb}
            />
            <Label x={xl(545)} y={SY - 120} size={46} color={C.blue} anchor="start" opacity={1 - tomato}>
              menyerap biru ≈ 450 nm
            </Label>
          </g>
        </g>

        {/* warna komplementer */}
        <g opacity={comp * (1 - fill22)}>
          <circle cx={330} cy={500} r={70} fill="#4f7bff" opacity={0.5} />
          <circle cx={570} cy={500} r={70} fill="#f39a3c" opacity={0.75} />
          <Arrow x1={410} y1={500} x2={490} y2={500} color="ink" width={4} both />
          <Label x={330} y={600} size={42} color={C.blue}>
            diserap
          </Label>
          <Label x={570} y={600} size={42} color={C.orange}>
            terlihat: jingga
          </Label>
        </g>

        {/* likopen */}
        <g opacity={tomato}>
          <circle cx={1470} cy={540} r={58} fill={C.red} opacity={0.3} />
          <circle cx={1470} cy={540} r={58} fill="none" stroke={C.red} strokeWidth={5} />
          <path d="M1442,484 l28,14 l28,-14 M1470,498 v-24" stroke={C.green} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Label x={1470} y={644} size={44} color={C.red}>
            likopen (tomat)
          </Label>
        </g>
      </Stage>
      <Note x={1120} y={200} text="warna wortel = panjang kotak elektron pi" color={C.orange} size={52} p={ramp(t, cue(7) - 0.1, cue(7) + 0.9)} />
    </AbsoluteFill>
  );
};
