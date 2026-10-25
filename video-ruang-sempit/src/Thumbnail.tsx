import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Frame} from './components/Background';
import {Dust, Stage} from './components/primitives';
import {WaveLine} from './components/illus';
import {BRAND} from './brand';
import {C, FONT} from './theme';

// Kotak energi di sisi kanan: tiga tingkat, gelombang berdiri di tiap tingkat.
const BX0 = 1120;
const BX1 = 1700;
const FLOOR = 850;
const U = 52; // px per E1
const LV = [
  {n: 1, col: C.blue},
  {n: 2, col: C.green},
  {n: 3, col: C.pink},
];

/** Thumbnail 2560×1440 (desain 1920×1080 diperbesar). */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', width: 1920, height: 1080, transform: `scale(${2560 / 1920})`, transformOrigin: '0 0'}}>
      <Background />
      <Stage>
        <Dust x={1410} y={560} r={520} opacity={0.9} />
        {LV.map(({n, col}) => {
          const y = FLOOR - n * n * U - 40;
          return (
            <g key={n}>
              <line x1={BX0 + 14} y1={y} x2={BX1 - 14} y2={y} stroke={col} strokeWidth={1.4} strokeOpacity={0.45} strokeDasharray="6 8" />
              <WaveLine x0={BX0} x1={BX1} f={(u) => y - 46 * Math.sin(n * Math.PI * u)} color={col} width={5} />
              <text x={BX1 + 30} y={y} dominantBaseline="central" fontFamily={FONT.mono} fontSize={26} fill={col}>
                {`n = ${n}`}
              </text>
            </g>
          );
        })}
        <path d={`M${BX0},180 V${FLOOR} H${BX1} V180`} fill="none" stroke={C.ink} strokeWidth={3} strokeOpacity={0.9} />
        <text x={(BX0 + BX1) / 2} y={FLOOR + 70} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={46} fill={C.yellow}>
          Eₙ ∝ n² / L²
        </text>
      </Stage>
      <div style={{position: 'absolute', left: 130, top: 0, bottom: 0, width: 880, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{fontFamily: FONT.sans, fontSize: 24, fontWeight: 600, letterSpacing: 8, color: C.green, textTransform: 'uppercase'}}>Kimia Kuantum · Gerak Translasi</div>
        <div style={{fontFamily: FONT.display, fontSize: 230, lineHeight: 0.9, color: C.ink, marginTop: 26}}>Ruang</div>
        <div style={{fontFamily: FONT.display, fontStyle: 'italic', fontSize: 230, lineHeight: 0.95, color: C.yellow}}>Sempit</div>
        <div style={{width: 360, height: 1.5, marginTop: 34, background: `linear-gradient(90deg, ${C.green}, ${C.pink}, transparent)`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 32, fontWeight: 400, lineHeight: 1.4, color: C.ink, marginTop: 28, opacity: 0.9}}>
          Elektron di ruang sempit: dari warna wortel
          <br />
          sampai layar QLED dan memori flash
        </div>
        <div style={{fontFamily: FONT.sans, fontSize: 24, fontWeight: 500, letterSpacing: 3, color: C.muted, marginTop: 36, textTransform: 'uppercase'}}>{BRAND.author}</div>
      </div>
      <Frame />
    </div>
  </AbsoluteFill>
);
