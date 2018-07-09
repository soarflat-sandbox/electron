const path = require('path');
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const jpegtran = require('imagemin-jpegtran');
const jpegoptim = require('imagemin-jpegoptim');
const gifsicle = require('imagemin-gifsicle');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');

const optimize = filePath => {
  const output = path.dirname(filePath);

  imagemin([filePath], output, {
    plugins: [
      jpegoptim(),
      jpegtran(),
      gifsicle(),
      pngquant(),
      optipng(),
      svgo(),
    ],
  }).then(() => {
    console.log('Images optimized');
  });
};

module.exports = {
  optimize,
};
