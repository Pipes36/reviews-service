const mongoose = require('mongoose');
const db = require('../index.js');

const characteristicReviewSchema = new mongoose.Schema({
  characteristic_id: {type: Number, required: true},
  review_id: {type: Number, required: true},
  value: {type: Number, required: true}
});

const CharacteristicReviews = mongoose.model('CharacteristicReviews', characteristicReviewSchema);


module.exports = CharacteristicReviews;