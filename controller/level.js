var express = require('express');
var router = express.Router();
var validate = require("validate.js");


/* GET home page. */
router.get('/level', function(req, res, next) {
  	res.json("Foo");
});

module.exports = router;
