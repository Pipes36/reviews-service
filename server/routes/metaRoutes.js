const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', (req, res) => {
  res.send('meta route working');
});

/* When fetching data from /reviews/meta, the product_id should be included in the request as params

Example request:

axios.get('/reviews/meta', {
  params: {
    product_id: 11002
  }
})
  .then(({data}) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err);
  })
}
*/


module.exports = router;