import { Command } from "commander";
import { StimTaskIntSetting, TaskInfo } from "../src/interfaces";
import { generateTaskUpdateSequence } from "../src/brainbraille_task_prep";
import { prepBrainBrailleStim } from "../src/svg_manager";
import { BB_3s, BB_1s5 } from "../src/configs_and_consts";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { JSDOM } from "jsdom";
import * as path from "node:path";
import puppeteer from "puppeteer";

const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

const program = new Command();

// Set the viewport size

async function renderToImage(
  html: string,
  width: number = VIEWPORT_WIDTH,
  height: number = VIEWPORT_HEIGHT,
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: width, height: height });
  await page.setContent(html);
  const imageBuffer = await page.screenshot({});
  await browser.close();
  return imageBuffer;
}

const cwd: string = process.cwd();
program
  .name("process_stim")
  .description(
    "CLI tool to turn BrainBraille text stimuli or json event file to ",
  );

program
  .command("process_text")
  .description(
    "Take stimuli texts and export to stimuli images and event json files",
  )
  .argument("<text_file_path>", "path to the text file containing the stimuli")
  .option("--input_interval  <number>", "time(s) per letter stimuli", "3")
  .option("--TR  <number>", "Time(ms) between fMRI frames", "750")
  .option("--outDir  <string>", "output directory", "")
  .action(async (file_path, options) => {
    const stim_task_setting: StimTaskIntSetting =
      parseFloat(options.input_interval).toFixed(1) === "3.0" ? BB_3s : BB_1s5;
    const word_delim = " ".repeat(stim_task_setting.num_space_between_words);
    const sent_delim = " ".repeat(stim_task_setting.num_space_between_sents);

    const text_content_buffer = readFileSync(file_path);

    let text = text_content_buffer.toString("utf8");
    let stim_seq: string[][];
    let stim_sents: string[];
    text = text.trim();
    if (text.includes("\n")) {
      stim_sents = text.split("\n");
      stim_seq = stim_sents.map((s) => s.split(" "));
    } else {
      stim_sents = text.split(sent_delim);
      stim_seq = stim_sents.map((s) => s.split(word_delim));
      stim_sents = stim_sents.map((s) => s.replaceAll(word_delim, " "));
    }
    const stimuli_json_text_export = JSON.stringify(stim_sents);

    if (!options.outDir) {
      const text_input_full_path: string = path.resolve(file_path);
      const parsed_path: path.ParsedPath = path.parse(text_input_full_path);
      options.outDir = `${parsed_path.dir}/${parsed_path.name}_images`;
    }

    if (!existsSync(options.outDir)) {
      mkdirSync(options.outDir);
    }
    // console.log(options);

    if (options.TR !== undefined) {
      stim_task_setting.expected_TR_s = parseFloat(options.TR);
    }
    // console.log(stim_task_setting);
    const task_info: TaskInfo = generateTaskUpdateSequence(
      stim_seq,
      stim_task_setting,
    );
    // console.log(task_info);
    const stimuli_txt_export: string = task_info.curr_l_list
      .map((l) => (l === "space" ? " " : l))
      .join("");
    const dom = new JSDOM(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"></head><body><div id="svg_container" style="width:100%;height:100%"></div></body></html>`,
    );
    const document = dom.window.document;
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.innerHTML =
      "html{ width:1920px; height:1080px;} body {width:100%; height:100%; margin:0px; border:0; overflow: hidden; display: block;}";
    head.appendChild(style);
    const svg_parent = document.getElementById("svg_container");
    if (svg_parent === null) {
      return;
    }
    const brainbraille_stim = prepBrainBrailleStim(svg_parent, document);

    let i = 0;
    while (i < task_info.curr_l_list.length) {
      console.log(
        `Generating image for task ${i + 1} out of ${task_info.curr_l_list.length}`,
      );
      const curr_l = task_info.curr_l_list[i];
      const curr_l_char =
        curr_l === "space" ? " ".charCodeAt(0) : curr_l.charCodeAt(0);
      const word_info = task_info.curr_word_text_list[i];
      let curr_word_text: string;
      if (word_info.phrase_n > -1) {
        curr_word_text = stim_seq[word_info.phrase_n][word_info.word_n];
      } else {
        curr_word_text = "";
      }
      const next_l = task_info.next_l_list[i];
      const curr_l_in_word_ind = task_info.curr_l_in_word_ind_list[i];
      brainbraille_stim.update(
        curr_l,
        next_l,
        curr_word_text,
        curr_l_in_word_ind,
        `${i + 1}/${task_info.curr_l_list.length}`,
      );

      writeFileSync(
        `${options.outDir}/test_braille_${String(i + 1).padStart(3, "0")}.png`,
        await renderToImage(document.documentElement.outerHTML),
      );
      i++;
    }
    writeFileSync(`${options.outDir}/stimuli.txt`, stimuli_txt_export);
    writeFileSync(`${options.outDir}/stimuli.json`, stimuli_json_text_export);
  });

program.parse();
