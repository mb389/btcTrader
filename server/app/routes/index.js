var router = require('express').Router();
module.exports = router;

router.use('/', require('./data'));


router.use(function (req, res) {
    res.status(404).end();
});
