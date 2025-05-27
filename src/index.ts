import { prepControlPanel, start_config_from_url } from "./svg_manager";
import { ws_connect } from "./comm";

setTimeout(ws_connect, 0);
prepControlPanel(start_config_from_url());

/******************************************************************************
 * esbuild live-reload                                                        *
 ******************************************************************************/
function location_reload() {
  location.reload();
  console.log("Page reloaded");
}
if (!(window as any).IS_PRODUCTION) {
  console.log("IS NOT PRODUCTION");
  new EventSource("/esbuild").addEventListener("change", location_reload);
}
