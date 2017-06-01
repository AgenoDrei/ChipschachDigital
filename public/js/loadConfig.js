var constants = "";
var config = "";
$.get('/config/constants', function(data) {
	constants = data;

	for(let key in constants) {
		window[key] = constants[key];
	}
});

$.get('/config', function(data) {
	config = data;
});
  
