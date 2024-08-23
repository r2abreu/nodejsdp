import { readFile } from "fs";
import { EventEmitter } from "events";
import type { PathOrFileDescriptor } from "fs";

interface EventsMap {
  error: [Error];
  read: [PathOrFileDescriptor];
  match: [PathOrFileDescriptor, string, string];
  start: [PathOrFileDescriptor[]];
}

class RegexFinder extends EventEmitter<EventsMap> {
  private regex: RegExp;
  private files: string[];

  constructor(files: string[], regexPattern: string) {
    super();

    if (!regexPattern) this.emit("error", new Error("No regex provided"));
    this.regex = new RegExp(regexPattern, "g");
    this.files = files;
  }

  find() {
    this.emit("start", this.files);
    for (const file of this.files) {
      readFile(file, "utf-8", (error, data) => {
        if (error) {
          return this.emit("error", error);
        }

        this.emit("read", file);

        const match = data.match(this.regex);

        if (match) {
          match.forEach((element) => this.emit("match", file, element, data));
        }
      });
    }

    return this;
  }
}

const finder = new RegexFinder(["data1.txt", "data2.txt"], process.argv[2]);

finder
  .find()
  .on("start", (files) => console.log("Started", files))
  .on("error", (error) => console.error(error))
  .on("read", (file) => console.log(`${file} was read`))
  .on("match", (file, data) => console.log(`Match on ${file} -> ${data}`));
