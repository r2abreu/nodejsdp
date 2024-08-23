import { EventEmitter } from "events";

interface EventsMap {
  tick: [];
  start: [];
  error: [Error];
}

(function (
  timer: number,
  callback: (error: Error | null, ticks?: number) => void
) {
  const EMITTER = new EventEmitter<EventsMap>();
  const MILLISECONDS_INTERVAL = 50;
  let ticks = 0;
  let elapsedTimeInMilliseconds = 0;
  let intervalID: NodeJS.Timeout;
  const TIMESTAMP_ERROR = new Error("Timestamp is divisile by 5");

  function start() {
    process.nextTick(() => tick());
    intervalID = setInterval(itirate, MILLISECONDS_INTERVAL);
  }

  function itirate() {
    if (elapsedTimeInMilliseconds >= timer) return stop();

    elapsedTimeInMilliseconds += MILLISECONDS_INTERVAL;
    Date.now() % 5 ? tick() : propagateError();
  }

  function tick() {
    EMITTER.emit("tick");
    ticks++;
  }

  function stop() {
    clearInterval(intervalID);
    return callback(null, ticks);
  }

  function propagateError() {
    callback(TIMESTAMP_ERROR, ticks);
    EMITTER.emit("error", TIMESTAMP_ERROR);
  }

  start();

  return EMITTER;
})(1000, (error, result) => {
  if (error) {
    console.error(`Callback: ${error}`);
  } else {
    console.log(`Number of ticks: ${result}`);
  }
})
  .on("tick", () => console.log("Tick"))
  .on("error", (error) => console.error(`Event: ${error}`));
