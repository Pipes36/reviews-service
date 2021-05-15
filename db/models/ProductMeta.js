const mongoose = require('mongoose');
const db = require('../index.js');

const productMetaSchema = new mongoose.Schema({
  product_id: {type: Number, required: true, unique: true},
  ratings: {},
  recommend: {},
  characteristics: {}
}, {collection: "metaData-merged"});

const ProductMeta = mongoose.model('metaData-merged', productMetaSchema);


module.exports = ProductMeta;