import { readFile } from "fs";
import type { PathOrFileDescriptor } from "fs";

type callback = (err: NodeJS.ErrnoException | null, data?: string) => void;

function readJSON(filename: PathOrFileDescriptor, callback: callback) {
  readFile(filename, "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      const typedError = error as NodeJS.ErrnoException;
      return callback(typedError);
    }

    callback(null, parsed);
  });
}

const callback: callback = function callback(error, data) {
  if (error) {
    console.error(error);
  }

  console.log(data);
};

readJSON("invalid-json.json", callback);