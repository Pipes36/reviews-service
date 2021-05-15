const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');
const { Transform, pipeline } = require('stream');

const inputStream = fs.createReadStream('../../csv/reviews_photos.csv');
const outputStream = fs.createWriteStream('../writes/reviewPhotos.json');

const csvParser = csv();

const transformStream = new Transform({
  transform(photo, encoding, cb) {
    try {
      const photoObj = JSON.parse(photo);
      const urlValue = photoObj.url;
      if (urlValue !== '') {
        const photoURL = `${JSON.stringify(photoObj)}\n`;
        cb(null, photoURL);
      }
    } catch(err) {
      cb(err);
    }
  }
});

pipeline(inputStream, csvParser, transformStream, outputStream, (err) => {
  if (err) {
    console.log('Pipeline error', err);
  } else {
    console.log('Pipeline successful');
  }
});

