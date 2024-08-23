import { EventEmitter } from "events";

function helloEmitter() {
  const emitter = new EventEmitter();
  setTimeout(() => emitter.emit("complete", "Event Completed"), 1000);

  return emitter;
}

function helloCallback(callback: (error: Error | null, data: string) => void) {
  setTimeout(() => callback(null, "Callback Completed"), 1000);
}

helloEmitter().on("complete", (data) => console.log(data));
helloCallback((error, data) => console.log(error || data));
