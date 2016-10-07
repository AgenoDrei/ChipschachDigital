f = require('util').format,

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
  			console.log('Database connection error: ', err)
  			return null;
  		}
  		console.log("Database connected");
  		this.db = db;
	});
	return this;

	var getDb = function() {
		return this.db;
	}

	
};

