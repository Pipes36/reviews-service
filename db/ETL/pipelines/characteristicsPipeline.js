const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');
const { Transform, pipeline } = require('stream');

const inputStream = fs.createReadStream('../../csv/characteristics.csv');
const outputStream = fs.createWriteStream('../writes/characteristics.json');

const csvParser = csv();

const transformStream = new Transform({
  transform(characteristic, encoding, cb) {
    try {
      const characObj = JSON.parse(characteristic);
      const characString = `${JSON.stringify(characObj)}\n`
      cb(null, characString);

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

