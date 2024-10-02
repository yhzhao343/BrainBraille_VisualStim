import {dot_colors, gen_color_defs} from './configs_and_consts'  

function draw_background() {
  // var brainbraille_div = document.createElement("div");
  // brainbraille_div.className = "brainbraille-div";

  // const curr_stim_svg = document.getElementById("curr-stim-svg")
  // console.log(curr_stim_svg)
  // curr_stim_svg.insertAdjacentHTML('beforeend', body_svg_text)
  // const body_svg = curr_stim_svg.getElementsByTagName("g")[0]
  // console.log(body_svg)

  // curr_stim_svg.appendChild(body_svg_text)
  // .appendChild(svgDiv);
  console.log(gen_color_defs(dot_colors, 'curr_letter'))
}

draw_background();
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