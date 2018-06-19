var express = require('express');
var router = express.Router();

router.get('/getProd', (req, res) => {
	global.db.findAll((e, docs) => {
		if (e) return console.log(e);
		res.send(docs)
	})
});

router.post('/cadProd', (req, res) => {
	global.db.insert(req.body, (e, result) => {
		if (e) return console.log(e);
		res.send(true);
	})
})

router.post('/removeBarcode', (req, res) => {
	var barcode = req.body.barcode;
	global.db.remove(barcode, (e, result) => {
		if (e) return console.log(e);
		res.send(true);
	})
})

module.exports = router;
