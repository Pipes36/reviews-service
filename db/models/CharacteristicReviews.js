const mongoose = require('mongoose');
const db = require('../index.js');
const fs = require('fs');

const characteristicReviewSchema = new mongoose.Schema({
  characteristic_id: {type: Number, required: true},
  review_id: {type: Number, required: true},
  value: {type: Number, required: true}
});

const CharacteristicReviews = mongoose.model('CharacteristicReviews', characteristicReviewSchema);



module.exports = CharacteristicReviews;

/*
CSV:

id,characteristic_id,review_id,value
1,1,1,4
2,2,1,3
3,3,1,5
4,4,1,4
5,1,2,4
6,2,2,4
7,3,2,5
8,4,2,4
9,5,3,4
10,5,4,5

*/