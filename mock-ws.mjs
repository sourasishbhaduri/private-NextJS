const WS = typeof window !== 'undefined' ? window.WebSocket : (typeof globalThis !== 'undefined' ? globalThis.WebSocket : class {});
export default WS;
export const WebSocket = WS;
