import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {C, FONT} from '../theme';
import {TIMELINE} from '../timeline.ts';

const TOTAL = TIMELINE.scenes.filter((s) => s.chapter).length;

// Tiga bagian wajib tugas.
export const PARTS: Record<number, {label: string; color: string}> = {
  1: {label: 'Bagian 1 · Prinsip & teori dasar', color: C.blue},
  2: {label: 'Bagian 2 · Implementasi dalam kimia', color: C.green},
  3: {label: 'Bagian 3 · Penerapan di industri', color: C.pink},
};

/** Heading bab: lencana orbit (partikel mengitari nomor bab) + judul; kanan atas: "rasi" kemajuan bab. */
export const ChapterHeading: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scene = TIMELINE.scenes.find((s) => t >= s.start && t < s.end);
  if (!scene || !scene.chapter) return null;
  const lt = t - scene.start;
  const out = 1 - ramp(lt, scene.duration - 0.9, scene.duration - 0.2, EASE_IN_OUT);
  const part = scene.part ? PARTS[scene.part] : {label: 'Penutup', color: C.yellow};
  const pin = ramp(lt, 0, 0.7, BACK);
  const txt = ramp(lt, 0.25, 1.0);
  const a = lt * 2.2;
  const n = Number(scene.chapter);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
      <div style={{position: 'absolute', left: 64, top: 48, display: 'flex', alignItems: 'center', gap: 20}}>
        <svg width={92} height={92} viewBox="-46 -46 92 92" style={{overflow: 'visible', scale: String(pin)}}>
          <circle r={28} fill="rgba(14,16,46,0.75)" stroke={part.color} strokeWidth={1} strokeOpacity={0.7} />
          <ellipse rx={42} ry={14} fill="none" stroke={part.color} strokeWidth={1} strokeOpacity={0.4} transform="rotate(-24)" />
          <g transform="rotate(-24)">
            <circle cx={42 * Math.cos(a)} cy={15 * Math.sin(a)} r={3.6} fill={part.color} style={{filter: `drop-shadow(0 0 6px ${part.color})`}} opacity={Math.sin(a) < 0 ? 0.45 : 1} />
          </g>
          <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={22} fontWeight={400} fill={C.ink}>
            {scene.chapter}
          </text>
        </svg>
        <div style={{opacity: txt, translate: `${(1 - txt) * -14}px 0px`}}>
          <div style={{fontFamily: FONT.sans, fontSize: 15, fontWeight: 600, letterSpacing: 3.2, textTransform: 'uppercase', color: part.color, opacity: 0.9}}>{part.label}</div>
          <div style={{fontFamily: FONT.display, fontSize: 50, fontWeight: 400, color: C.ink, lineHeight: 1.05, marginTop: 2, whiteSpace: 'nowrap', letterSpacing: 0.2}}>{scene.title}</div>
        </div>
      </div>
      {/* rasi kemajuan: satu bintang per bab */}
      <svg width={360} height={40} style={{position: 'absolute', right: 70, top: 66, opacity: ramp(lt, 0.4, 1.0), overflow: 'visible'}}>
        {Array.from({length: TOTAL}, (_, i) => {
          const x = 10 + i * (340 / (TOTAL - 1));
          const y = 20 + 7 * Math.sin(i * 1.7);
          const done = i + 1 <= n;
          const nx = 10 + (i + 1) * (340 / (TOTAL - 1));
          const ny = 20 + 7 * Math.sin((i + 1) * 1.7);
          return (
            <g key={i}>
              {i < TOTAL - 1 ? <line x1={x} y1={y} x2={nx} y2={ny} stroke={i + 1 < n ? part.color : C.faint} strokeWidth={1} strokeOpacity={0.6} /> : null}
              <circle cx={x} cy={y} r={i + 1 === n ? 5.5 : 3.2} fill={done ? part.color : C.faint} style={i + 1 === n ? {filter: `drop-shadow(0 0 6px ${part.color})`} : undefined} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
