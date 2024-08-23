import { readFile } from "fs";
import type { PathOrFileDescriptor } from "fs";

type callback = (err: NodeJS.ErrnoException | null, data?: string) => void;

function readJson(filename: PathOrFileDescriptor, callback: callback) {
  readFile(filename, "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }

    // Error thrown here by parsing invalid JSON
    callback(null, JSON.parse(data));
  });
}

const callback: callback = function callback(error, data) {
  if (error) {
    console.error(error);
  }

  console.log(data);
};

readJson("invalid-json.json", callback);
setTimeout(() => console.log("Another callback"), 1000);

process.on("uncaughtException", (error) => {
  console.log("Here", error);

  /*
  An error is thrown within the callback of an asynchronous function 
  (readFile in this case). Without a try-catch block, the error will jump up the 
  stack trace until reaching the event loop. If an error reaches the event loop, 
  the process will be terminated with a non-zero exit code.

  The `process` will then emit an `uncaughtException` event, which can be used 
  to do some cleanup work or logging before the application terminates.
  
  Without the `process.exit(0)` call, the process will continue. However, it is
  recommended to exit the process after handling the uncaught exception. 
  */
  process.exit(0);
});
