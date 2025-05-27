import { BBStatusBits, BBMode, BBTIntType } from "./interfaces";
export declare function update_ts_view_ts(timestamp: number): void;
export declare function get_ts_view_ts(): number;
export declare function set_reconnect_count(count: number): void;
export declare function ws_connect(): void;
export declare function cancel_ws_reconnect(): void;
export declare function send_event(curr_l?: number, index?: number, isStudy?: BBMode, event?: BBStatusBits.Start | BBStatusBits.End | BBStatusBits.Exit | BBStatusBits.Update, fmri_frame_i?: number, update_time?: boolean, task_interval?: BBTIntType, task_len?: number): void;
