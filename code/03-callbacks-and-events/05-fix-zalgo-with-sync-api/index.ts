import fs from "node:fs";

const cache = new Map();

function consistentReadSync(filename: fs.PathOrFileDescriptor) {
  if (cache.has(filename)) {
    return cache.get(filename);
  } else {
    const data = fs.readFileSync("data.txt", "utf-8");
    cache.set(filename, data);
    return data;
  }
}

interface FileReader {
  onDataReady: (listener: Function) => FileReader;
  notify: () => FileReader;
}

function createFileReader(filename: string): FileReader {
  const listeners: Array<Function> = [];
  const data = consistentReadSync(filename);

  return {
    onDataReady: function (this: FileReader, listener: Function) {
      listeners.push(listener);
      return this;
    },
    notify: function (this: FileReader) {
      listeners.forEach((listener) => listener(data));
      return this;
    },
  };
}

const reader1 = createFileReader("data.txt");
reader1.onDataReady((data: string) => {
  console.log("First call data", data);

  const reader2 = createFileReader("data.txt");
  reader2.onDataReady((data: string) => [
    console.log("Second call data", data),
  ]);

  reader2.notify();
});
reader1.notify();
