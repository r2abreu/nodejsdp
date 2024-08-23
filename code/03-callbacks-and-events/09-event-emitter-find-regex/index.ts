import { readFile } from "fs";
import type { PathOrFileDescriptor } from "fs";
import { EventEmitter } from "events";

interface EventsMap {
  error: [Error];
  read: [PathOrFileDescriptor];
  match: [PathOrFileDescriptor, string];
}

function findRegex(
  files: Array<PathOrFileDescriptor>,
  regexPattern: string | undefined
): EventEmitter<EventsMap> {
  const emitter = new EventEmitter<EventsMap>();

  if (!regexPattern) {
    emitter.emit("error", new Error("No regex provided"));
    return emitter;
  }

  const regex = new RegExp(regexPattern, "g");

  for (const file of files) {
    readFile(file, "utf-8", (error, data) => {
      if (error) {
        emitter.emit("error", error);
        return emitter;
      }

      emitter.emit("read", file);
      const match = data.match(regex);

      if (match) {
        match.forEach((element) => emitter.emit("match", file, element));
      }
    });
  }
  return emitter;
}

findRegex(["data1.txt", "data2.txt"], process.argv[2])
  .on("error", (error) => console.error(error))
  .on("read", (file) => console.log(`${file} was read`))
  .on("match", (file, data) => console.log(`Match on ${file} -> ${data}`));
