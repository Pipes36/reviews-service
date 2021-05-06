const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/SDC', { useNewUrlParser: true })
  .then(() => {console.log('DB connected')})
  .catch(error => console.log(error));








module.exports = db;