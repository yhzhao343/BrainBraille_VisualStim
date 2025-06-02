import { PhraseWordNum, StimTaskIntSetting, TaskInfo } from "./interfaces";
import { BB_3s } from "./configs_and_consts";

export function generateTaskUpdateSequence(
  stim_phrases: string[][],
  task_settings: StimTaskIntSetting = BB_3s,
): TaskInfo {
  const NUM_FRONT_SPACE = Math.ceil(
    task_settings.front_space_padding_s /
      task_settings.expected_task_interval_s,
  );
  const NUM_BACK_SPACE = Math.ceil(
    task_settings.back_space_padding_s / task_settings.expected_task_interval_s,
  );
  const curr_l_list: string[] = new Array(NUM_FRONT_SPACE).fill("space");
  const curr_word_text_list: PhraseWordNum[] = new Array(NUM_FRONT_SPACE).fill({
    phrase_n: -1,
    word_n: -1,
  });
  const curr_l_in_word_ind_list: number[] = new Array(NUM_FRONT_SPACE).fill(-1);
  for (const [phrase_i, phrase] of stim_phrases.entries()) {
    for (let [word_i, word] of phrase.entries()) {
      for (let letter_i = 0; letter_i < word.length; letter_i++) {
        const letter = word[letter_i];
        curr_l_list.push(letter);
        curr_word_text_list.push({ phrase_n: phrase_i, word_n: word_i });
        curr_l_in_word_ind_list.push(letter_i);
      }
      curr_l_list.push(
        ...new Array(task_settings.num_space_between_words).fill("space"),
      );
      curr_word_text_list.push(
        ...new Array(task_settings.num_space_between_words).fill(""),
      );
      curr_l_in_word_ind_list.push(
        ...new Array(task_settings.num_space_between_words).fill(-1),
      );
    }
    const num_extra_space =
      task_settings.num_space_between_sents -
      task_settings.num_space_between_words;
    curr_l_list.push(...new Array(num_extra_space).fill("space"));
    curr_word_text_list.push(...new Array(num_extra_space).fill(""));
    curr_l_in_word_ind_list.push(...new Array(num_extra_space).fill(-1));
  }
  const num_extra_space_end =
    NUM_BACK_SPACE - task_settings.num_space_between_words;
  curr_l_list.push(...new Array(num_extra_space_end).fill("space"));
  curr_word_text_list.push(...new Array(num_extra_space_end).fill(""));
  curr_l_in_word_ind_list.push(...new Array(num_extra_space_end).fill(-1));
  const next_l_list = curr_l_list.slice(1);
  next_l_list.push("space");
  const out_seq = {
    curr_l_list: curr_l_list,
    curr_word_text_list: curr_word_text_list,
    next_l_list: next_l_list,
    curr_l_in_word_ind_list: curr_l_in_word_ind_list,
  };
  return { ...out_seq, ...task_settings };
}

export function shuffle(arr_in: any[], inplace: boolean = false) {
  let arr: any[];
  if (inplace) {
    arr = arr_in;
  } else {
    arr = JSON.parse(JSON.stringify(arr_in));
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export function task_info_2_badusb(task_info: TaskInfo) {
  const num_frame = Math.round(
    (task_info.curr_l_list.length * task_info.expected_task_interval_s) /
      task_info.expected_TR_s,
  );
  let bad_usb_script =
    `DEFAULT_STRING_DELAY ${Math.round(task_info.expected_TR_s * 500)}\n` +
    `STRING t\nREPEAT ${num_frame - 1}\n`;
  console.log(bad_usb_script);
}

export function download(content: string, mimeType, filename: string) {
  const a = document.createElement("a"); // Create "a" element
  const blob = new Blob([content], { type: mimeType }); // Create a blob (file-like object)
  const url = URL.createObjectURL(blob); // Create an object URL from blob
  a.setAttribute("href", url); // Set "a" element link
  a.setAttribute("download", filename); // Set download filename
  a.click(); // Start downloading
}
