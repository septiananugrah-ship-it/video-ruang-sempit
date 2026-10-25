import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, ramp} from '../anim';
import {BRAND} from '../brand';
import {Dust, Stage} from '../components/primitives';
import {WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const REFS = [
  'Modul 3 Kimia Kuantum — Teori Kuantum Gerak Translasi (bahan kuliah S1 Kimia UNESA)',
  'P. Atkins, J. de Paula & J. Keeler, Atkins’ Physical Chemistry, 11th ed., Oxford Univ. Press (2018)',
  'I. N. Levine, Quantum Chemistry, 7th ed., Pearson (2014)',
  'D. A. McQuarrie, Quantum Chemistry, 2nd ed., University Science Books (2008)',
  'D. J. Griffiths & D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed., Cambridge (2018)',
  'D. L. Pavia et al., Introduction to Spectroscopy, 5th ed., Cengage (2015) — data UV poliena & β-karoten',
  'H. Kuhn, J. Chem. Phys. 17, 1198 (1949) — model elektron bebas pewarna',
  'J. Autschbach, J. Chem. Educ. 84, 1840 (2007) — sianin vs poliena',
  'R. B. Mujumdar et al., Bioconjugate Chem. 4, 105 (1993) — label sianin Cy3/Cy5',
  'C. H. Townes & A. L. Schawlow, Microwave Spectroscopy, McGraw-Hill (1955) — inversi NH₃',
  'A. I. Ekimov & A. A. Onushchenko, JETP Lett. 34, 345 (1981) — titik kuantum dalam kaca',
  'L. E. Brus, J. Chem. Phys. 80, 4403 (1984) — kristal semikonduktor kecil',
  'C. B. Murray, D. J. Norris & M. G. Bawendi, J. Am. Chem. Soc. 115, 8706 (1993) — sintesis CdSe',
  'Royal Swedish Academy of Sciences, Scientific Background: Nobel Kimia 2023 (titik kuantum)',
  'S. Nakamura, T. Mukai & M. Senoh, Appl. Phys. Lett. 64, 1687 (1994) — LED biru InGaN',
  'Royal Swedish Academy of Sciences, Scientific Background: Nobel Fisika 2014 (LED biru)',
  'M. Lenzlinger & E. H. Snow, J. Appl. Phys. 40, 278 (1969) — penerowongan Fowler–Nordheim di SiO₂',
  'CODATA 2018 (NIST) — h, ħ, mₑ, c',
];

export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0, 1.4);
  const refs = ramp(t, 2.0, 3.0);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Dust x={960} y={150} r={260} opacity={0.8} />
        <g opacity={a}>
          <path d="M860,95 V200 H1060 V95" fill="none" stroke={C.ink} strokeWidth={2} strokeOpacity={0.8} />
          <WaveLine x0={860} x1={1060} f={(u) => 165 - 26 * Math.sin(2 * Math.PI * u) * Math.cos(t * 3)} color={C.green} width={3} />
        </g>
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 214}}>
        <div style={{fontFamily: FONT.sans, fontSize: 20, letterSpacing: 9, color: C.green, fontWeight: 600, opacity: a, textTransform: 'uppercase'}}>{BRAND.subtitle}</div>
        <div style={{fontFamily: FONT.display, fontSize: 88, color: C.ink, lineHeight: 1.05, opacity: a}}>
          Ruang <span style={{fontStyle: 'italic', color: C.yellow}}>Sempit</span>
        </div>
        <div style={{marginTop: 8, fontFamily: FONT.sans, fontSize: 28, fontWeight: 400, color: C.ink, opacity: ramp(t, 1, 2)}}>
          Terima kasih telah menonton · <span style={{color: C.pink, fontWeight: 600}}>{BRAND.author}</span>
        </div>
        <div style={{marginTop: 26, opacity: refs}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 14}}>
            <div style={{width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${C.muted})`}} />
            <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: 5, color: C.muted}}>SUMBER & RUJUKAN</div>
            <div style={{width: 80, height: 1, background: `linear-gradient(90deg, ${C.muted}, transparent)`}} />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56, rowGap: 6, width: 1740}}>
            {REFS.map((r, i) => (
              <div key={r} style={{display: 'flex', gap: 12, fontFamily: FONT.sans, fontSize: 20, color: '#b3b8dd', lineHeight: 1.32, opacity: ramp(t, 2.0 + i * 0.08, 2.8 + i * 0.08)}}>
                <span style={{fontFamily: FONT.mono, color: C.green, opacity: 0.7, minWidth: 26}}>{String(i + 1).padStart(2, '0')}</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop: 18, fontFamily: FONT.sans, fontSize: 18, color: C.muted, textAlign: 'center', opacity: 0.85}}>
            Angka eksperimen dibulatkan dari pustaka di atas · ilustrasi bersifat skematis · musik orisinal disintesis dengan numpy · dibuat dengan Remotion
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
