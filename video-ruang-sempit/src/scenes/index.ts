import type React from 'react';
import {Hook} from './Hook';
import {Title} from './Title';
import {Roadmap} from './Roadmap';
import {Free} from './Free';
import {Walls} from './Walls';
import {Ladder} from './Ladder';
import {Where} from './Where';
import {Squeeze} from './Squeeze';
import {Light} from './Light';
import {Boxes} from './Boxes';
import {Polyene} from './Polyene';
import {CarrotScene} from './CarrotScene';
import {Cyanine} from './Cyanine';
import {Finite} from './Finite';
import {Tunnel} from './Tunnel';
import {QDots} from './QDots';
import {Led} from './Led';
import {Flash} from './Flash';
import {Recap} from './Recap';
import {Outro} from './Outro';

// Pemetaan id adegan di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  free: Free,
  walls: Walls,
  ladder: Ladder,
  where: Where,
  squeeze: Squeeze,
  light: Light,
  boxes: Boxes,
  polyene: Polyene,
  carrot: CarrotScene,
  cyanine: Cyanine,
  finite: Finite,
  tunnel: Tunnel,
  qdots: QDots,
  led: Led,
  flash: Flash,
  recap: Recap,
  outro: Outro,
};
