import { StimTaskIntSetting, TaskInfo } from "./interfaces";
export declare function generateTaskUpdateSequence(stim_phrases: string[][], task_settings?: StimTaskIntSetting): TaskInfo;
export declare function shuffle(arr_in: any[], inplace?: boolean): any[];
export declare function task_info_2_badusb(task_info: TaskInfo): void;
