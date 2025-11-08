export function runTSPWorker(
  nodes,
  startNode,
  { onProgress, distMatrix } = {}
) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./tspWorker.js", import.meta.url), {
      type: "module",
    });

    const cleanup = () => {
      try {
        worker.terminate();
      } catch (e) {
        console.error(e);
      }
    };

    worker.onmessage = (ev) => {
      const msg = ev.data;
      if (msg.type === "progress") {
        if (typeof onProgress === "function") onProgress(msg.percent, msg.info);
      } else if (msg.type === "result") {
        cleanup();
        resolve(msg.result);
      } else if (msg.type === "error") {
        cleanup();
        reject(new Error(msg.message || "worker error"));
      }
    };

    worker.onerror = (err) => {
      cleanup();
      reject(err);
    };

    worker.postMessage({ nodes, startNode, opt: {}, distMatrix });
  });
}
