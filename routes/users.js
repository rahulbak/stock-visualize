var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/stock', function(req, res) {
	var stockName = req.param('stockName');
	var timeStamp = req.param('timeStamp');
 	res.send(stockName + ' ' + timeStamp);
});

module.exports = router;
