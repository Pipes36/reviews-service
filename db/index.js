const mongoose = require('mongoose');

const PORT = 27017;

const db = mongoose.connect(`mongodb://db:${PORT}/SDC`, { useNewUrlParser: true })
  .then(() => console.log('------ DB connected ------'))
  .catch(error => console.log(error));


module.exports = db;