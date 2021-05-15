const mongoose = require('mongoose');

const PORT = 27017;

const db = mongoose.connect(`mongodb://localhost:${PORT}/SDC`, { useNewUrlParser: true })
  .then((connection) => {
    console.log('------ DB connected ------')
    console.log('Collections: ', Object.keys(mongoose.connection.collections));
  })
  .catch(error => console.log(error));


module.exports = db;