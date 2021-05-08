const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');
const { Transform, pipeline } = require('stream');

const inputStream = fs.createReadStream('../../csv/characteristic_reviews.csv');
const outputStream = fs.createWriteStream('../writes/characteristicReviews.json');

const csvParser = csv();

const transformStream = new Transform({
  transform(review, encoding, cb) {
    try {
      const reviewObj = JSON.parse(review);
      const reviewString = `${JSON.stringify(reviewObj)}\n`
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

