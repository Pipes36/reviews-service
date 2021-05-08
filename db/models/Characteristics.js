const mongoose = require('mongoose');
const db = require('../index.js');
const fs = require('fs');

const characteristicSchema = new mongoose.Schema({
  characteristic_id: {type: Number, required: true, unique: true},
  product_id: {type: Number, required: true},
  name: {type: String, required: true}
});

const Characteristics = mongoose.model('Characteristics', characteristicSchema);



module.exports = Characteristics;

/*
CSV:

id,product_id,name
1,1,"Fit"
2,1,"Length"
3,1,"Comfort"
4,1,"Quality"
5,2,"Quality"
6,3,"Fit"

*/