const express = require('express');
const axios = require('axios');
const path = require('path');
const reviews = require('./routes/reviewsRoutes.js');
const meta = require('./routes/metaRoutes.js');

const app = express();
const PORT = 8000;

app.use(express.json());



app.use('/reviews/meta', meta);
app.use('/reviews', reviews);
app.get('/loaderio-2ae007f3d5a6844c03745ca34aa724a2/', (req, res) => {
  res.sendFile(path.resolve('./server/loaderio.txt'));
});


app.listen(PORT, () => {
  console.log(`DB server listening on port ${PORT}`);
});