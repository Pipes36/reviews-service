const ReviewPhotos = require('../models/ReviewPhotos.js');
const fs = require('fs');
const { pipeline } = require('stream');
const split = require('split');

const reviewPhotosStream = fs.createReadStream('../etl/writes/reviewPhotos.json');


reviewPhotosStream.pipe(split(JSON.parse))
  .on('data', (obj) => {
    const ReviewPhoto = new ReviewPhotos({
      review_id: obj.review_id,
      url: obj.url
    }).save().catch((err) => {console.log(err.message)});
  })

  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log('///Review photos loading completed///');
  })