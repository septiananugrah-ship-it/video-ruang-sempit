import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, ramp} from './anim';
import {Background, Frame, Vignette} from './components/Background';
import {Captions} from './components/Captions';
import {ChapterHeading} from './components/ChapterHeading';
import {POST, PRE, SceneProvider, useScene} from './SceneContext';
import {SCENES} from './scenes';
import {type VideoProps, defaultVideoProps} from './defaults.ts';
import {FPS, TIMELINE, lineKey, type TScene} from './timeline.ts';
import {C} from './theme';

export {defaultVideoProps, type VideoProps};

// Transisi "portal": adegan lama menjauh & memudar, adegan baru terbuka dari lingkaran
// yang membesar di tengah layar, dengan cincin cahaya toska–magenta di tepinya.
const PORTAL = 0.85; // detik pembukaan portal
const portalR = (q: number) => 1150 * Math.pow(q, 1.35);

const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {t, dur, scene} = useScene();
  const first = scene.index === 0;
  const q = first ? 1 : ramp(t, -0.2, PORTAL - 0.2, (x) => x);
  const leave = ramp(t, dur - 0.55, dur + 0.15, EASE);
  const r = portalR(q);
  // "kamera" mendorong pelan ke depan sepanjang adegan agar gambar terasa hidup
  const drift = 0.016 * Math.max(0, Math.min(1, t / Math.max(1, dur)));
  return (
    <AbsoluteFill
      style={{
        opacity: (first ? ramp(t, 0, 0.6) : 1) * (1 - leave),
        transformOrigin: '50% 47%',
        scale: String(1 + drift + 0.06 * leave + 0.04 * (1 - q)),
        filter: leave > 0.02 ? `blur(${(leave * 10).toFixed(1)}px)` : undefined,
        clipPath: q < 1 ? `circle(${r.toFixed(1)}px at 50% 48%)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SceneSlot: React.FC<{scene: TScene}> = ({scene}) => {
  const Comp = SCENES[scene.id];
  const pre = scene.index === 0 ? 0 : PRE;
  const from = Math.round((scene.start - pre) * FPS);
  const isLast = scene.index === TIMELINE.scenes.length - 1;
  const duration = Math.round((scene.duration + pre + (isLast ? 0 : POST)) * FPS);
  if (!Comp) return null;
  return (
    <Sequence name={`${scene.chapter ? scene.chapter + ' · ' : ''}${scene.title}`} from={from} durationInFrames={duration}>
      <SceneProvider scene={scene} pre={pre}>
        <SceneShell>
          <Comp />
        </SceneShell>
      </SceneProvider>
    </Sequence>
  );
};

/** Cincin portal + partikel yang terlempar di setiap pergantian adegan. */
const Portal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const b = TIMELINE.scenes.slice(1).find((s) => t > s.start - 0.25 && t < s.start + PORTAL);
  if (!b) return null;
  const q = Math.min(1, Math.max(0, (t - (b.start - 0.2)) / PORTAL));
  const r = portalR(q);
  const k = Math.sin(Math.PI * q);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="portal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.green} />
            <stop offset="100%" stopColor={C.pink} />
          </linearGradient>
        </defs>
        <circle cx={960} cy={518} r={r} fill="none" stroke="url(#portal)" strokeWidth={3 + 8 * k} strokeOpacity={0.85 * k} style={{filter: 'drop-shadow(0 0 12px rgba(180,140,255,0.8))'}} />
        <circle cx={960} cy={518} r={r * 0.92} fill="none" stroke={C.blue} strokeWidth={1.5} strokeOpacity={0.4 * k} />
        {Array.from({length: 26}, (_, i) => {
          const a = i * 2.39996;
          const rr = r * (1 + 0.15 * (i % 3)) + 20;
          return <circle key={i} cx={960 + Math.cos(a) * rr} cy={518 + Math.sin(a) * rr * 0.98} r={2 + (i % 3)} fill={i % 2 ? C.green : C.pink} opacity={0.8 * k} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const MusicFade: React.FC<{volume: number}> = ({volume}) => {
  const {durationInFrames} = useVideoConfig();
  useCurrentFrame();
  return <Audio src={staticFile('music.mp3')} volume={(f) => volume * Math.min(1, f / 30) * Math.min(1, (durationInFrames - f) / 60)} />;
};

export const RuangSempit: React.FC<VideoProps> = ({showCaptions, musicVolume, voiceover}) => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <Background />
    {TIMELINE.scenes.map((s) => (
      <SceneSlot key={s.id} scene={s} />
    ))}
    <Portal />
    <Frame />
    <ChapterHeading />
    {showCaptions ? <Captions /> : null}
    <Vignette />
    {musicVolume > 0 ? <MusicFade volume={musicVolume} /> : null}
    {voiceover
      ? TIMELINE.scenes.flatMap((s) =>
          s.tLines.map((l) => (
            <Sequence key={lineKey(s.id, l.index)} name={`VO ${lineKey(s.id, l.index)}`} from={Math.round(l.start * FPS)} layout="none">
              <Audio src={staticFile(`voiceover/${lineKey(s.id, l.index)}.mp3`)} />
            </Sequence>
          )),
        )
      : null}
  </AbsoluteFill>
);

/** Versi 2K (2560×1440): desain 1920×1080 diperbesar sebagai vektor, jadi tetap tajam. */
export const RuangSempit2K: React.FC<VideoProps> = (props) => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${2560 / 1920})`, transformOrigin: '0 0'}}>
      <RuangSempit {...props} />
    </div>
  </AbsoluteFill>
);

/** Pratinjau satu adegan (folder "Adegan" di Studio). */
export const SingleScene: React.FC<{sceneId: string}> = ({sceneId}) => {
  const scene = TIMELINE.scenes.find((s) => s.id === sceneId)!;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Sequence from={-Math.round(scene.start * FPS)} layout="absolute-fill">
        <Background />
        <SceneSlot scene={scene} />
        <Frame />
        <ChapterHeading />
        <Captions />
        <Vignette />
      </Sequence>
    </AbsoluteFill>
  );
};
