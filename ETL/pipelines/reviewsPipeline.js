const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');
const { Transform, pipeline } = require('stream');
const {dateTransform} = require('../transforms/dateTransform.js');

const inputStream = fs.createReadStream('../../csv/reviews.csv');
const outputStream = fs.createWriteStream('../writes/realReviews.json');

const csvParser = csv();

const transformStream = new Transform({
  transform(review, encoding, cb) {
    try {
      const reviewObject = JSON.parse(review);
      let transformedReview = dateTransform(reviewObject);
      // transformation

      const reviewString = `${JSON.stringify(transformedReview)}\n`;
      cb(null, reviewString);
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

// console.log('!!!', Number("Fri Nov 13 2020 13:34:42 GMT-0500 (Eastern Standard Time)"));

