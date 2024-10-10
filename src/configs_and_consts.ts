import {
  BBDictionary,
  PhraseWordNum,
  StartConfig,
  StimTaskIntSetting,
  SVGObjStyle,
  TaskInfo,
  XYCoord,
} from "./interfaces"

import {
  PRIMARY_COLOR,
  PRIMARY_VARIANT_1_COLOR,
  PRIMARY_VARIANT_2_COLOR,
} from "./color_scheme"


export function openFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    (elem as any).msRequestFullscreen();
  }
}

export function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) { /* Safari */
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) { /* IE11 */
    (document as any).msExitFullscreen();
  }
}

export function getDefaultStartConfig(): StartConfig {
  return {
    mode: "Study",
    interval: "3s",
    TR: "750ms",
    start_delay_s: 5,
  }
}

export const CURR_BODY_SVG_STYLE: SVGObjStyle = {
  stroke: "#000000",
  fill: "none",
  "stroke-width": 1.5,
}

export const NEXT_BODY_SVG_STYLE: SVGObjStyle = {
  stroke: "#b5b5b5",
  fill: "none",
  "stroke-width": 1.5,
}

export function deepcopy(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}

export const BB_3s: StimTaskIntSetting = {
  expected_task_interval_s: 3,
  expected_TR_s: 0.75,
  front_space_padding_s: 6,
  back_space_padding_s: 12,
  num_space_between_words: 1,
  num_space_between_sents: 2,
}

export const BB_1s5: StimTaskIntSetting = {
  expected_task_interval_s: 1.5,
  expected_TR_s: 0.75,
  front_space_padding_s: 6,
  back_space_padding_s: 12,
  num_space_between_words: 2,
  num_space_between_sents: 3,
}

export function shuffle(arr_in: any[], inplace: boolean = false) {
  let arr: any[]
  if (inplace) {
    arr = arr_in
  } else {
    arr = JSON.parse(JSON.stringify(arr_in));
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr
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
  ["tickets", "are", "very", "expensive"]
]

type StyleObj = SVGObjStyle;

export function obj_to_style_str(obj: Object) {
  const str_list: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    str_list.push(`${key}:${value};`);
  }
  return str_list.join('');
}

export function generateTaskUpdateSequence(stim_phrases: string[][], task_settings: StimTaskIntSetting = BB_3s): TaskInfo {
  const NUM_FRONT_SPACE = Math.ceil(task_settings.front_space_padding_s / task_settings.expected_task_interval_s)
  const NUM_BACK_SPACE = Math.ceil(task_settings.back_space_padding_s / task_settings.expected_task_interval_s)
  const curr_l_list: string[] = new Array(NUM_FRONT_SPACE).fill('space')
  const curr_word_text_list: PhraseWordNum[] = new Array(NUM_FRONT_SPACE).fill({ phrase_n: -1, word_n: -1 })
  const curr_l_in_word_ind_list: number[] = new Array(NUM_FRONT_SPACE).fill(-1)
  for (const [phrase_i, phrase] of stim_phrases.entries()) {
    for (let [word_i, word] of phrase.entries()) {
      for (let letter_i = 0; letter_i < word.length; letter_i++) {
        const letter = word[letter_i];
        curr_l_list.push(letter);
        curr_word_text_list.push({ phrase_n: phrase_i, word_n: word_i });
        curr_l_in_word_ind_list.push(letter_i);
      }
      curr_l_list.push(...new Array(task_settings.num_space_between_words).fill('space'))
      curr_word_text_list.push(...new Array(task_settings.num_space_between_words).fill(''))
      curr_l_in_word_ind_list.push(...new Array(task_settings.num_space_between_words).fill(-1))
    }
    const num_extra_space = task_settings.num_space_between_words - task_settings.num_space_between_words
    curr_l_list.push(...new Array(num_extra_space).fill('space'))
    curr_word_text_list.push(...new Array(num_extra_space).fill(''))
    curr_l_in_word_ind_list.push(...new Array(num_extra_space).fill(-1))
  }
  const num_extra_space_end = NUM_BACK_SPACE - task_settings.num_space_between_words
  curr_l_list.push(...new Array(num_extra_space_end).fill('space'))
  curr_word_text_list.push(...new Array(num_extra_space_end).fill(''))
  curr_l_in_word_ind_list.push(...new Array(num_extra_space_end).fill(-1))
  const next_l_list = curr_l_list.slice(1);
  next_l_list.push('space')
  const out_seq = {
    curr_l_list: curr_l_list,
    curr_word_text_list: curr_word_text_list,
    next_l_list: next_l_list,
    curr_l_in_word_ind_list: curr_l_in_word_ind_list,
  };
  return { ...out_seq, ...task_settings };

}

export const SVG_WIDTH = 360
export const SVG_HEIGHT = 400
export const BETWEEN_BODY_SPACING = 8
export const BODY_SVG_TO_EDGE_SPACING = 6

function* id_gen(prefix: string) {
  let id_num = 0;
  while (true) {
    id_num++
    yield `${prefix}_${id_num}`;
  }
}

let id_dict = {};
export function get_id(prefix: string = "id") {
  if (!(prefix in id_dict)) {
    id_dict[prefix] = id_gen(prefix);
  }
  return id_dict[prefix].next().value;
}

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

export const default_braille_dictionary: BBDictionary = {
  'space': [0, 0, 0, 0, 0, 0],
  'a': [1, 0, 0, 0, 0, 0],
  'b': [1, 0, 1, 0, 0, 0],
  'c': [1, 1, 0, 0, 0, 0],
  'd': [1, 1, 0, 1, 0, 0],
  'e': [1, 0, 0, 1, 0, 0],

  'f': [1, 1, 1, 0, 0, 0],
  'g': [1, 1, 1, 1, 0, 0],
  'h': [1, 0, 1, 1, 0, 0],
  'i': [0, 1, 1, 0, 0, 0],
  'j': [0, 1, 1, 1, 0, 0],

  'k': [1, 0, 0, 0, 1, 0],
  'l': [1, 0, 1, 0, 1, 0],
  'm': [1, 1, 0, 0, 1, 0],
  'n': [1, 1, 0, 1, 1, 0],
  'o': [1, 0, 0, 1, 1, 0],

  'p': [1, 1, 1, 0, 1, 0],
  'q': [1, 1, 1, 1, 1, 0],
  'r': [1, 0, 1, 1, 1, 0],
  's': [0, 1, 1, 0, 1, 0],
  't': [0, 1, 1, 1, 1, 0],

  'u': [1, 0, 0, 0, 1, 1],
  'v': [1, 0, 1, 0, 1, 1],
  'w': [0, 1, 1, 1, 0, 1],
  'x': [1, 1, 0, 0, 1, 1],
  'y': [1, 1, 0, 1, 1, 1],

  'z': [1, 0, 0, 1, 1, 1]
};

export const default_braille_moded_dictionary: BBDictionary = {
  'space': [0, 0, 0, 0, 0, 0],

  'a': [0, 0, 0, 0, 1, 0],
  'b': [1, 0, 1, 0, 0, 0],
  'c': [1, 0, 0, 1, 0, 0],
  'd': [1, 1, 0, 1, 0, 0],
  'e': [0, 1, 0, 0, 0, 0],

  'f': [1, 0, 1, 1, 0, 0],
  'g': [1, 1, 1, 1, 0, 0],
  'h': [0, 0, 1, 0, 0, 0],
  'i': [1, 0, 0, 0, 0, 0],
  'j': [0, 1, 1, 1, 0, 0],

  'k': [1, 0, 0, 0, 1, 0],
  'l': [1, 0, 1, 0, 1, 0],
  'm': [1, 0, 0, 1, 1, 0],
  'n': [0, 0, 0, 1, 1, 0],
  'o': [0, 0, 0, 1, 0, 0],

  'p': [0, 0, 1, 1, 1, 0],
  'q': [1, 1, 1, 1, 1, 0],
  'r': [0, 1, 1, 0, 1, 0],
  's': [1, 0, 1, 1, 0, 1],
  't': [0, 0, 0, 0, 0, 1],

  'u': [1, 0, 0, 0, 1, 1],
  'v': [1, 0, 1, 0, 1, 1],
  'w': [0, 1, 1, 1, 0, 1],
  'x': [1, 0, 0, 1, 1, 1],
  'y': [0, 1, 0, 1, 1, 1],

  'z': [1, 1, 0, 0, 1, 1]
};

export const final_BrainBraille_dictionary: BBDictionary = {
  'space': [0, 0, 0, 0, 0, 0],

  'a': [1, 0, 0, 0, 0, 0],
  'b': [0, 0, 1, 1, 0, 0],
  'c': [0, 1, 0, 0, 0, 1],
  'd': [0, 0, 1, 0, 1, 0],
  'e': [0, 1, 0, 0, 0, 0],

  'f': [0, 1, 0, 1, 0, 0],
  'g': [1, 1, 0, 0, 0, 0],
  'h': [0, 0, 0, 1, 1, 0],
  'i': [0, 0, 1, 0, 0, 0],
  'j': [0, 0, 1, 1, 1, 0],

  'k': [1, 0, 0, 1, 0, 1],
  'l': [0, 0, 0, 0, 1, 1],
  'm': [0, 0, 1, 0, 0, 1],
  'n': [0, 0, 0, 1, 0, 0],
  'o': [0, 0, 0, 0, 1, 0],

  'p': [1, 0, 1, 0, 0, 0],
  'q': [0, 0, 1, 1, 0, 1],
  'r': [0, 0, 0, 1, 0, 1],
  's': [1, 0, 0, 1, 0, 0],
  't': [0, 0, 0, 0, 0, 1],

  'u': [0, 1, 0, 0, 1, 0],
  'v': [1, 0, 0, 0, 1, 0],
  'w': [1, 0, 0, 0, 0, 1],
  'x': [1, 0, 1, 1, 0, 0],
  'y': [0, 1, 1, 0, 0, 0],

  'z': [0, 1, 1, 1, 0, 0]
};

export class BrainBrailleStim {
  container_div: HTMLElement;
  curr_text: SVGTextElement;
  next_text: SVGTextElement;
  curr_word: SVGTextElement;
  curr_index: SVGTextElement;
  curr_l_in_word_ind: number;
  curr_dots: (HTMLElement | null)[];
  next_dots: (HTMLElement | null)[];
  bb_dict: BBDictionary;
  curr_text_fill: string;
  next_text_fill: string;


  constructor(container_div: HTMLElement, curr_text: SVGTextElement,
    next_text: SVGTextElement, curr_word: SVGTextElement,
    curr_index: SVGTextElement, curr_dots: (HTMLElement | null)[],
    next_dots: (HTMLElement | null)[],
    bb_dict: BBDictionary = final_BrainBraille_dictionary,
    curr_text_fill: string = "#000000",
    next_text_fill: string = "#b5b5b5") {

    this.container_div = container_div;
    this.curr_text = curr_text;
    this.next_text = next_text;
    this.curr_word = curr_word;
    this.curr_index = curr_index;
    this.curr_dots = curr_dots;
    this.next_dots = next_dots;
    this.curr_l_in_word_ind = 0;
    this.bb_dict = bb_dict;
    this.curr_text_fill = curr_text_fill;
    this.next_text_fill = next_text_fill;

  }

  update(curr_l: string, next_l: string, curr_word_text: string, curr_l_in_word_ind: number, curr_index_str: string) {
    this.curr_text.innerHTML = curr_l;
    if (curr_l.length > 0) {
      this.curr_text.setAttribute("fill", this.curr_text_fill);
    }
    const curr_l_dots: number[] = this.bb_dict[curr_l];
    for (let i = 0; i < this.curr_dots.length; i++) {
      if (curr_l_dots[i] === 1) {
        this.curr_dots[i]!.setAttribute("fill", `url(#curr_${i})`)
      } else {
        this.curr_dots[i]!.setAttribute("fill", "None")
      }
    }

    this.next_text.innerHTML = next_l;
    if (next_l.length > 0) {
      this.next_text.setAttribute("fill", this.next_text_fill);
    }

    const next_l_dots: number[] = this.bb_dict[next_l];
    for (let i = 0; i < this.next_dots.length; i++) {
      if (next_l_dots[i] === 1) {
        this.next_dots[i]!.setAttribute("fill", `url(#next_${i})`)
      } else {
        this.next_dots[i]!.setAttribute("fill", "None")
      }
    }

    if (curr_word_text.length > 0) {
      this.curr_word.setAttribute("fill", this.next_text_fill);
      this.curr_word.innerHTML = `${curr_word_text.substring(0, curr_l_in_word_ind)}<tspan fill=${this.curr_text_fill}>${curr_word_text[curr_l_in_word_ind]}</tspan>${curr_word_text.substring(curr_l_in_word_ind + 1)}`
    } else {
      this.curr_word.innerHTML = ""
    }
    if (curr_index_str) {
      this.curr_index.innerHTML = curr_index_str;
    }
  }
}

export function start_config_from_url() {
  const params: URLSearchParams = new URLSearchParams(window.location.search);
  const start_config: StartConfig = getDefaultStartConfig();
  switch (params.get("mode")) {
    case "Practice":
      start_config.mode = "Practice"
      break;
    case "Study":
      start_config.mode = "Study"
      break;
    default:
  }

  switch (params.get("interval")) {
    case "3s":
      start_config.interval = "3s"
      break;
    case "1.5s":
      start_config.interval = "1.5s"
      break;
    default:
  }

  switch (params.get("TR")) {
    case "750ms":
      start_config.TR = "750ms"
      break;
    case "500ms":
      start_config.TR = "500ms"
      break;
    case "n/a":
      start_config.TR = "N.A."
    default:
  }
  let params_start_delay_s = params.get("start_delay_s")
  if (params_start_delay_s) {
    start_config.start_delay_s = parseFloat(params_start_delay_s)
  }
  return start_config;
}


export function genColorDefs(colors: string[], id_prefix: string, stop_opacity: number = 1, stop_offset: number = 0.2) {
  const color_def_str_arr = ['<defs>'];
  for (let i = 0; i < colors.length; i++) {
    const rad_grad_str = `<radialGradient id="${id_prefix}_${i}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">\n<stop offset="${stop_offset}" style="stop-color:${colors[i]};stop-opacity:${stop_opacity}" />\n<stop offset="${1 - stop_offset}" style="stop-color:rgb(255,255,255);stop-opacity:0" />\n</radialGradient>`;
    color_def_str_arr.push(rad_grad_str);
  }
  color_def_str_arr.push("</defs>");
  return color_def_str_arr.join("\n");
}

export function getSvgGBody(prefix: string = "id") {
  const svg_g_body_text = `<g transform="matrix(2.0000001,0,0,2.0000001,1.7743231,0.23161151)" id="${get_id('svg')}">
    <path id="${get_id('path')}" d="m 66.228231,198.37588 c -0.590026,-0.65878 -0.589257,-0.64999 -0.224893,-2.57209 0.359051,-1.89406 0.810047,-2.87574 1.974482,-4.29776 l 0.93887,-1.14656 0.187266,-3.3156 c 0.207926,-3.68142 -0.01963,-12.63779 -0.392481,-15.44713 -0.132321,-0.99702 -0.306089,-5.07572 -0.386155,-9.06378 l -0.145573,-7.25103 1.174247,-4.74106 1.174245,-4.74105 0.180645,-6.41437 c 0.09936,-3.52791 0.266757,-6.63432 0.372012,-6.90316 0.229322,-0.58573 -0.35297,-4.16589 -0.724931,-4.45717 -0.143913,-0.11268 -0.587231,-0.20681 -0.985151,-0.20916 l -0.723493,-0.004 0.148236,-6.62354 c 0.136931,-6.11832 0.777565,-14.7576 1.442462,-19.45227 0.152066,-1.07372 0.366375,-3.395431 0.476243,-5.159383 0.219478,-3.523761 1.109533,-8.543512 2.245362,-12.663426 1.322123,-4.795659 1.478937,-6.193064 1.536405,-13.691268 0.04889,-6.378503 0.0063,-7.185804 -0.500355,-9.481686 -1.243162,-5.633393 -2.890287,-10.172357 -3.872807,-10.672192 -0.298346,-0.151783 -1.634692,-0.62204 -2.969654,-1.045032 l -2.427211,-0.769081 -1.437189,0.573111 c -3.428357,1.367121 -8.461401,2.553102 -12.655764,2.982177 -2.968548,0.303674 -4.53547,0.592474 -5.321891,0.980882 -0.613024,0.302768 -2.087812,0.822502 -3.277309,1.154962 -1.944914,0.543598 -3.106018,0.623894 -11.529404,0.797403 -10.14822,0.20904 -10.346689,0.237986 -13.033551,1.900884 -1.752083,1.084361 -4.915454,2.029637 -7.004923,2.093208 C 8.9795706,58.781931 8.7407228,58.71562 8.3911366,58.16032 8.0162682,57.564904 7.8316339,57.532829 4.7793785,57.532829 c -1.7691817,0 -3.4953943,-0.118307 -3.83602708,-0.262913 -0.72528914,-0.308136 -1.0766519,-1.271248 -0.66548962,-1.824395 0.37178337,-0.500182 2.9985751,-1.443877 5.4847545,-1.970462 1.0754992,-0.227794 2.6231563,-0.658912 3.4392388,-0.958033 0.8160809,-0.29913 2.3743089,-0.725264 3.4627269,-0.946974 4.695781,-0.956524 9.519988,-2.205243 10.442856,-2.703083 0.548132,-0.295695 1.205874,-0.537622 1.461648,-0.537622 0.255776,0 0.801989,-0.194546 1.213807,-0.432321 0.960344,-0.554485 5.265404,-2.229128 7.843781,-3.051186 2.33104,-0.743204 4.33146,-1.143239 7.603717,-1.520575 1.628111,-0.187744 3.058956,-0.57017 4.620897,-1.235046 2.340892,-0.996449 4.811297,-1.766364 8.257205,-2.573398 1.099026,-0.25739 2.740947,-0.701591 3.648715,-0.987112 0.907769,-0.285521 1.876112,-0.519128 2.151875,-0.519128 0.275762,0 0.769446,-0.233172 1.097073,-0.518157 0.651389,-0.566605 3.507754,-2.233884 5.091696,-2.972056 2.166767,-1.009785 3.63617,-1.327634 6.993792,-1.51284 3.387151,-0.186833 3.559609,-0.226689 5.495123,-1.27 2.97863,-1.605586 3.926431,-2.413504 4.601257,-3.922169 l 0.596558,-1.333693 -0.590915,-1.974618 c -0.325004,-1.08604 -0.773821,-2.225616 -0.99737,-2.532391 -1.092669,-1.499451 -1.431931,-4.171972 -1.203699,-9.48211 0.187184,-4.3551157 0.456965,-5.4717645 1.860702,-7.7016038 1.163668,-1.848484 1.65391,-2.3328018 3.226819,-3.187817 2.511534,-1.36524104 6.34725,-0.64742751 8.313675,1.5558179 0.510459,0.5719405 1.31538,1.8868414 1.788704,2.9220022 0.845156,1.8483533 0.864943,1.9717664 1.102984,6.8808337 0.217432,4.483988 0.196767,5.162326 -0.200628,6.587474 -0.243668,0.873812 -0.603169,1.791392 -0.798898,2.03907 -0.644868,0.816024 -1.581198,4.601729 -1.355486,5.480439 0.517949,2.016445 0.884333,2.398469 3.927127,4.094752 l 2.958563,1.649313 3.24711,0.198711 c 4.34587,0.265952 5.86009,0.724796 10.02565,3.037992 1.94228,1.078577 3.71997,1.96105 3.95043,1.96105 0.23046,0 0.64187,0.13317 0.91426,0.295937 0.27238,0.162762 2.09149,0.668154 4.04248,1.123091 4.32547,1.008628 6.70808,1.739752 9.16723,2.81305 1.31833,0.57538 2.79837,0.936979 4.99557,1.220512 3.6068,0.46543 3.86262,0.519292 6.86891,1.446387 1.23639,0.381294 3.16119,0.971819 4.2773,1.31229 1.11612,0.34046 2.54115,0.953929 3.16671,1.363263 0.62557,0.409331 1.30767,0.744236 1.51577,0.744236 0.20808,0 0.75008,0.242634 1.2044,0.539192 0.45433,0.296558 2.28726,0.856852 4.07317,1.245104 6.13108,1.332874 8.24636,1.855549 10.24092,2.530514 1.09903,0.371913 2.72882,0.808249 3.62178,0.969636 3.30775,0.597797 4.99557,1.459951 4.99557,2.551764 0,1.095459 -0.90883,1.367015 -4.57498,1.367015 -3.20356,0 -3.47412,0.04027 -3.58979,0.534154 -0.17365,0.741422 -0.9781,0.898803 -2.98199,0.583409 -2.96133,-0.466104 -3.81641,-0.739726 -5.63411,-1.802878 -3.28042,-1.918708 -4.32921,-2.08799 -13.06764,-2.109219 -9.23958,-0.02245 -12.04119,-0.362595 -14.73764,-1.789302 -0.92687,-0.490421 -3.06914,-0.878112 -7.06065,-1.277779 -1.68572,-0.168786 -3.37173,-0.410322 -3.74668,-0.536725 -1.23753,-0.417227 -2.65632,-0.826222 -4.42842,-1.276598 -0.96165,-0.244404 -2.44709,-0.697048 -3.30098,-1.005875 l -1.55252,-0.561507 -1.93664,0.593223 c -2.12894,0.652134 -3.47651,1.28968 -4.12026,1.949349 -0.64287,0.658754 -2.32036,6.2119 -2.91064,9.635431 -0.7015,4.068455 -1.09685,11.844436 -0.77479,15.238886 0.2445,2.576977 0.59392,4.208044 2.04222,9.532807 0.96619,3.552347 1.93586,9.098209 1.93708,11.078895 5e-4,0.855283 0.16421,2.863259 0.36375,4.462177 1.02483,8.2116 1.93968,20.57556 1.7487,23.63246 -0.15417,2.46739 -0.20417,2.64452 -0.99616,3.5288 -0.50995,0.56936 -0.90335,1.34463 -1.01275,1.99583 -0.0984,0.58565 -0.10689,3.9549 -0.0188,7.4872 0.13845,5.55508 0.26013,6.97702 0.90104,10.52968 0.40754,2.25904 0.91468,4.76042 1.12699,5.5586 0.45581,1.71379 0.52399,9.37349 0.12124,13.62102 -0.46028,4.85426 -0.6532,11.5111 -0.50566,17.44806 l 0.14597,5.87429 1.16984,1.23729 c 0.99692,1.05438 1.23318,1.52012 1.59841,3.15062 0.311,1.38836 0.36696,2.19177 0.20395,2.92829 l -0.22464,1.01498 h -4.99556 -4.99557 l -0.16418,-5.8566 c -0.16282,-5.80817 -0.73442,-13.5494 -1.23284,-16.69626 -0.34244,-2.16204 -1.631462,-7.96267 -1.997185,-8.98739 -0.159098,-0.44576 -0.380174,-1.75172 -0.491278,-2.90213 -0.111105,-1.15041 -0.376211,-3.28388 -0.589122,-4.74106 -0.212919,-1.45717 -0.389134,-4.25481 -0.391598,-6.21695 -0.0047,-3.97932 -0.349155,-6.27936 -1.636161,-10.9345 -0.466481,-1.68725 -1.177062,-4.69923 -1.579079,-6.69326 -0.40202,-1.99403 -0.970288,-4.32969 -1.262827,-5.19035 -0.448412,-1.31925 -0.658509,-1.60506 -1.338712,-1.82113 -0.999809,-0.3176 -1.215276,-1.04252 -1.804822,-6.07213 -0.562623,-4.79979 -0.719107,-5.21707 -1.10255,-2.93984 -0.166718,0.99015 -0.436696,3.29326 -0.599959,5.11804 -0.312062,3.48806 -0.361247,3.60138 -1.697976,3.91215 -0.540266,0.12559 -0.74132,0.45061 -1.174796,1.89908 -0.78164,2.61185 -1.984512,7.93075 -2.410827,10.6603 -0.207191,1.32658 -0.537023,3.12686 -0.732956,4.00064 -0.550893,2.45671 -0.878993,5.13921 -1.149404,9.39746 -0.13637,2.14742 -0.365771,4.34365 -0.509784,4.88049 -0.144011,0.53687 -0.362697,2.16835 -0.485965,3.62553 -0.140531,1.66121 -0.65174,4.31372 -1.370596,7.11157 -1.478063,5.75276 -1.792821,8.50998 -2.133067,18.68534 -0.153871,4.60161 -0.3003,8.68032 -0.3254,9.06378 l -0.04563,0.69722 -4.677853,0.076 c -4.410689,0.0716 -4.706694,0.0436 -5.182898,-0.48805 z"
    />`;
  return svg_g_body_text;
}

export function getSvgDot(id: string, cx: number, cy: number, r: number, fill: string) {
  return `<path id=${id} d="M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 z" stroke="none" fill="${fill}"/>`;
}

export function prepBrainBrailleStim(
  parentElement?: HTMLElement,
  svg_width: number = SVG_WIDTH,
  svg_height: number = SVG_HEIGHT,
  between_body_spacing: number = BETWEEN_BODY_SPACING,
  body_svg_to_edge_spacing: number = BODY_SVG_TO_EDGE_SPACING,
  curr_body_svg_style: SVGObjStyle = CURR_BODY_SVG_STYLE,
  next_body_svg_style: SVGObjStyle = NEXT_BODY_SVG_STYLE,
  dot_radius_ratio: number = DOT_RADIUS_RATIO,
  dot_coord: XYCoord[] = DOT_COORD,
) {
  // Create the div and the svg container for BrainBrailleStim
  const brainbraille_div = document.createElement("div");
  if (typeof parentElement === "undefined") {
    parentElement = document.createElement("div");
    document.body.appendChild(parentElement);
  }
  parentElement.appendChild(brainbraille_div);
  brainbraille_div.className = "brainbraille-div";
  const bb_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  bb_svg.setAttribute("id", get_id("svg"));
  bb_svg.setAttribute("class", "body-svg");
  const SVG_VIEW_PORT_WIDTH = svg_width * 2 + between_body_spacing + 2 * body_svg_to_edge_spacing;
  bb_svg.setAttribute("viewBox", `0 0 ${SVG_VIEW_PORT_WIDTH} ${svg_height}`);
  bb_svg.setAttribute("style", "width: 100%; height: 100%;");
  brainbraille_div.setAttribute("style", "width: 100vw; height: 94vh; padding-top: 3vh; padding-bottom: 3vh;");
  brainbraille_div.appendChild(bb_svg);

  // Create the vertical separator line in the middle
  const vline = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const vline_x = SVG_VIEW_PORT_WIDTH / 2
  vline.setAttribute("x1", `${vline_x}`);
  vline.setAttribute("y1", `${0}`);
  vline.setAttribute("x2", `${vline_x}`);
  vline.setAttribute("y1", `${svg_height}`);
  vline.setAttribute("style", "stroke-width:2.5;stroke:#858585");
  bb_svg.appendChild(vline);

  // Create the Curr letter text
  const curr_text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  curr_text.setAttribute("text-anchor", "end");
  curr_text.setAttribute("x", `${body_svg_to_edge_spacing + svg_width * 29 / 30}`);
  curr_text.setAttribute("y", `${svg_height * 6 / 13}`);
  curr_text.setAttribute("font-size", "4.3vh");
  curr_text.setAttribute("font-family", "Arial, sans-serif");
  curr_text.setAttribute("font-weight", "bold");
  curr_text.setAttribute("fill", `${curr_body_svg_style.stroke}`);
  curr_text.innerHTML = 'Rest';
  bb_svg.appendChild(curr_text);

  // Create the Next letter text
  const next_text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  next_text.setAttribute("text-anchor", "start");
  next_text.setAttribute("x", `${body_svg_to_edge_spacing + svg_width + between_body_spacing + svg_width * 1 / 30}`);
  next_text.setAttribute("y", `${svg_height * 6 / 13}`);
  next_text.setAttribute("font-size", "4.3vh");
  next_text.setAttribute("font-family", "Arial, sans-serif");
  next_text.setAttribute("font-weight", "bold");
  next_text.setAttribute("fill", `${next_body_svg_style.stroke}`);
  next_text.innerHTML = 'Rest';
  bb_svg.appendChild(next_text);

  // Create the Curr word text
  const curr_word = document.createElementNS("http://www.w3.org/2000/svg", "text");
  curr_word.setAttribute("text-anchor", "end");
  curr_word.setAttribute("x", `${body_svg_to_edge_spacing + svg_width * 29 / 30}`);
  curr_word.setAttribute("y", `${svg_height * 7 / 13}`);
  curr_word.setAttribute("font-size", "3vh");
  curr_word.setAttribute("font-family", "Arial, sans-serif");
  curr_word.setAttribute("fill", `${next_body_svg_style.stroke}`);
  curr_word.innerHTML = "";
  bb_svg.appendChild(curr_word);

  // Create the Curr letter index text
  const curr_index = document.createElementNS("http://www.w3.org/2000/svg", "text");
  curr_index.setAttribute("text-anchor", "end");
  curr_index.setAttribute("x", `${body_svg_to_edge_spacing + svg_width * 29 / 30}`);
  curr_index.setAttribute("y", `${svg_height * 1 / 17}`);
  curr_index.setAttribute("font-size", "2vh");
  curr_index.setAttribute("font-family", "Arial, sans-serif");
  curr_index.setAttribute("fill", `${next_body_svg_style.stroke}`);
  curr_index.innerHTML = "";
  bb_svg.appendChild(curr_index);

  // Create the left curr body svg
  const dot_radius = svg_width * dot_radius_ratio;
  const curr_bb_body_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  curr_bb_body_g.setAttribute("class", "bb_curr_body");
  curr_bb_body_g.setAttribute("id", get_id("g"));
  curr_bb_body_g.setAttribute("style", obj_to_style_str(curr_body_svg_style));
  curr_bb_body_g.setAttribute("transform", `translate(${body_svg_to_edge_spacing}, 0)`);
  bb_svg.appendChild(curr_bb_body_g);
  curr_bb_body_g.insertAdjacentHTML('beforeend', getSvgGBody());
  curr_bb_body_g.insertAdjacentHTML('beforeend', genColorDefs(DOT_COLORS, "curr", 1, 0.32));
  const curr_dot_ids: string[] = [];
  for (let i = 0; i < 6; i++) {
    const xy_i = dot_coord[i];
    const id = get_id("dot");
    curr_dot_ids.push(id);
    curr_bb_body_g.insertAdjacentHTML('beforeend', getSvgDot(id, svg_width * xy_i.x, svg_height * xy_i.y, dot_radius, "None"));
  }
  const curr_dot_elements = curr_dot_ids.map(id => document.getElementById(id));

  // Create the right next body svg
  const next_bb_body_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  next_bb_body_g.setAttribute("class", "bb_next_body");
  next_bb_body_g.setAttribute("id", get_id("g"));
  next_bb_body_g.setAttribute("style", obj_to_style_str(next_body_svg_style));
  const next_bb_body_x_offset = between_body_spacing + body_svg_to_edge_spacing + svg_width;
  next_bb_body_g.setAttribute("transform", `translate(${next_bb_body_x_offset}, 0)`);
  bb_svg.appendChild(next_bb_body_g);
  next_bb_body_g.insertAdjacentHTML('beforeend', getSvgGBody());
  next_bb_body_g.insertAdjacentHTML('beforeend', genColorDefs(DOT_COLORS, "next", 0.5, 0.16));
  const next_dot_ids: string[] = [];
  for (let i = 0; i < 6; i++) {
    const xy_i = dot_coord[i];
    const id = get_id("dot");
    next_dot_ids.push(id);
    next_bb_body_g.insertAdjacentHTML('beforeend', getSvgDot(id, svg_width * xy_i.x, svg_height * xy_i.y, dot_radius, "None"));
  }

  const next_dot_elements = next_dot_ids.map(id => document.getElementById(id));

  return new BrainBrailleStim(brainbraille_div, curr_text, next_text, curr_word, curr_index, curr_dot_elements, next_dot_elements);
}

export function delay(time_ms: number, callback: Function | null = null) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (callback) {
          resolve(callback());
        } else {
          resolve(null);
        }
      } catch (err) {
        reject(err);
      }
    }, time_ms)
  })
}

export async function run_study(stim_sequence: string[][], task_info: TaskInfo,
  brainbraille_stim: BrainBrailleStim) {
  console.log("run_study called")
  const task_len = task_info.curr_l_list.length
  let i = 0
  let my_resolve: Function;
  let my_promise = new Promise((resolve) => {
    my_resolve = resolve;
  })
  //Add canceling mechanism

  const on_key_down = (event: KeyboardEvent) => {
    if (event.key === "Escape") {

      document.removeEventListener("keydown", on_key_down);
      my_resolve();
    }
  }
  document.addEventListener("keydown", on_key_down);
  const num_frames_per_stim = Math.ceil(task_info.expected_task_interval_s / task_info.expected_TR_s);
  let frame_per_stim_i = 0;

  document.addEventListener("keypress", on_key_press);
  function update() {
    if (i < task_len) {
      const curr_l = task_info.curr_l_list[i];
      const word_info = task_info.curr_word_text_list[i];
      let curr_word_text: string;
      if (word_info.phrase_n > -1) {
        curr_word_text = stim_sequence[word_info.phrase_n][word_info.word_n];
      } else {
        curr_word_text = "";
      }
      const next_l = task_info.next_l_list[i];
      const curr_l_in_word_ind = task_info.curr_l_in_word_ind_list[i];
      brainbraille_stim.update(curr_l, next_l, curr_word_text, curr_l_in_word_ind, `${i + 1}/${task_len}`);
      i++;
    } else {
      document.removeEventListener("keydown", on_key_down);
      document.removeEventListener("keypress", on_key_press);
      my_resolve();
    }
  }

  function on_key_press(event: KeyboardEvent) {
    if (event.key === "t") {
      frame_per_stim_i++;
      if (frame_per_stim_i === num_frames_per_stim) {
        update();
        frame_per_stim_i = 0;
      }
    }
  }
  update();
  return my_promise;

}

export async function run_practice(stim_sequence: string[][], task_info: TaskInfo,
  brainbraille_stim: BrainBrailleStim) {
  const task_len = task_info.curr_l_list.length;
  let i = 0;
  let interval_id: number;
  let my_resolve: Function;
  let my_promise = new Promise((resolve) => {
    my_resolve = resolve;
  })

  //Add canceling mechanism
  const on_key_down = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      clearInterval(interval_id);
      document.removeEventListener("keydown", on_key_down);
      my_resolve();
    }
  }
  document.addEventListener("keydown", on_key_down);

  function update() {
    if (i < task_len) {
      const curr_l = task_info.curr_l_list[i];
      const word_info = task_info.curr_word_text_list[i]
      let curr_word_text: string;
      if (word_info.phrase_n > -1) {
        curr_word_text = stim_sequence[word_info.phrase_n][word_info.word_n];
      } else {
        curr_word_text = ''
      }
      const next_l = task_info.next_l_list[i];
      const curr_l_in_word_ind = task_info.curr_l_in_word_ind_list[i];
      brainbraille_stim.update(curr_l, next_l, curr_word_text, curr_l_in_word_ind, `${i + 1}/${task_len}`);
      i++;
      // if (i === task_len) {

      // }
    } else {
      if (interval_id) {
        clearInterval(interval_id);
        document.removeEventListener("keydown", on_key_down);
        my_resolve();
      }
    }
  }

  update();
  interval_id = setInterval(update, task_info.expected_task_interval_s * 1000)

  return my_promise
}

function validate_start_config(start_config: StartConfig) {
  if (start_config.mode === "Practice") {
    start_config.TR = "N.A."
    if (start_config.start_delay_s > 30) {
      start_config.start_delay_s = 30;
    } else if (start_config.start_delay_s < 0) {
      start_config.start_delay_s = 0;
    }
  } else if (start_config.mode === "Study") {
    start_config.start_delay_s = 0;
  }
}

export function updateSearchURL(start_config: StartConfig) {
  const curr_url_search_string = window.location.search
  const url_params: URLSearchParams = new URLSearchParams(curr_url_search_string);
  for (const [key, val] of Object.entries(start_config)) {
    url_params.set(key, val);
  }
  if (url_params.toString() !== curr_url_search_string) {
    const new_url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${url_params.toString()}`
    window.history.pushState({ path: new_url }, '', new_url);
  }
}

export function prepControlPanel(start_config: StartConfig,
  parentElement?: HTMLElement) {

  validate_start_config(start_config);
  updateSearchURL(start_config);

  const bb_control_panel_div = document.createElement("div");
  if (typeof parentElement === "undefined") {
    parentElement = document.createElement("div");
    document.body.appendChild(parentElement);
  }
  parentElement.appendChild(bb_control_panel_div);
  bb_control_panel_div.className = "bb-control-panel-div";
  const div_style = {
    "background-color": "#e5e5e5",
    "align-items": "center",
    "display": "flex",
    "justify-content": "center",
    "height": "20vh",
    "position": "relative",
    "top": "40vh",
  }

  const info_panel_style = {
    "background-color": "#efefef",
    "align-items": "center",
    "display": "flex",
    "justify-content": "center",
    "height": "10vh",
    "position": "relative",
    "top": "35vh",
    "font-family": "Arial, sans-serif",
    "font-size": "3em",
  }

  bb_control_panel_div.setAttribute("style", obj_to_style_str(div_style));

  const select_style = {
    "font-size": "1.6em",
    "margin-right": "20px",
    "height": "6vh",
    "font-family": "Arial, sans-serif",
  }

  const input_style = {
    "font-size": "1.6em",
    "margin-right": "20px",
    "height": "5vh",
    "font-family": "Arial, sans-serif",
  }

  const select_label_style = {
    "font-size": "1.6em",
    "font-family": "Arial, sans-serif",
    "margin-right": "6px",
  }

  // Add select mode dropdown
  const select_mode_form = document.createElement("form");
  const select_mode_label = document.createElement("label");
  select_mode_label.setAttribute("for", "modes");
  select_mode_label.innerHTML = "Mode:"
  select_mode_label.setAttribute("style", obj_to_style_str(select_label_style));
  select_mode_form.appendChild(select_mode_label);
  const select_mode = document.createElement("select");
  select_mode.setAttribute("name", "modes");
  select_mode.setAttribute("id", "modes");
  const option_study = document.createElement("option");
  option_study.setAttribute("value", "Study");
  option_study.value = "Study";
  option_study.innerHTML = "Study";
  if (start_config.mode === "Study") {
    option_study.setAttribute("selected", "selected");
  }
  select_mode.appendChild(option_study);
  const option_practice = document.createElement("option");
  option_practice.setAttribute("value", "Practice");
  option_practice.value = "Practice";
  option_practice.innerHTML = "Practice";
  option_practice.innerHTML = "Practice";
  if (start_config.mode === "Practice") {
    option_practice.setAttribute("selected", "selected");
  }
  select_mode.appendChild(option_practice);
  select_mode_form.appendChild(select_mode);
  bb_control_panel_div.appendChild(select_mode_form);

  select_mode.setAttribute("style", obj_to_style_str(select_style));

  // Add select task input interval dropdown
  const select_interval_form = document.createElement("form");
  const select_interval_label = document.createElement("label");
  select_interval_label.setAttribute("for", "interval")
  select_interval_label.innerHTML = "Input Interval:"
  select_interval_label.setAttribute("style", obj_to_style_str(select_label_style))
  select_interval_form.appendChild(select_interval_label)
  const select_interval = document.createElement("select")
  select_interval.setAttribute("name", "interval")
  select_interval.setAttribute("id", "interval")
  const option_3s = document.createElement("option")
  option_3s.setAttribute("value", "3s")
  option_3s.value = "3s"
  option_3s.innerHTML = "3s"
  if (start_config.interval === "3s") {
    option_3s.setAttribute("selected", "selected")
  }
  select_interval.appendChild(option_3s)
  const option_1s5 = document.createElement("option")
  option_1s5.setAttribute("value", "1.5s")
  option_1s5.value = "1.5s"
  option_1s5.innerHTML = "1.5s"
  if (start_config.interval === "1.5s") {
    option_1s5.setAttribute("selected", "selected")
  }
  select_interval.appendChild(option_1s5)
  select_interval_form.appendChild(select_interval)
  bb_control_panel_div.appendChild(select_interval_form)
  select_interval.setAttribute("style", obj_to_style_str(select_style))

  // Add select TR dropdown
  const select_TR_form = document.createElement("form");
  const select_TR_label = document.createElement("label");
  select_TR_label.setAttribute("for", "TR")
  select_TR_label.innerHTML = "fMRI TR:"
  select_TR_label.setAttribute("style", obj_to_style_str(select_label_style))
  select_TR_form.appendChild(select_TR_label)
  const select_TR = document.createElement("select")
  select_TR.setAttribute("name", "TR")
  select_TR.setAttribute("id", "TR")
  const option_500ms = document.createElement("option")
  option_500ms.setAttribute("value", "500ms")
  option_500ms.value = "500ms"
  option_500ms.innerHTML = "500ms"
  const option_750ms = document.createElement("option")
  option_750ms.setAttribute("value", "750ms")
  option_750ms.value = "750ms"
  option_750ms.innerHTML = "750ms"
  const option_na = document.createElement("option")
  option_na.setAttribute("value", "N.A.")
  option_na.value = "N.A."
  option_na.innerHTML = "N.A."
  select_TR.setAttribute("style", obj_to_style_str({ ...select_style, ...{ "width": "100px" } }))

  // Add start delay number input
  const input_delay_s_form = document.createElement("form");
  const input_delay_s_label = document.createElement("label");
  input_delay_s_label.setAttribute("for", "start_delay_s");
  input_delay_s_label.innerHTML = "Start delay(s):";
  input_delay_s_label.setAttribute("style", obj_to_style_str(select_label_style));
  input_delay_s_form.appendChild(input_delay_s_label);
  const input_delay_s = document.createElement("input");
  input_delay_s.setAttribute("type", "number");
  input_delay_s.setAttribute("min", "0");
  input_delay_s.setAttribute("max", "30");
  input_delay_s.setAttribute("step", "5");
  input_delay_s.setAttribute("id", "start_delay_s");
  input_delay_s.setAttribute("style", obj_to_style_str(input_style));
  input_delay_s.setAttribute("value", start_config.start_delay_s.toString());
  input_delay_s.value = start_config.start_delay_s.toString();
  input_delay_s_form.appendChild(input_delay_s_label);
  input_delay_s_form.appendChild(input_delay_s);
  bb_control_panel_div.appendChild(input_delay_s_form);

  // Change options for other input based on mode
  function onModeChange() {
    if (start_config.mode == "Practice") {
      select_TR.disabled = true;
      start_config.TR = "N.A.";
      if (select_TR.contains(option_500ms)) {
        select_TR.removeChild(option_500ms);
      }
      if (select_TR.contains(option_750ms)) {
        select_TR.removeChild(option_750ms);
      }
      select_TR.appendChild(option_na);
      option_na.setAttribute("selected", "selected");
      input_delay_s.disabled = false;
      start_config.start_delay_s = 5;
      input_delay_s.setAttribute("value", start_config.start_delay_s.toString());
      input_delay_s.value = start_config.start_delay_s.toString();
    } else if (start_config.mode == "Study") {
      select_TR.disabled = false;
      if (select_TR.contains(option_na)) {
        select_TR.removeChild(option_na);
      }
      select_TR.appendChild(option_500ms);
      select_TR.appendChild(option_750ms);
      if (start_config.TR === "500ms") {
        option_500ms.setAttribute("selected", "selected");
      } else if (start_config.TR === "750ms") {
        option_750ms.setAttribute("selected", "selected");
      }
      input_delay_s.disabled = true;
      start_config.start_delay_s = 0;
      input_delay_s.setAttribute("value", start_config.start_delay_s.toString());
      input_delay_s.value = start_config.start_delay_s.toString();
    }
  }
  onModeChange();
  select_TR_form.appendChild(select_TR)
  bb_control_panel_div.appendChild(select_TR_form)

  const button_style = {
    "display": "block",
    "height": "6vh",
    "padding-left": "26px",
    "padding-right": "26px",
    "font-size": "2em",
    "cursor": "pointer",
    "text-align": "center",
    "margin-right": "10px",
    "border-radius": "3vh",
    "border": "none",
    "color": "white",
    "font-family": "Arial, sans-serif",
    "background-color": PRIMARY_COLOR,
  }
  const start_button = document.createElement("button");
  start_button.addEventListener("mouseover", () => {
    if (!start_button.disabled) {
      start_button.style.backgroundColor = PRIMARY_VARIANT_1_COLOR;
    }
  })
  start_button.addEventListener('mouseout', () => {
    if (!start_button.disabled) {
      start_button.style.backgroundColor = PRIMARY_COLOR;
    }
  })
  start_button.setAttribute("type", "button");
  start_button.setAttribute("style", obj_to_style_str(button_style));
  start_button.innerHTML = "Start"
  bb_control_panel_div.appendChild(start_button);

  start_button.addEventListener("click", async () => {
    start_button.disabled = true;
    start_button.style.backgroundColor = PRIMARY_VARIANT_2_COLOR;
    openFullscreen();
    let no_abort: boolean = true;
    let info_panel: HTMLElement = document.createElement("div");
    info_panel.setAttribute("id", "info_panel");
    info_panel.setAttribute("style", obj_to_style_str(info_panel_style));
    parentElement.appendChild(info_panel);
    let my_resolve: Function;
    const delay_promise = new Promise((resolve) => {
      my_resolve = resolve;
    })
    if (start_config.mode === "Practice") {
      if ((start_config.start_delay_s >= 0) && (start_config.start_delay_s <= 30)) {
        info_panel.innerHTML = start_config.start_delay_s.toString();
        let curr_count_down_num: number = start_config.start_delay_s;
        const interval_id = setInterval(update_count_down, 1000);
        function update_count_down() {
          curr_count_down_num--;
          if (curr_count_down_num > 0) {
            info_panel.innerHTML = curr_count_down_num.toString();
          } else {
            clearInterval(interval_id);
          }
        }
        let timeout_id = setTimeout(() => {
          my_resolve()
        }, start_config.start_delay_s * 1000)
        document.addEventListener("keydown", on_key_down)
        function on_key_down(event: KeyboardEvent) {
          if (event.key === "Escape") {
            clearTimeout(timeout_id);
            clearInterval(interval_id);
            document.removeEventListener("keydown", on_key_down);
            no_abort = false;
            my_resolve();
          }
        }

      }
      await delay_promise;
    } else if (start_config.mode === "Study") {
      info_panel.innerHTML = "Waiting for fMRI to start!"
      document.addEventListener("keypress", on_key_press);
      document.addEventListener("keydown", on_key_down);

      function on_key_press(event: KeyboardEvent) {
        if (event.key === "t") {
          document.removeEventListener("keypress", on_key_press);
          document.removeEventListener("keydown", on_key_down);
          my_resolve();
        }
      }
      function on_key_down(event: KeyboardEvent) {
        if (event.key === "Escape") {
          document.removeEventListener("keypress", on_key_press);
          document.removeEventListener("keydown", on_key_down);
          no_abort = false;
          my_resolve();
        }
      }
      await delay_promise;
    }

    parentElement.removeChild(info_panel)

    if (no_abort) {
      parentElement.removeChild(bb_control_panel_div);
      const brainbraille_stim = prepBrainBrailleStim(parentElement);
      const stim_sequence = shuffle(STIM_PHASE_SET);

      const default_stim_setting: StimTaskIntSetting = start_config.interval === "3s" ? BB_3s : BB_1s5;
      const task_stim_setting: StimTaskIntSetting = {
        expected_task_interval_s: parseFloat(start_config.interval.substring(0, start_config.interval.length - 1)),
        expected_TR_s: parseFloat(start_config.TR.substring(0, start_config.TR.length - 2)) / 1000,
        front_space_padding_s: default_stim_setting.front_space_padding_s,
        back_space_padding_s: default_stim_setting.back_space_padding_s,
        num_space_between_words: default_stim_setting.num_space_between_words,
        num_space_between_sents: default_stim_setting.num_space_between_sents
      }
      const task_info = generateTaskUpdateSequence(stim_sequence, task_stim_setting);
      if (start_config.mode === "Practice") {
        await run_practice(stim_sequence, task_info, brainbraille_stim);
      } else if (start_config.mode === "Study") {
        await run_study(stim_sequence, task_info, brainbraille_stim);
      }
      parentElement.removeChild(brainbraille_stim.container_div);
      parentElement.appendChild(bb_control_panel_div);
    }
    start_button.disabled = false;
    start_button.style.backgroundColor = PRIMARY_COLOR;
    closeFullscreen();
  })

  select_mode.addEventListener("change", (event: Event) => {
    if (event.target) {
      if ("value" in event.target) {
        if ((event.target.value === "Study") || (event.target.value === "Practice")) {
          start_config.mode = event.target.value
          onModeChange()
        }
      }
    }
    validate_start_config(start_config);
    updateSearchURL(start_config);
  })

  select_interval.addEventListener("change", (event: Event) => {
    if (event.target) {
      if ("value" in event.target) {
        if ((event.target.value === "3s") || (event.target.value === "1.5s")) {
          start_config.interval = event.target.value
        }
      }
    }
    validate_start_config(start_config);
    updateSearchURL(start_config);
  })

  select_TR.addEventListener("change", (event: Event) => {
    if (event.target) {
      if ("value" in event.target) {
        if ((event.target.value === "500ms") || (event.target.value === "750ms")) {
          start_config.TR = event.target.value
        }
      }
    }
    validate_start_config(start_config);
    updateSearchURL(start_config);
  })

  function input_delay_s_update(event: Event) {
    if (event.target) {
      if ("value" in event.target) {
        if (typeof event.target.value === "number") {
          start_config.start_delay_s = event.target.value
        } else if (typeof event.target.value === "string") {
          start_config.start_delay_s = parseFloat(event.target.value)
        }
      }
    }
    validate_start_config(start_config);
    input_delay_s.setAttribute("value", start_config.start_delay_s.toString())
    input_delay_s.value = start_config.start_delay_s.toString();
    updateSearchURL(start_config);
  }
  input_delay_s.addEventListener("change", input_delay_s_update)
}