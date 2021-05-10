const express = require('express');
const axios = require('axios');
const reviews = require('./routes/reviewsRoutes.js');
const meta = require('./routes/metaRoutes.js');

const app = express();
const PORT = 8000;

app.use(express.json());



app.use('/reviews/meta', meta);
app.use('/reviews', reviews);



app.listen(PORT, () => {
  console.log(`DB server listening on port ${PORT}`);
});