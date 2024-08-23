import { EventEmitter } from "events";

interface EventsMap {
  tick: [];
}

(function (
  timer: number,
  callback: (error: Error | null, ticks: number) => void
) {
  const EMITTER = new EventEmitter<EventsMap>();
  const MILLISECONDS_INTERVAL = 50;
  let ticks = 0;
  let elapsedTimeInMilliseconds = 0;
  let intervalID: NodeJS.Timeout;

  function start() {
    intervalID = setInterval(itirate, MILLISECONDS_INTERVAL);
  }

  function itirate() {
    if (elapsedTimeInMilliseconds >= timer) return stop();

    elapsedTimeInMilliseconds += MILLISECONDS_INTERVAL;
    tick();
  }

  function tick() {
    EMITTER.emit("tick");
    ticks++;
  }

  function stop() {
    clearInterval(intervalID);
    return callback(null, ticks);
  }

  start();

  return EMITTER;
})(1000, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Number of ticks: ${result}`);
  }
}).on("tick", () => console.log("Tick"));
