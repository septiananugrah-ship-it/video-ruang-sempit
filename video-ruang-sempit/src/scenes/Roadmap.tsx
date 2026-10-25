import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp} from '../anim';
import {Atom, Bond, Chalk, Halo, Spark, Stage} from '../components/primitives';
import {LedBulb, WaveLine} from '../components/illus';
import {useScene} from '../SceneContext';
import {C, FONT, type Hue} from '../theme';

const ITEMS: {n: string; title: string; sub: string[]; color: string; hue: Hue}[] = [
  {n: '1', title: 'Prinsip & teori dasar', sub: ['partikel bebas', 'kotak 1D, 2D, 3D'], color: C.blue, hue: 'blue'},
  {n: '2', title: 'Implementasi dalam kimia', sub: ['warna molekul', 'pewarna & penerowongan'], color: C.green, hue: 'green'},
  {n: '3', title: 'Penerapan di industri', sub: ['titik kuantum · LED', 'memori flash'], color: C.orange, hue: 'orange'},
];
const XS = [420, 960, 1500];
const OY = 318; // pusat orb nomor

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const head = ramp(t, 0.1, 1.2);
  const tiga = ramp(t, wordOf(0, 'tiga') - 0.2, wordOf(0, 'tiga') + 0.9);
  const state = ITEMS.map((_, i) => {
    const p = ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 1.0);
    const active = t >= cue(i + 1) - 0.3 && (i === 2 || t < cue(i + 2) - 0.3);
    const base = 0.35 * ramp(t, 0.6, 1.6) + 0.25 * tiga;
    const o = Math.max(base, p) * (active || t < cue(1) ? 1 : 0.5);
    return {p, active, o};
  });
  // komet kecil yang berjalan di garis rasi menuju bagian aktif
  const prog = Math.min(2, ramp(t, cue(1) - 0.3, cue(1) + 0.6) * 0 + ramp(t, cue(2) - 0.4, cue(2) + 0.8) + ramp(t, cue(3) - 0.4, cue(3) + 0.8));
  const cx = XS[0] + (XS[1] - XS[0]) * prog;
  return (
    <AbsoluteFill>
      {/* kartu kaca (di belakang ikon) */}
      {ITEMS.map((it, i) => {
        const {p, active, o} = state[i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: XS[i] - 235,
              top: 360,
              width: 470,
              height: 470,
              borderRadius: 28,
              opacity: o,
              translate: `0px ${(1 - ramp(p, 0, 1, BACK)) * 18}px`,
              border: '1.2px solid transparent',
              background: `linear-gradient(170deg, rgba(24,26,70,${active ? 0.72 : 0.5}), rgba(8,9,30,0.55)) padding-box, linear-gradient(150deg, ${it.color}${active ? 'cc' : '55'}, transparent 55%, ${C.pink}44) border-box`,
              boxShadow: active ? `0 24px 70px rgba(0,0,12,0.5), 0 0 46px ${it.color}2e` : '0 18px 50px rgba(0,0,12,0.35)',
            }}
          >
            <div style={{position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center'}}>
              <div style={{fontFamily: FONT.sans, fontSize: 17, letterSpacing: 6, fontWeight: 600, color: it.color, textTransform: 'uppercase', opacity: 0.85}}>Bagian {it.n}</div>
              <div style={{fontFamily: FONT.display, fontSize: 46, color: C.ink, marginTop: 8, lineHeight: 1.05}}>{it.title}</div>
              <div style={{width: 60 * p, height: 1, margin: '18px auto 14px', background: `linear-gradient(90deg, transparent, ${it.color}, transparent)`}} />
              {it.sub.map((s, k) => {
                const q = ramp(t, cue(i + 1) + 0.4 + k * 0.4, cue(i + 1) + 1.3 + k * 0.4);
                return (
                  <div key={k} style={{fontFamily: FONT.sans, fontSize: 28, color: C.muted, lineHeight: 1.5, opacity: Math.max(q, 0.0), translate: `0px ${(1 - q) * 8}px`}}>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <Stage>
        {/* rasi penghubung */}
        <Chalk d={`M${XS[0]},${OY} C${XS[0] + 180},${OY - 60} ${XS[1] - 180},${OY - 60} ${XS[1]},${OY} C${XS[1] + 180},${OY - 60} ${XS[2] - 180},${OY - 60} ${XS[2]},${OY}`} p={tiga} color={C.lilac} width={2.4} opacity={0.7} />
        {tiga > 0.98 && prog > 0.01 && prog < 1.99 ? (
          <Spark x={cx} y={OY - 45 * Math.sin(Math.PI * (prog % 1))} r={7} color={C.yellow} />
        ) : null}
        {ITEMS.map((it, i) => {
          const {p, active, o} = state[i];
          const x = XS[i];
          return (
            <g key={i} opacity={o}>
              <Halo x={x} y={OY} r={active ? 120 : 70} color={it.hue} />
              <circle cx={x} cy={OY} r={34} fill={C.bg} stroke={it.color} strokeWidth={2.4} />
              <circle cx={x} cy={OY} r={44 + 4 * Math.sin(t * 2 + i)} fill="none" stroke={it.color} strokeWidth={1} opacity={0.5} strokeDasharray="3 7" />
              <text x={x} y={OY + 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.display} fontSize={44} fill={it.color}>
                {it.n}
              </text>
              {/* ikon di dalam kartu */}
              <g transform={`translate(0 ${(1 - ramp(p, 0, 1, BACK)) * 18})`}>
                {i === 0 ? (
                  <g>
                    <Chalk d={`M${x - 120},430 V560 H${x + 120} V430`} color={C.ink} width={4} p={p} />
                    <WaveLine x0={x - 120} x1={x + 120} f={(u) => 505 - 46 * Math.sin(2 * Math.PI * u) * Math.cos(t * 3)} color={it.color} width={4} p={p} />
                  </g>
                ) : i === 1 ? (
                  <g opacity={p}>
                    {[0, 1, 2, 3, 4].map((k) => (
                      <Bond key={k} x1={x - 125 + k * 50} y1={k % 2 ? 470 : 510} x2={x - 125 + (k + 1) * 50} y2={(k + 1) % 2 ? 470 : 510} order={k % 2 ? 1 : 2} width={3.4} />
                    ))}
                    {[0, 1, 2, 3, 4, 5].map((k) => (
                      <Atom key={k} x={x - 125 + k * 50} y={k % 2 ? 470 : 510} el="C" r={12} label={null} />
                    ))}
                    {/* elektron pi berlari di sepanjang rantai */}
                    <Spark x={x - 125 + 250 * (0.5 + 0.5 * Math.sin(t * 1.6))} y={490 - 30} r={6} color={C.green} />
                  </g>
                ) : (
                  <g opacity={p}>
                    <LedBulb x={x} y={520} s={0.95} on={0.6 + 0.4 * Math.sin(t * 3)} color={C.blue} />
                  </g>
                )}
              </g>
            </g>
          );
        })}
      </Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: head, pointerEvents: 'none'}}>
        <div style={{fontFamily: FONT.display, fontSize: 70, color: C.ink, lineHeight: 1}}>
          Peta <span style={{fontStyle: 'italic', color: C.yellow}}>perjalanan</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
