const cheerio = require('cheerio');
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const readdir = require('fs').readdir;

const outputDir = `${process.cwd()}/app/resources/img`;
const inputDir = `${process.cwd()}/app/resources/data/svgdump`;
const selector = '[xlink\\:href]';

/** 
  Source - https://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
 */
function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}


function shallowCopy(src) {
   return Object.assign({}, src);
}

/*  Main Loop  */
readdir(inputDir, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }

  let images = [];
  const extractPromises = files.map((fileName, idx) => {
    return new Promise((resolve, reject) => {
        readFile(`${inputDir}/${fileName}`, function (err, content) {
          let imageDefaults = {
            hasError: true,
            error: 'no images',
            sourceFile: fileName,
            fileIndex: idx
          };
          if (!err) {
            const $ = cheerio.load(content);
            imageDefaults.hasError = false;
            $(selector).each((index, svg) => {
              let img = shallowCopy(imageDefaults);
              img.hasError = false;
              img.outputName = `${outputDir}/${fileName.replace('.svg', '')}_${index}.jpg`;
              img.base64Data = svg.attribs['xlink:href'];
              images.push(img);
            });
          } else {
            imageDefaults.error = err;
          }
          if (imageDefaults.hasError) {
            console.error(imageDefaults);            
          }
          resolve();
        })
      })
  })
  Promise.all(extractPromises)
    .then(_ => {
      const writePromises = images.map(l => {
        console.log('writing file ', l.outputName);
        let image = decodeBase64Image(l.base64Data);
        return new Promise((resolve, reject) => {
            writeFile(l.outputName, image.data, function (err) {
              if (err) {
                // don't reject on error to continue processing the other files.
                console.error(err);
              }
              return resolve()
            });
        })
      })
      return Promise.all(writePromises)
    })
    .then(_ => {
      console.log('done');
      process.exit(0);
    })
});