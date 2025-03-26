export const DEV_WS_PORT = 8443;
export const PROD_WWS_PORT = 443;
let WS_URL: string;
if (!(window as any).IS_PRODUCTION) {
  WS_URL = `ws://127.0.0.1:${DEV_WS_PORT}/BrainBraille_VisualStim/ws`;
  // WS_URL = `wss://yuhui-lab-server.duckdns.org:${WS_PORT}/BrainBraille_VisualStim/ws`;
} else {
  WS_URL = `wss://yuhui-lab-server.duckdns.org:${PROD_WWS_PORT}/BrainBraille_VisualStim/ws`;
}

export { WS_URL };
