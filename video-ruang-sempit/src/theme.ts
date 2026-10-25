import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/stix-two-text/400.css';
import '@fontsource/stix-two-text/400-italic.css';
import '@fontsource/stix-two-text/600.css';
import '@fontsource/stix-two-text/600-italic.css';

export const W = 1920;
export const H = 1080;

// Palet "Ruang Sempit" — semesta partikel: langit nila-ungu yang dalam,
// nebula toska & magenta, partikel bercahaya. (Sengaja beda dari palet emas–sian video Yayan.)
export const C = {
  bg: '#060716',
  bg2: '#0d0f2a',
  ink: '#eef0ff', // teks utama
  muted: '#9aa0c8',
  faint: '#3b3f6b',
  yellow: '#ffd27a', // aksen hangat (pengganti kuning)
  pink: '#ff6fcf', // magenta nebula
  blue: '#7cc8ff',
  green: '#5ff0cf', // toska aurora
  orange: '#ffa36b',
  lilac: '#b49cff',
  red: '#ff6b84',
  wood: '#6c4ee0',
  woodDark: '#3b2a8a',
  woodLight: '#9a85ff',
};

export type Hue = 'ink' | 'muted' | 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'lilac' | 'red';
export const hue = (h: Hue) => C[h];

export const FONT = {
  display: '"Instrument Serif", "Times New Roman", serif', // judul besar
  hand: '"Manrope", system-ui, sans-serif', // label adegan (nama lama dipertahankan)
  sans: '"Manrope", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  serif: '"STIX Two Text", "Times New Roman", serif', // rumus
};

// Kerangka layar (sudut HUD), dipakai latar & subtitle.
export const FRAME = {side: 0, top: 0, tray: 0};
export const BOARD = {x0: 0, y0: 0, x1: W, y1: H};

// Atom/partikel: bola bercahaya dengan warna khas.
export const ATOM: Record<string, {stroke: string; r: number}> = {
  H: {stroke: '#eef0ff', r: 22},
  C: {stroke: '#9aa0c8', r: 30},
  N: {stroke: '#7cc8ff', r: 30},
  O: {stroke: '#ff6b84', r: 30},
  S: {stroke: '#ffd27a', r: 34},
  Cd: {stroke: '#b49cff', r: 34},
  Se: {stroke: '#ffa36b', r: 34},
};

// Rona nebula per suasana adegan.
export const MOOD_TINT: Record<string, string> = {
  mystery: '#2a1250',
  title: '#3d0f4a',
  wonder: '#0b3346',
  build: '#141b4d',
  quantum: '#2b1660',
  tension: '#401230',
  bright: '#0c3a3a',
  resolve: '#122e45',
  outro: '#1d1446',
};
