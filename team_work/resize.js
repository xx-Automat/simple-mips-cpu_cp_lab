const sharp = require("sharp");
const fs = require("fs");

const resize = (fileName, outName) => {
  const inputStream = fs.createReadStream(fileName);
  const output = fs.createWriteStream(outName);
  console.log(outName);


  const transformer = sharp().resize(64,64);
    // .resize({ height: 64, width: 64 })
    // .threshold(135)
    // .rotate(270);
  inputStream.pipe(transformer).pipe(output);
  inputStream.close();
  output.close();
};

module.exports = {
  resize,
};
