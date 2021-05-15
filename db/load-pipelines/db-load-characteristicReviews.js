const CharacteristicReviews = require('../models/CharacteristicReviews.js');
const fs = require('fs');
const { pipeline } = require('stream');
const split = require('split');

const inputStream = fs.createReadStream('../etl/writes/characteristicReviews.json');


inputStream.pipe(split(JSON.parse))
  .on('data', (obj) => {
    const characReview = new CharacteristicReviews({
      characteristic_id: obj.characteristic_id,
      review_id: obj.review_id,
      value: obj.value
    }).save().catch((err) => {console.log(err.message)});
  })

  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log('///Characteristics reviews loading completed///');
  })