import fs from "node:fs";

const cache = new Map();

function inconsistentRead(
  filename: fs.PathOrFileDescriptor,
  callback: (err: NodeJS.ErrnoException | null, data?: string) => void
) {
  if (cache.has(filename)) {
    // Reading from cache synchronously
    callback(null, cache.get(filename));
  } else {
    // Reading from file asynchronously
    fs.readFile(filename, "utf8", (error, data) => {
      if (error) {
        callback(error);
      }
      cache.set(filename, data);
      callback(null, data);
    });
  }
}

function createFileReader(filename: string) {
  const listeners: Array<Function> = [];
  inconsistentRead(filename, (error, data) => {
    if (error) {
      console.error(error);
    }

    listeners.forEach((listener) => listener(data));
  });

  return {
    onDataReady: (listener: Function) => listeners.push(listener),
  };
}

const reader1 = createFileReader("./data.txt");
reader1.onDataReady((data: string) => {
  console.log(`First subscribed listener -> ${data}`);

  const reader2 = createFileReader("./data.txt");
  reader2.onDataReady((data: string) => {
    console.log(`Second subscribed listener -> ${data}`);
  });
});
