var express = require('express');
var router = express.Router();

module.exports = function(dataAccess) {	

	router.post('/editor', function(req, res, next) {
		var newLevel = JSON.parse(req.body.level);

		console.log('API POST /editor called; received level :', newLevel._id);
		// console.log(newLevel);
		
		dataAccess.createLevel(newLevel).done(function(doc) {
			console.log('DataAccess: Level inserted');
		}, function(err) {
			console.log('DataAccess: Something went wrong when inserting level.');
		});		
	});

	return router;
}
