const mongoose = require('mongoose');
const db = require('../index.js');

const characteristicSchema = new mongoose.Schema({
  characteristic_id: {type: Number, required: true, unique: true},
  product_id: {type: Number, required: true},
  name: {type: String, required: true}
});

const Characteristics = mongoose.model('Characteristics', characteristicSchema);


module.exports = Characteristics;
