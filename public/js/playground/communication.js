var comHandle = {
    ws: null,
    connectionRetry: false,
	connect: function(url, port, messageCallback, gameId, joinId) {
		let ws = null; 
    		if (window.WebSocket) {
		if(url) ws = new WebSocket('ws://'+url+':'+port, 'kekse');
		else ws = new WebSocket('ws://83.169.43.18:5001', 'kekse');
        	
        	ws.onopen = function() {
            	var conObj = {
                	type: 'hello',
                	gameId: gameId,
                	joinId: joinId
            	};
            	console.log("Client> ", conObj);
            	ws.send(JSON.stringify(conObj));
        	};

            ws.onerror = function(error) {
                console.error('Connection error occured!');
                if(!comHandle.connectionRetry) {
                    comHandle.connectionRetry = true;
                    console.log('Try to reconnect to global server now!');
                    comHandle.connect(config.socket.url, config.socket.port, messageCallback, gameId, joinId);
                }
            };
                    
        	ws.onmessage = messageCallback;

            ws.onclose = function(e) {
		if(e.code == 1006) {
			ws.onerror("Safari connection refused");
		}
                console.log("WebSocket closed!", e.code);
            };

            comHandle.ws = ws;

            return ws;
        } else {
            console.error('Dieser Browser ist nicht aktuell genug (kein Websocket Support).');
            return null;
        }
    },

    send: function(message) {
        console.log("Client> ", message);
        var m = JSON.stringify(message);
        comHandle.ws.send(m);
    }
};
