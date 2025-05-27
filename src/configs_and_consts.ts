import { StimTaskIntSetting } from "./interfaces";
import { BBDictionary, XYCoord } from "./interfaces";

export const MAX_RECONNECT = 5;

export function now() {
  return performance.timeOrigin + performance.now();
}

export function deepcopy(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}

export let STIM_PHASE_SET: string[][] = [
  ["do", "not", "worry", "about", "this"],
  ["the", "dog", "will", "bite", "you"],
  ["time", "to", "go", "shopping"],
  ["are", "you", "talking", "to", "me"],
  ["these", "cookies", "are", "so", "amazing"],
  ["want", "to", "join", "us", "for", "lunch"],
  ["quick", "there", "is", "someone", "knocking"],
  ["have", "a", "good", "weekend"],
  ["tickets", "are", "very", "expensive"],
];

export const SVG_WIDTH = 360;
export const SVG_HEIGHT = 400;
export const BETWEEN_BODY_SPACING = 8;
export const BODY_SVG_TO_EDGE_SPACING = 6;

export const DOT_RADIUS_RATIO: number = 1 / 10;
export const DOT_COORD: XYCoord[] = [
  { x: 1 / 2, y: 1 / 11 },
  { x: 1 / 2, y: 6 / 11 },
  { x: 1 / 13, y: 3 / 11 },
  { x: 12 / 13, y: 3 / 11 },
  { x: 2 / 5, y: 22 / 23 },
  { x: 3 / 5, y: 22 / 23 },
];

export const DOT_COLORS: string[] = [
  "rgb(145, 118, 96)",
  "rgb(76, 118, 173)",
  "rgb(192, 76, 84)",
  "rgb(126, 115, 176)",
  "rgb(218, 129, 87)",
  "rgb(91, 166, 106)",
];

export const BB_3s: StimTaskIntSetting = {
  expected_task_interval_s: 3,
  expected_TR_s: 0.75, // This get over-written by the URL search param later
  front_space_padding_s: 6,
  back_space_padding_s: 12,
  num_space_between_words: 1,
  num_space_between_sents: 2,
};

export const BB_1s5: StimTaskIntSetting = {
  expected_task_interval_s: 1.5,
  expected_TR_s: 0.75, // This get over-written by the URL search param later
  front_space_padding_s: 6,
  back_space_padding_s: 12,
  num_space_between_words: 2,
  num_space_between_sents: 3,
};

export const default_braille_dictionary: BBDictionary = {
  space: [0, 0, 0, 0, 0, 0],
  a: [1, 0, 0, 0, 0, 0],
  b: [1, 0, 1, 0, 0, 0],
  c: [1, 1, 0, 0, 0, 0],
  d: [1, 1, 0, 1, 0, 0],
  e: [1, 0, 0, 1, 0, 0],

  f: [1, 1, 1, 0, 0, 0],
  g: [1, 1, 1, 1, 0, 0],
  h: [1, 0, 1, 1, 0, 0],
  i: [0, 1, 1, 0, 0, 0],
  j: [0, 1, 1, 1, 0, 0],

  k: [1, 0, 0, 0, 1, 0],
  l: [1, 0, 1, 0, 1, 0],
  m: [1, 1, 0, 0, 1, 0],
  n: [1, 1, 0, 1, 1, 0],
  o: [1, 0, 0, 1, 1, 0],

  p: [1, 1, 1, 0, 1, 0],
  q: [1, 1, 1, 1, 1, 0],
  r: [1, 0, 1, 1, 1, 0],
  s: [0, 1, 1, 0, 1, 0],
  t: [0, 1, 1, 1, 1, 0],

  u: [1, 0, 0, 0, 1, 1],
  v: [1, 0, 1, 0, 1, 1],
  w: [0, 1, 1, 1, 0, 1],
  x: [1, 1, 0, 0, 1, 1],
  y: [1, 1, 0, 1, 1, 1],

  z: [1, 0, 0, 1, 1, 1],
};

export const default_braille_moded_dictionary: BBDictionary = {
  space: [0, 0, 0, 0, 0, 0],

  a: [0, 0, 0, 0, 1, 0],
  b: [1, 0, 1, 0, 0, 0],
  c: [1, 0, 0, 1, 0, 0],
  d: [1, 1, 0, 1, 0, 0],
  e: [0, 1, 0, 0, 0, 0],

  f: [1, 0, 1, 1, 0, 0],
  g: [1, 1, 1, 1, 0, 0],
  h: [0, 0, 1, 0, 0, 0],
  i: [1, 0, 0, 0, 0, 0],
  j: [0, 1, 1, 1, 0, 0],

  k: [1, 0, 0, 0, 1, 0],
  l: [1, 0, 1, 0, 1, 0],
  m: [1, 0, 0, 1, 1, 0],
  n: [0, 0, 0, 1, 1, 0],
  o: [0, 0, 0, 1, 0, 0],

  p: [0, 0, 1, 1, 1, 0],
  q: [1, 1, 1, 1, 1, 0],
  r: [0, 1, 1, 0, 1, 0],
  s: [1, 0, 1, 1, 0, 1],
  t: [0, 0, 0, 0, 0, 1],

  u: [1, 0, 0, 0, 1, 1],
  v: [1, 0, 1, 0, 1, 1],
  w: [0, 1, 1, 1, 0, 1],
  x: [1, 0, 0, 1, 1, 1],
  y: [0, 1, 0, 1, 1, 1],

  z: [1, 1, 0, 0, 1, 1],
};

export const final_BrainBraille_dictionary: BBDictionary = {
  space: [0, 0, 0, 0, 0, 0],

  a: [1, 0, 0, 0, 0, 0],
  b: [0, 0, 1, 1, 0, 0],
  c: [0, 1, 0, 0, 0, 1],
  d: [0, 0, 1, 0, 1, 0],
  e: [0, 1, 0, 0, 0, 0],

  f: [0, 1, 0, 1, 0, 0],
  g: [1, 1, 0, 0, 0, 0],
  h: [0, 0, 0, 1, 1, 0],
  i: [0, 0, 1, 0, 0, 0],
  j: [0, 0, 1, 1, 1, 0],

  k: [1, 0, 0, 1, 0, 1],
  l: [0, 0, 0, 0, 1, 1],
  m: [0, 0, 1, 0, 0, 1],
  n: [0, 0, 0, 1, 0, 0],
  o: [0, 0, 0, 0, 1, 0],

  p: [1, 0, 1, 0, 0, 0],
  q: [0, 0, 1, 1, 0, 1],
  r: [0, 0, 0, 1, 0, 1],
  s: [1, 0, 0, 1, 0, 0],
  t: [0, 0, 0, 0, 0, 1],

  u: [0, 1, 0, 0, 1, 0],
  v: [1, 0, 0, 0, 1, 0],
  w: [1, 0, 0, 0, 0, 1],
  x: [1, 0, 1, 1, 0, 0],
  y: [0, 1, 1, 0, 0, 0],

  z: [0, 1, 1, 1, 0, 0],
};
