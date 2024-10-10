import {
  prepBrainBrailleStim,
  BrainBrailleStim,
  generateTaskUpdateSequence,
  shuffle,
  STIM_PHASE_SET,
  BB_3s,
  BB_1s5,
  run_rask,
  prepControlPanel,
  getDefaultStartConfig,
} from './configs_and_consts'

import {
  StartConfig
} from './interfaces'

// const brainbraille_stim: BrainBrailleStim = prepBrainBrailleStim();
// const stim_sequence = shuffle(STIM_PHASE_SET);
// const task_info = generateTaskUpdateSequence(stim_sequence, BB_3s);
// run_rask(stim_sequence, task_info, brainbraille_stim);
const params: URLSearchParams = new URLSearchParams(window.location.search);
// console.log(params)
let start_config: StartConfig = getDefaultStartConfig();
if (params.size === 3) {
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
}

prepControlPanel(start_config);

/******************************************************************************
 * esbuild live-reload                                                        *
 ******************************************************************************/
function location_reload() {
  location.reload();
  console.log('Page reloaded');
}
if (!(window as any).IS_PRODUCTION) {
  console.log("IS NOT PRODUCTION")
  new EventSource('/esbuild').addEventListener('change', location_reload);
}