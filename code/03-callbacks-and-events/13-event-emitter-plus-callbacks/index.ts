import glob from "glob";

glob("data/*", (error: Error | null, data: string[]) => {
  if (error) {
    console.error(error);
  }

  console.log(`All files matched ${JSON.stringify(data)}`);
}).on("match", (data: string) => console.log(`Match on ${data}`));
