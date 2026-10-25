import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp} from '../anim';
import {Dust, Stage} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {BRAND} from '../brand';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

export const Title: React.FC = () => {
  const {t} = useScene();
  const kick = ramp(t, 0.2, 1.2);
  const w1 = ramp(t, 0.5, 1.7);
  const w2 = ramp(t, 1.0, 2.2);
  const box = ramp(t, 2.0, 3.2);
  const squeeze = ramp(t, 3.4, 5.4, EASE_IN_OUT);
  const auth = ramp(t, 3.0, 4.2);
  const half = mix(300, 190, squeeze);
  const n = 1 + Math.round(2 * squeeze);
  return (
    <AbsoluteFill>
      <Stage>
        <Dust x={960} y={500} r={700} opacity={0.6} />
        <g opacity={box}>
          <path d={`M${960 - half},590 V700 H${960 + half} V590`} fill="none" stroke={C.ink} strokeWidth={2.4} strokeOpacity={0.85} />
          <WaveLine x0={960 - half} x1={960 + half} f={(u) => 672 - 36 * Math.sin(n * Math.PI * u) * Math.cos(t * 4)} color={C.green} width={3} />
        </g>
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
        <div style={{fontFamily: FONT.sans, fontSize: 22, fontWeight: 600, letterSpacing: 9, color: C.green, opacity: kick, textTransform: 'uppercase'}}>{BRAND.subtitle}</div>
        <div style={{display: 'flex', gap: 34, alignItems: 'baseline', marginTop: 14, fontFamily: FONT.display, fontSize: 200, lineHeight: 1, color: C.ink}}>
          <span style={{opacity: w1, translate: `0px ${(1 - w1) * 24}px`, filter: `blur(${(1 - w1) * 8}px)`}}>Ruang</span>
          <span style={{opacity: w2, translate: `0px ${(1 - w2) * 24}px`, filter: `blur(${(1 - w2) * 8}px)`, fontStyle: 'italic', color: C.yellow}}>Sempit</span>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: auth}}>
        <div style={{width: 120 * auth, height: 1, background: `linear-gradient(90deg, transparent, ${C.green})`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 26, fontWeight: 400, letterSpacing: 2, color: C.muted}}>
          oleh <span style={{color: C.ink, fontWeight: 600}}>{BRAND.author}</span>
        </div>
        <div style={{width: 120 * auth, height: 1, background: `linear-gradient(90deg, ${C.pink}, transparent)`}} />
      </div>
    </AbsoluteFill>
  );
};
