var f = require('util').format;
var Promise = require('promise');

module.exports = function(configuration, mongoClient) {
	var baseUrl = configuration.database.url + ':' + configuration.database.port + '/' + configuration.database.db;
	var user = encodeURIComponent(configuration.database.username);
	var password = encodeURIComponent(configuration.database.password);
	var authMechanism = 'DEFAULT';
	var authSource = configuration.database.authSource;
	this.db = null;

	var url = f('mongodb://%s:%s@%s?authMechanism=%s&authSource=%s', user, password, baseUrl, authMechanism, authSource);
	//console.log('Connecting to database: ', url);
	
	mongoClient.connect(url, function(err, db) {
  		if(err) {
  			console.log('Database connection error: ')
  			throw err;
  			return null;
  		}
  		console.log("Database connected");
  		this.db = db;
	});

	this.getDb = function() {
		return this.db;
	};

	this.createLevel = function(level) {
		return new Promise(function(fulfill, reject) {
			db.collection('levels').insertOne(level, function(err, doc) {
				if(err) {
					reject(err);
				}
				fulfill(doc);
			});
		});
	};

	this.getLevelById = function(levelId) {
		return new Promise(function(fulfill, reject) {
			db.collection('levels').findOne({ _id: levelId }, function(err, doc) {
				if(err) {
					reject(err);
				}
				if(doc == null) {
					reject('No document found!'); 
				}
				//console.log("Level got from DB: ", doc);
				fulfill(doc);
			});
		});
	};

	this.getAllLevelIds = function() {
		return new Promise(function(fulfill, reject) {
			db.collection('levels').find({}, { 'name': 1, 'type': 1 , 'subtype': 1, 'description': 1}).sort({ _id: 1}).toArray(function(err, doc) {
				if(err) {
					reject(err);
				}
				fulfill(doc);
			});
		});
	};

	return this;
	
};

