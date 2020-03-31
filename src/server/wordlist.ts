import fs from "fs";
import readline from "readline";

type WordList = {
  [key: string]: number;
};

const wordlist = (filename: string): Promise<WordList> => {
  return new Promise((resolve, reject) => {
    const list: WordList = {};

    const readStream = fs.createReadStream(filename, { encoding: "utf8" });

    var rl = readline.createInterface(
      readStream,
      process.stdout,
      undefined,
      false
    );
    rl.on("line", (line: string) => {
      const word = line.split(" ")[0];
      list[word] = 1;
    })
      .on("error", err => {
        readStream.destroy();
        reject(err);
      })
      .on("close", () => {
        resolve(list);
      });
  });
};

export default wordlist;
