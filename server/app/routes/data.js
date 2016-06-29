var router = require('express').Router();
module.exports = router;
var rp = require('request-promise')

router.get('/price/:type', (req, res, next) => {
  var type = req.params.type;
  rp(`https://api.coinbase.com/v2/prices/${type}?currency=USD`)
  .then(px => res.json(px))
  .catch(err => console.log(err))
})
