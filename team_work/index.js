const fs = require("fs");
var getPixels = require("get-pixels");
const { resize } = require("./resize");

const ss = [1, 2, 3, 4].map((i) =>
  fs.createWriteStream(`./output/${i}.txt`)
);

// header
ss.forEach((s) => s.write("v2.0 raw\n"));

const processFile = (fileName) => {
  getPixels(fileName, function (err, pixels) {
    if (err) {
      console.log("Bad image path", err);
      return;
    }

    const data = Array.from({ length: 4 }, () => []);

    const [width, height] = pixels.shape;

    const [w, h] = [width / 2, height / 2];

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const [r, g, b, a] = [0, 1, 2, 3].map((k) => pixels.get(i, j, k));
        const res = (r + g + b) / 3 >= 128 ? 1 : 0;

        let dist;
        if (i < w) {
          dist = j < h ? 0 : 1;
        } else {
          dist = j < h ? 2 : 3;
        }
        data[dist].push(res);
      }
    }
    data.forEach((d, i) => {
      const ret = [];
      for (let i = 0; i < d.length; i += 4) {
        const binary = d.slice(i, i + 4).join("");
        const num = parseInt(binary, 2);
        const hex = num.toString(16);
        ret.push(hex);
      }
      console.log(i)
      for (let j = 0; j < ret.length; j += 8) {
        const r = ret.slice(j, j + 8);
        ss[i].write(r.join("") + "\n");
        console.log(r.join("") + "\n")
      }
      // ss[i].write(ret.join(""));
    });
  });
};

for (let i = 1; i < 300; i++) {
  // resize(`./374549208-1-64_000/374549208-1-64_${String(i).padStart(3, "0")}.jpg`,`./tmp/${i}.jpg`)
  // resize(`./input/hqn ${String(i).padStart(3, "0")}.jpg`, `./tmp/${i}.jpg`)
  // processFile(`./tmp/${i}.jpg`);
  processFile(`./LEDdata/374549208-1-64_000/374549208-1-64_${String(i).padStart(3, "0")}.jpg`)
}
// processFile('./out.jpg')

// ss.forEach((s) => s.close());
