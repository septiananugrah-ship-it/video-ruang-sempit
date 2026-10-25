import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Arrow, Chalk, Formula, Label, Note, Stage, Sub, V} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Sumur simetris |x| < a, z0 = 2 (dua keadaan terikat, sesuai contoh Modul 3)
const A = 300; // px untuk a
const CX = 960;
const XL = CX - 2.2 * A;
const XR = CX + 2.2 * A;
const FLOOR = 800;
const V0 = 380; // px
const yE = (e: number) => FLOOR - e * V0;

const Z = [1.02987, 1.89549];
const E = Z.map((z) => (z / 2) ** 2); // 0,2652 dan 0,8982
const psi = (n: number, xa: number) => {
  const z = Z[n];
  const kap = Math.sqrt(4 - z * z);
  if (n === 0) return Math.abs(xa) < 1 ? Math.cos(z * xa) : Math.cos(z) * Math.exp(-kap * (Math.abs(xa) - 1));
  return Math.abs(xa) < 1 ? Math.sin(z * xa) : Math.sign(xa) * Math.sin(z) * Math.exp(-kap * (Math.abs(xa) - 1));
};

export const Finite: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const drop = ramp(t, cue(0) + 0.6, cue(1) + 0.6, EASE_IN_OUT);
  const wallTop = mix(160, FLOOR - V0, drop);
  const vlab = ramp(t, wordOf(1, 'nol') - 0.3, wordOf(1, 'nol') + 0.5);
  const w1 = ramp(t, cue(2) - 0.1, cue(2) + 1.0);
  const match = win(t, cue(3) - 0.1, cue(4) + 0.4, 0.6, 0.5);
  const tails = ramp(t, cue(4) - 0.1, cue(4) + 1.4);
  const forb = win(t, cue(5) - 0.1, cue(6) - 0.2, 0.7, 0.5);
  const cmp = win(t, cue(6) - 0.1, cue(7) - 0.2, 0.7, 0.5);
  const lv2 = ramp(t, cue(7) - 0.1, cue(7) + 1.0);
  const fNum = ramp(t, cue(8) - 0.1, cue(8) + 0.9);
  const thin = ramp(t, cue(9) - 0.1, cue(9) + 1.2, BACK);

  const xs = (xa: number) => CX + xa * A;
  const wave = (n: number, amp: number) => (u: number) => {
    const xa = -2.2 + u * 4.4;
    const visible = Math.abs(xa) < 1 ? 1 : tails;
    return yE(E[n]) - amp * psi(n, xa) * visible;
  };

  return (
    <AbsoluteFill>
      <Stage>
        {/* potensial */}
        <Chalk d={`M${XL},${wallTop} H${xs(-1)} V${FLOOR} H${xs(1)}`} color={C.ink} width={7} />
        <Chalk d={`M${xs(1)},${FLOOR} V${wallTop} H${XR}`} color={C.ink} width={7} opacity={1 - thin} />
        {drop < 0.98 ? (
          <Label x={CX} y={230} size={50} color={C.muted} opacity={1 - drop}>
            dinding tak berhingga = idealisasi
          </Label>
        ) : null}
        <g opacity={vlab}>
          <Arrow x1={XL + 40} y1={FLOOR} x2={XL + 40} y2={FLOOR - V0 + 6} color="red" width={4} both />
          <Label x={XL + 60} y={FLOOR - V0 + 50} size={50} font="serif" italic color={C.red} anchor="start">
            V₀
          </Label>
        </g>
        {/* daerah terlarang klasik */}
        <g opacity={forb}>
          <rect x={XL} y={FLOOR - V0} width={xs(-1) - XL} height={V0} fill="url(#hatch)" opacity={0.7} />
          <rect x={xs(1)} y={FLOOR - V0} width={XR - xs(1)} height={V0} fill="url(#hatch)" opacity={0.7} />
          <Label x={(XL + xs(-1)) / 2} y={FLOOR - V0 - 50} size={42} color={C.red}>
            terlarang secara klasik
          </Label>
        </g>
        {/* keadaan dasar */}
        <g opacity={w1 * (1 - 0.55 * thin)}>
          <Chalk d={`M${xs(-1)},${yE(E[0])} H${xs(1)}`} color={C.blue} width={2.5} dash="8 10" />
          <WaveLine x0={XL} x1={XR} n={300} f={wave(0, 110)} color={C.blue} width={5} p={w1} />
        </g>
        {/* titik sambung */}
        <g opacity={match}>
          {[-1, 1].map((s) => (
            <g key={s}>
              <circle cx={xs(s)} cy={yE(E[0]) - 110 * psi(0, s)} r={18} fill="none" stroke={C.yellow} strokeWidth={5} />
            </g>
          ))}
          <Label x={CX} y={FLOOR - V0 - 60} size={46} color={C.yellow}>
            nilai & kemiringan menyambung mulus
          </Label>
        </g>
        <g opacity={tails * (1 - cmp) * (1 - lv2)}>
          <Label x={xs(1.6)} y={yE(E[0]) - 90} size={44} color={C.green}>
            ekor meluruh
          </Label>
        </g>
        {/* bandingkan dengan kotak tak berhingga */}
        <g opacity={cmp}>
          <WaveLine x0={xs(-1)} x1={xs(1)} f={(u) => yE(0.617) - 110 * Math.sin(Math.PI * u)} color={C.muted} width={3} dash="10 9" />
          <Chalk d={`M${xs(-1)},${yE(0.617)} H${xs(1)}`} color={C.muted} width={3} dash="4 8" />
          <Label x={xs(1) + 30} y={yE(0.617)} size={37} color={C.muted} anchor="start">
            kotak tak berhingga
          </Label>
          <Label x={xs(1) + 30} y={yE(E[0]) + 32} size={37} color={C.blue} anchor="start">
            sumur berhingga: lebih rendah
          </Label>
          <Arrow x1={xs(-1) - 40} y1={yE(0.617)} x2={xs(-1) - 40} y2={yE(E[0]) - 6} color="yellow" width={4} />
        </g>
        {/* tingkat kedua & batas jumlah tingkat */}
        <g opacity={lv2 * (1 - 0.55 * thin)}>
          <Chalk d={`M${xs(-1)},${yE(E[1])} H${xs(1)}`} color={C.pink} width={2.5} dash="8 10" />
          <WaveLine x0={XL} x1={XR} n={300} f={wave(1, 90)} color={C.pink} width={5} p={lv2} />
          <rect x={XL} y={140} width={XR - XL} height={FLOOR - V0 - 150} fill={C.muted} opacity={0.06} />
          <Label x={CX} y={300} size={44} color={C.muted}>
            di atas V₀: tidak lagi terikat
          </Label>
        </g>
        {/* dinding menipis */}
        <g opacity={thin}>
          <rect x={xs(1)} y={FLOOR - V0} width={xs(1.25) - xs(1)} height={V0} fill="url(#hatch)" opacity={0.8} />
          <Chalk d={`M${xs(1)},${FLOOR} V${FLOOR - V0} H${xs(1.25)} V${FLOOR} H${XR}`} color={C.orange} width={7} />
          <Label x={xs(1.12)} y={FLOOR + 52} size={46} color={C.orange}>
            dinding tipis?
          </Label>
        </g>
      </Stage>
      <Formula x={1560} y={250} p={fNum} accent={C.pink} size={56} caption="contoh: sumur dengan dua tingkat terikat">
        <V>E</V>
        <Sub>1</Sub> ≈ 0,27 <V>V</V>
        <Sub>0</Sub>
        <span style={{margin: '0 0.5em', color: C.muted}}>·</span>
        <V>E</V>
        <Sub>2</Sub> ≈ 0,90 <V>V</V>
        <Sub>0</Sub>
      </Formula>
      <Note x={360} y={250} text="jumlah tingkat terbatas" color={C.pink} size={50} p={ramp(t, wordOf(7, 'terbatas') - 0.3, wordOf(7, 'terbatas') + 0.5)} opacity={1 - thin} />
    </AbsoluteFill>
  );
};
