var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var response = { 
		message: "Welcome to the Chipschach REST Api",
		version: "1" 
	};
  	res.json(response);
});

module.exports = router;
