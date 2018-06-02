var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

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

module.exports = router;
