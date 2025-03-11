export const WS_PORT = 8443;
let WS_URL: string;
if (!(window as any).IS_PRODUCTION) {
  WS_URL = `ws://127.0.0.1:${WS_PORT}/BrainBraille_VisualStim/ws`;
} else {
  WS_URL = `ws://yuhui-lab-server.duckdns.org:${WS_PORT}/BrainBraille_VisualStim/ws`;
}

export { WS_URL };
