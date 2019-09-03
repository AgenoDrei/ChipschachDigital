let config = {
	environment: 'development',	// for server-deploy, switch to 'production'
	database: {
		url: '127.0.0.1',
		port: '27017',
		db: 'chipschach',
		authSource: 'admin',
		username: '',
		password: ''
	},
	socket: {
		url: '127.0.0.1',
		port: '5001'
	},
	server: {
		port: '5000'
	}
};

module.exports = config;
