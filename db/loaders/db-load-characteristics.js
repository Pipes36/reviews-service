const Characteristics = require('./Characteristics.js');
const fs = require('fs');
const { pipeline } = require('stream');
const split = require('split');

const characteristicsStream = fs.createReadStream('../../etl/writes/characteristics.json');


characteristicsStream.pipe(split(JSON.parse))
  .on('data', (obj) => {
    const characteristics = new Characteristics({
      characteristic_id: obj.id,
      product_id: obj.product_id,
      name: obj.name
    }).save().catch((err) => {console.log(err.message)});
  })

  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log('///Characteristics loading completed///');
  })