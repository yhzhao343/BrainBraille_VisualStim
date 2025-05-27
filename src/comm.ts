import { BBStatusBits, BBMode, BBTIntType } from "./interfaces";

import { WS_URL } from "./config";
import { MAX_RECONNECT, now } from "./configs_and_consts";

// 64bit double timestamp | uint16 curr_l | uint16 index | uint16 status | uint16 fmri_frame_i
//           0                    0               1                2                3
const update_info_payload = new ArrayBuffer(8 + 2 * 4);
const ts_view = new Float64Array(update_info_payload, 0, 1);
const info_view = new Int16Array(update_info_payload, 8, 4);

let socket: WebSocket | undefined;
let reconnect_count = 0;
let reconnect_timeout: null | ReturnType<typeof setTimeout> = null;

export function update_ts_view_ts(timestamp: number) {
  ts_view[0] = timestamp;
}

export function get_ts_view_ts(): number {
  return ts_view[0];
}

export function set_reconnect_count(count: number) {
  reconnect_count = count;
}

export function ws_connect() {
  const params: URLSearchParams = new URLSearchParams(window.location.search);
  const ursi = params.get("ursi");
  const tok = params.get("tok");
  let URL_URSI_list = [`${WS_URL}`];
  if (ursi || tok) {
    URL_URSI_list.push("?");
    if (ursi) {
      URL_URSI_list.push(`ursi=${ursi}`);
      if (tok) {
        URL_URSI_list.push("&");
      }
    }
    if (tok) {
      URL_URSI_list.push(`tok=${tok}`);
    }
  }
  const URL_URSI = URL_URSI_list.join("");

  socket = new WebSocket(URL_URSI);

  socket.addEventListener("open", (event) => {
    console.log(`ws to ${WS_URL} connected!`);
    reconnect_count = 0;
  });

  socket.addEventListener("close", (event) => {
    console.log(
      `ws to ${WS_URL} disconnected! ${reconnect_count}/${MAX_RECONNECT}`,
    );
    if (reconnect_count < MAX_RECONNECT) {
      reconnect_timeout = setTimeout(ws_connect, 2000);
    }
  });

  socket.onerror = (err) => {
    reconnect_count++;
  };

  socket.addEventListener("message", (event) => {
    if (event.data === "Another instance is connected!") {
      reconnect_count = MAX_RECONNECT;
      window.alert(
        "Another instance is connected! Refresh page to take control if you must",
      );
    }
  });
}

export function cancel_ws_reconnect() {
  if (reconnect_timeout) {
    clearTimeout(reconnect_timeout);
    reconnect_count = 0;
  }
}

export function send_event(
  curr_l = 0,
  index = 0,
  isStudy: BBMode = BBMode.Study,
  event:
    | BBStatusBits.Start
    | BBStatusBits.End
    | BBStatusBits.Exit
    | BBStatusBits.Update = BBStatusBits.Update,
  fmri_frame_i = 0,
  update_time = false,
  task_interval: BBTIntType = BBTIntType.TR_3s,
  task_len = 0,
) {
  if (socket?.readyState === WebSocket.OPEN) {
    if (update_time) {
      ts_view[0] = now();
    }
    info_view[0] = curr_l;
    info_view[1] = index;
    info_view[2] =
      (isStudy << BBStatusBits.Study) |
      (1 << event) |
      (task_len << BBStatusBits.TLen) |
      (task_interval << BBStatusBits.TInt);
    info_view[3] = fmri_frame_i;
    socket.send(update_info_payload);
  }
}
