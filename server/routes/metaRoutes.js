const express = require('express');
const router = express.Router();
const db = require('../../db');
const ProductMeta = require('../../db/models/ProductMeta.js');

router.get('/', (req, res) => {

  const { product_id } = req.query;

  //TODO: explore saving changes on first fetch to save time on subsequent fetches.
  ProductMeta.findOne({product_id})
    .then((metaData) => {
      const inputCharac = metaData.characteristics;
      const outputCharac = {};
      inputCharac.map((charac) => {
        if (charac.count) {
          outputCharac[charac.name] = {
            value: charac.avgValue,
            count: charac.count
          };
        }
      });

      metaData.characteristics = outputCharac;
      res.send(metaData);

    })

});

/*

"characteristics": [
  {
      "name": "Length",
      "avgValue": 3.5,
      "count": 2
  },
]

{
  ...,
"characteristics": {
    "Fit": {
        "id": 36825,
        "value": "3.3571428571428571"
    },
    "Length": {
        "id": 36826,
        "value": "3.1428571428571429"
    },
    "Comfort": {
        "id": 36827,
        "value": "3.6428571428571429"
    },
    "Quality": {
        "id": 36828,
        "value": "3.7647058823529412"
    }
  }
}
*/

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