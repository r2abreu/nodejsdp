import { readFileSync } from "fs";
import { EventEmitter } from "events";

import type { PathOrFileDescriptor } from "fs";

interface EventsMap {
  error: [Error];
  read: [PathOrFileDescriptor];
  match: [PathOrFileDescriptor, string, string];
  start: [PathOrFileDescriptor[]];
}

class FindRegexSync extends EventEmitter<EventsMap> {
  private regex: RegExp;
  private files: string[];

  constructor(files: string[], regexPattern: string) {
    super();

    if (!regexPattern) this.emit("error", new Error("No regex provided"));
    this.regex = new RegExp(regexPattern, "g");
    this.files = files;
  }

  addFiles(newFiles: string[]) {
    this.files = this.files.concat(newFiles);
    return this;
  }

  find() {
    for (const file of this.files) {
      let data: string;
      try {
        data = readFileSync(file, "utf-8");
        this.emit("read", file);
      } catch (error) {
        const typedError = error as Error;
        this.emit("error", typedError);
        continue;
      }

      const match = data.match(this.regex);

      if (match) {
        match.forEach((element) => {
          this.emit("match", file, data, element);
          return this;
        });
      }
    }

    return this;
  }
}

const emitter = new FindRegexSync(["data1.txt", "data2.txt"], process.argv[2]);

emitter
  .addFiles(["data1.txt", "data2.txt"])
  .on("error", (error) => console.error(error))
  .on("read", (file) => console.log(`${file} was read`))
  .find()
  // The next line won't run, we are adding the listener after the event was triggered
  .on("match", (file, data, element) =>
    console.log(`"${element}" matched on ${file} file -> ${data}`)
  );
