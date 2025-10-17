const WebSocket = require("ws");
const EventEmitter = require("events");

const COMFY_WS_URL = "ws://127.0.0.1:8188/ws";
const RETRY_MS_MIN = 1000;
const RETRY_MS_MAX = 10000;

const emitter = new EventEmitter();
function startComfyBridge() {
  let ws;
  let retry = RETRY_MS_MIN;
  let id;

  const connect = () => {
    ws = new WebSocket(COMFY_WS_URL);

    ws.on("open", () => {
      emitter.on("client_id", (data) => (id = data));
      console.log("[comfy] connected");
      retry = RETRY_MS_MIN;
    });

    ws.on("message", (buf) => {
      let msg;
      try {
        msg = JSON.parse(buf.toString("utf8"));
      } catch (e) {
        console.log(e);
        return;
      }
      const type = msg.type?.toLowerCase?.();
      const data = msg.data || {};

      if (type === "status") {
        emitter.emit("status", data);
      } else if (type === "execution_success")
        emitter.emit("execution_success", data);
    });

    ws.on("close", (code, reason) => {
      console.warn("[comfy] closed", code, reason?.toString() || "");
      setTimeout(connect, retry);
      retry = Math.min(retry * 2, RETRY_MS_MAX);
    });

    ws.on("error", (err) => {
      console.error("[comfy] error:", err.message);
    });
  };

  connect();
}

module.exports = { startComfyBridge, emitter };
