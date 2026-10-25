import React from "react";
import { AbsoluteFill } from "remotion";
import { BACK, EASE_IN_OUT, mix, ramp, win } from "../anim";
import {
  Chalk,
  Formula,
  Frac,
  Label,
  Note,
  Stage,
  Sub,
  Sup,
  V,
} from "../components/primitives";
import { WaveLine } from "../components/illus";
import { useScene } from "../SceneContext";
import { C } from "../theme";

/**
 * Pola kotak 2D sebagai "awan partikel": titik-titik pada kisi, jari-jari ∝ |ψ|,
 * warna menurut tanda ψ (biru +, merah muda −), garis simpul putus-putus.
 */
const Pattern: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  nx: number;
  ny: number;
  p?: number;
  t: number;
}> = ({ x, y, w, h, nx, ny, p = 1, t }) => {
  const cell = 15;
  const cols = Math.max(4, Math.round(w / cell));
  const rows = Math.max(4, Math.round(h / cell));
  const cw = w / cols;
  const ch = h / rows;
  const pulse = 0.88 + 0.12 * Math.cos(t * 3);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const u = (i + 0.5) / cols;
      const v = (j + 0.5) / rows;
      const psi = Math.sin(nx * Math.PI * u) * Math.sin(ny * Math.PI * v);
      const a = Math.abs(psi);
      if (a < 0.08) continue;
      dots.push(
        <circle
          key={`${i}_${j}`}
          cx={x + (i + 0.5) * cw}
          cy={y + (j + 0.5) * ch}
          r={Math.min(cw, ch) * 0.46 * a * pulse}
          fill={psi > 0 ? C.blue : C.pink}
          opacity={0.3 + 0.65 * a * a}
        />,
      );
    }
  const nodes: string[] = [];
  for (let i = 1; i < nx; i++)
    nodes.push(`M${x + (i * w) / nx},${y + 6} V${y + h - 6}`);
  for (let j = 1; j < ny; j++)
    nodes.push(`M${x + 6},${y + (j * h) / ny} H${x + w - 6}`);
  return (
    <g opacity={p}>
      <rect x={x} y={y} width={w} height={h} fill="#0a0b26" opacity={0.55} />
      {dots}
      <Chalk
        d={`M${x},${y} H${x + w} V${y + h} H${x} Z`}
        color={C.ink}
        width={5}
      />
      {nodes.length ? (
        <Chalk d={nodes.join(" ")} color={C.muted} width={2.2} dash="8 9" />
      ) : null}
    </g>
  );
};

/** Kubus 3D berputar pelan; di dalamnya awan |ψ|² untuk keadaan (a, b, c). w = bobot tiap keadaan (crossfade). */
const STATES: [number, number, number][] = [
  [1, 1, 2],
  [1, 2, 1],
  [2, 1, 1],
];
const STATE_COL = [C.blue, C.green, C.pink];
const Cube3D: React.FC<{
  cx: number;
  cy: number;
  s: number;
  t: number;
  p: number;
  w: number[];
}> = ({ cx, cy, s, t, p, w }) => {
  const th = 0.55 + t * 0.32;
  const ph = -0.42;
  const proj = (X: number, Y: number, Z: number): [number, number, number] => {
    const x1 = X * Math.cos(th) + Z * Math.sin(th);
    const z1 = -X * Math.sin(th) + Z * Math.cos(th);
    const y1 = Y * Math.cos(ph) - z1 * Math.sin(ph);
    const z2 = Y * Math.sin(ph) + z1 * Math.cos(ph);
    const k = 1 / (1 + 0.28 * z2);
    return [cx + s * x1 * k, cy + s * y1 * k, z2];
  };
  const V = [-0.5, 0.5];
  const corners: [number, number, number][] = [];
  for (const a of V)
    for (const b of V) for (const c of V) corners.push([a, b, c]);
  const edges: [number, number][] = [];
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const d = corners[i].reduce(
        (acc, v, k) => acc + (v !== corners[j][k] ? 1 : 0),
        0,
      );
      if (d === 1) edges.push([i, j]);
    }
  const N = 9;
  const pts: React.ReactNode[] = [];
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++)
      for (let k = 0; k < N; k++) {
        const u = (i + 0.5) / N;
        const v = (j + 0.5) / N;
        const q = (k + 0.5) / N;
        let tot = 0;
        let col = C.blue;
        let best = 0;
        STATES.forEach(([a, b, c], si) => {
          if (w[si] <= 0.001) return;
          const psi =
            Math.sin(a * Math.PI * u) *
            Math.sin(b * Math.PI * v) *
            Math.sin(c * Math.PI * q);
          const val = w[si] * psi * psi;
          tot += val;
          if (val > best) {
            best = val;
            col = STATE_COL[si];
          }
        });
        if (tot < 0.12) continue;
        const [X, Y, Z] = proj(u - 0.5, v - 0.5, q - 0.5);
        pts.push(
          <circle
            key={`${i}${j}${k}`}
            cx={X}
            cy={Y}
            r={(2 + 9 * tot) * (1 - 0.18 * Z)}
            fill={col}
            opacity={(0.18 + 0.5 * tot) * (1 - 0.35 * Z)}
          />,
        );
      }
  return (
    <g opacity={p}>
      {pts}
      {edges.map(([i, j], n) => {
        const A = proj(...corners[i]);
        const B = proj(...corners[j]);
        const back = (A[2] + B[2]) / 2 > 0.05;
        return (
          <line
            key={n}
            x1={A[0]}
            y1={A[1]}
            x2={B[0]}
            y2={B[1]}
            stroke={back ? C.muted : C.ink}
            strokeWidth={back ? 1.6 : 3}
            strokeDasharray={back ? "6 8" : undefined}
            opacity={back ? 0.6 : 0.95}
          />
        );
      })}
    </g>
  );
};

export const Boxes: React.FC = () => {
  const { t, cue, wordOf } = useScene();
  const pA = win(t, -1, cue(3) - 0.4, 0.5, 0.6);
  const rect = ramp(t, 0.3, 1.4);
  const edges = ramp(t, cue(1), cue(1) + 1.0);
  const fSep = win(t, cue(1) - 0.1, cue(3) - 0.4, 0.7, 0.5);
  const fE2 = win(t, cue(2) - 0.1, cue(3) - 0.4, 0.7, 0.5);
  const pB =
    win(t, cue(3) - 0.2, cue(5) - 0.4, 0.7, 0.6) +
    ramp(t, cue(7) - 0.2, cue(7) + 0.6);
  const sq2 = ramp(t, wordOf(3, "dua", 1) - 0.2, wordOf(3, "dua", 1) + 0.6);
  const lev = ramp(t, wordOf(3, "energi") - 0.3, wordOf(3, "energi") + 0.6);
  const deg = ramp(t, cue(4) - 0.1, cue(4) + 0.7, BACK);
  const pC = win(t, cue(5) - 0.2, cue(7) - 0.4, 0.7, 0.6);
  const cube = ramp(t, cue(5), cue(5) + 1.2);
  const fE3 = ramp(t, cue(6) - 0.1, cue(6) + 0.9);
  const sym = ramp(t, cue(7), cue(7) + 0.8, BACK);
  const stretch = ramp(t, cue(8) + 0.2, cue(8) + 2.2, EASE_IN_OUT);

  const Lx = mix(1, 1.3, stretch);
  const S = 330;
  const E = (nx: number, ny: number) => (nx * nx) / (Lx * Lx) + ny * ny;
  const yE = (e: number) => 820 - e * 62;

  return (
    <AbsoluteFill>
      <Stage>
        {/* A: kotak persegi panjang, fungsi terpisah */}
        {pA > 0.001 && (
          <g opacity={pA}>
            <Pattern
              x={220}
              y={320}
              w={640}
              h={400}
              nx={2}
              ny={1}
              p={rect}
              t={t}
            />
            <g opacity={edges}>
              <WaveLine
                x0={220}
                x1={860}
                f={(u) => 250 - 50 * Math.sin(2 * Math.PI * u)}
                color={C.blue}
                width={4}
              />
              <Label
                x={900}
                y={250}
                size={46}
                font="serif"
                italic
                color={C.blue}
                anchor="start"
              >
                X(x)
              </Label>
              <path
                d={Array.from({ length: 61 }, (_, i) => {
                  const u = i / 60;
                  return `${i ? "L" : "M"}${150 - 50 * Math.sin(Math.PI * u)},${320 + u * 400}`;
                }).join(" ")}
                fill="none"
                stroke={C.green}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Label
                x={110}
                y={780}
                size={46}
                font="serif"
                italic
                color={C.green}
              >
                Y(y)
              </Label>
            </g>
            <Label x={540} y={780} size={44} color={C.muted}>
              <tspan>(n</tspan>
              <tspan fontSize="0.65em" dy="8">
                x
              </tspan>
              <tspan dy="-8">, n</tspan>
              <tspan fontSize="0.65em" dy="8">
                y
              </tspan>
              <tspan dy="-8">) = (2, 1)</tspan>
            </Label>
          </g>
        )}

        {/* B: persegi, degenerasi, lalu diregangkan */}
        {pB > 0.001 && (
          <g opacity={Math.min(1, pB)}>
            <Pattern x={150} y={340} w={S * Lx} h={S} nx={1} ny={2} t={t} />
            <Label x={150 + (S * Lx) / 2} y={760} size={46} color={C.ink}>
              (1, 2)
            </Label>
            <g opacity={sq2}>
              <Pattern
                x={190 + S * Lx}
                y={340}
                w={S * Lx}
                h={S}
                nx={2}
                ny={1}
                t={t}
              />
              <Label
                x={190 + S * Lx + (S * Lx) / 2}
                y={760}
                size={46}
                color={C.ink}
              >
                (2, 1)
              </Label>
            </g>
            {/* diagram energi */}
            <g opacity={lev}>
              <Chalk
                d={`M1260,${yE(E(1, 1))} H1500`}
                color={C.muted}
                width={5}
              />
              <Label
                x={1530}
                y={yE(E(1, 1))}
                size={42}
                color={C.muted}
                anchor="start"
              >
                (1, 1)
              </Label>
              <Chalk
                d={`M1180,${yE(E(1, 2))} H1340`}
                color={C.blue}
                width={5}
              />
              <Chalk
                d={`M1420,${yE(E(2, 1))} H1580`}
                color={C.pink}
                width={5}
              />
              <circle cx={1260} cy={yE(E(1, 2)) - 18} r={11} fill={C.blue} />
              <circle cx={1500} cy={yE(E(2, 1)) - 18} r={11} fill={C.pink} />
              <Label x={1260} y={yE(E(1, 2)) + 40} size={40} color={C.blue}>
                (1, 2)
              </Label>
              <Label x={1500} y={yE(E(2, 1)) + 40} size={40} color={C.pink}>
                (2, 1)
              </Label>
              <Label
                x={1120}
                y={yE(5)}
                size={44}
                font="serif"
                italic
                color={C.ink}
                anchor="end"
                opacity={1 - stretch}
              >
                5
              </Label>
              <Label
                x={1120}
                y={yE(2)}
                size={44}
                font="serif"
                italic
                color={C.ink}
                anchor="end"
                opacity={1 - stretch}
              >
                2
              </Label>
            </g>
          </g>
        )}

        {/* C: kubus, tiga keadaan */}
        {pC > 0.001 && (
          <g opacity={pC}>
            {(() => {
              const w = STATES.map((_, i) => {
                const tin = wordOf(5, "satu") + i * 0.9 - 0.2;
                const on = ramp(t, tin, tin + 0.6);
                const off =
                  i < 2
                    ? ramp(
                        t,
                        wordOf(5, "satu") + (i + 1) * 0.9 - 0.2,
                        wordOf(5, "satu") + (i + 1) * 0.9 + 0.4,
                      )
                    : 0;
                // setelah ketiganya muncul: bergiliran tiap 2 detik
                const after = t > wordOf(5, "satu") + 2.6;
                if (after) {
                  const ph2 = (t - (wordOf(5, "satu") + 2.6)) / 2.0;
                  const idx = Math.floor(ph2) % 3;
                  const f = Math.min(1, (ph2 % 1) / 0.3);
                  const prev = (idx + 2) % 3;
                  return i === idx ? f : i === prev ? 1 - f : 0;
                }
                return on * (1 - off);
              });
              return <Cube3D cx={560} cy={560} s={330} t={t} p={cube} w={w} />;
            })()}
            {["(1, 1, 2)", "(1, 2, 1)", "(2, 1, 1)"].map((s, i) => {
              const p = ramp(
                t,
                wordOf(5, "satu") + i * 0.9 - 0.2,
                wordOf(5, "satu") + i * 0.9 + 0.5,
              );
              return (
                <g key={i} opacity={p}>
                  <circle
                    cx={1180 + i * 180}
                    cy={yE(6 * 0.85) - 18}
                    r={12}
                    fill={[C.blue, C.green, C.pink][i]}
                  />
                  <Label
                    x={1180 + i * 180}
                    y={yE(6 * 0.85) + 40}
                    size={42}
                    color={[C.blue, C.green, C.pink][i]}
                  >
                    {s}
                  </Label>
                </g>
              );
            })}
            <Chalk
              d={`M1100,${yE(6 * 0.85)} H1620`}
              color={C.yellow}
              width={5}
              p={ramp(t, wordOf(5, "satu") - 0.3, wordOf(5, "satu") + 0.5)}
            />
            <Label
              x={1360}
              y={yE(6 * 0.85) - 80}
              size={50}
              color={C.yellow}
              p={ramp(t, wordOf(5, "tiga") - 0.2, wordOf(5, "tiga") + 0.6)}
            >
              tiga sekaligus
            </Label>
          </g>
        )}
      </Stage>

      <Formula
        x={1400}
        y={300}
        p={fSep * (1 - fE2)}
        accent={C.blue}
        caption="fungsi gelombang terpisah"
      >
        <V>ψ</V>(<V>x</V>, <V>y</V>) = <V>X</V>(<V>x</V>) · <V>Y</V>(<V>y</V>)
      </Formula>
      <Formula
        x={1400}
        y={300}
        p={fE2}
        accent={C.yellow}
        caption="kotak dua dimensi"
      >
        <V>E</V> ={" "}
        <Frac
          n={
            <>
              <V>h</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              8<V>m</V>
            </>
          }
        />
        <span style={{ fontSize: "1.2em" }}>(</span>
        <Frac
          n={
            <>
              <V>n</V>
              <Sub>
                <V>x</V>
              </Sub>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              <V>L</V>
              <Sub>
                <V>x</V>
              </Sub>
              <Sup>2</Sup>
            </>
          }
        />{" "}
        +{" "}
        <Frac
          n={
            <>
              <V>n</V>
              <Sub>
                <V>y</V>
              </Sub>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              <V>L</V>
              <Sub>
                <V>y</V>
              </Sub>
              <Sup>2</Sup>
            </>
          }
        />
        <span style={{ fontSize: "1.2em" }}>)</span>
      </Formula>
      <Note
        x={1300}
        y={240}
        text="beda pola, energi sama = terdegenerasi"
        color={C.yellow}
        size={46}
        p={deg}
        opacity={win(t, cue(4) - 0.1, cue(5) - 0.4, 0.7, 0.5)}
      />
      <Formula
        x={1380}
        y={250}
        p={fE3 * pC}
        accent={C.green}
        caption="kubus: (1,1,2), (1,2,1), (2,1,1) setara"
      >
        <V>E</V> ={" "}
        <Frac
          n={
            <>
              <V>h</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              8<V>mL</V>
              <Sup>2</Sup>
            </>
          }
        />
        (<V>n</V>
        <Sub>
          <V>x</V>
        </Sub>
        <Sup>2</Sup> + <V>n</V>
        <Sub>
          <V>y</V>
        </Sub>
        <Sup>2</Sup> + <V>n</V>
        <Sub>
          <V>z</V>
        </Sub>
        <Sup>2</Sup>)
      </Formula>
      <Note
        x={1840}
        y={240}
        text={
          stretch > 0.3
            ? "diregangkan → simetri rusak → tingkat berpisah"
            : "degenerasi lahir dari simetri"
        }
        color={C.green}
        size={44}
        p={sym}
        anchor="right"
      />
    </AbsoluteFill>
  );
};
