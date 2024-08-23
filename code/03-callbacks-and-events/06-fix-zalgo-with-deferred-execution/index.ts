import fs from "fs";

const cache = new Map();

function consistentReadAsync(
  filename: fs.PathOrFileDescriptor,
  callback: (err: NodeJS.ErrnoException | null, data?: string) => void
) {
  if (cache.has(filename)) {
    process.nextTick(() => {
      callback(null, cache.get(filename));
    });
  } else {
    fs.readFile(filename, "utf-8", (error, data) => {
      if (error) {
        callback(error);
      }

      cache.set(filename, data);
      callback(null, data);
    });
  }
}

function createFileReader(filename: fs.PathOrFileDescriptor) {
  const listeners: Array<Function> = [];
  consistentReadAsync(filename, (error, data) => {
    if (error) {
      console.error(error);
    }

    listeners.forEach((listener) => listener(data));
  });

  return {
    onDataReady: (listener: Function) => listeners.push(listener),
  };
}

const reader1 = createFileReader("data.txt");
reader1.onDataReady((data: string) => {
  console.log("First call data", data);

  const reader2 = createFileReader("data.txt");
  reader2.onDataReady((data: string) => {
    console.log("Second call data", data);
  });
});
