export interface StartConfig {
  mode: "Practice" | "Study";
  interval: "3s" | "1.5s";
  TR: "750ms" | "500ms" | "N.A.";
  start_delay_s: number;
}

export interface SVGObjStyle {
  stroke?: string;
  fill?: string;
  "stroke-width"?: number;
}

export interface PhraseWordNum {
  phrase_n: number;
  word_n: number;
}

export interface XYCoord {
  x: number;
  y: number;
}
export interface StimTaskIntSetting {
  expected_task_interval_s: number;
  expected_TR_s: number;
  front_space_padding_s: number;
  back_space_padding_s: number;
  num_space_between_words: number;
  num_space_between_sents: number;
}

export interface TaskInfo {
  expected_task_interval_s: number;
  expected_TR_s: number;
  front_space_padding_s: number;
  back_space_padding_s: number;
  num_space_between_words: number;
  num_space_between_sents: number;
  curr_l_list: string[];
  curr_word_text_list: PhraseWordNum[];
  next_l_list: string[];
  curr_l_in_word_ind_list: number[];
}

export interface BBDictionary {
  'space': number[];
  'a': number[];
  'b': number[];
  'c': number[];
  'd': number[];
  'e': number[];

  'f': number[];
  'g': number[];
  'h': number[];
  'i': number[];
  'j': number[];

  'k': number[];
  'l': number[];
  'm': number[];
  'n': number[];
  'o': number[];

  'p': number[];
  'q': number[];
  'r': number[];
  's': number[];
  't': number[];

  'u': number[];
  'v': number[];
  'w': number[];
  'x': number[];
  'y': number[];

  'z': number[];
}