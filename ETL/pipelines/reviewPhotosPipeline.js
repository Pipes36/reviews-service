const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');
const { Transform, pipeline } = require('stream');

const inputStream = fs.createReadStream('../../csv/dummyReviewPhotos.csv');
const outputStream = fs.createWriteStream('../writes/test-writes/dummyReviewPhotos.ndjson');

const csvParser = csv();

pipeline(inputStream, csvParser, outputStream, (err) => {
  if (err) {
    console.log('Pipeline error', err);
  } else {
    console.log('Pipeline successful');
  }
});

