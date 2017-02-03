var comHandle = {
    ws: null,
	connect: function(url, port, messageCallback, gameId, joinId) {
    	if (window.WebSocket) {
        	ws = new WebSocket('ws://' + url + ':' + port, 'kekse');
        	ws.onopen = function() {
            	var conObj = {
                	type: 'hello',
                	gameId: gameId,
                	joinId: joinId,
            	};
            	console.log("Client> ", conObj);
            	ws.send(JSON.stringify(conObj));
        	};
                    
        	ws.onmessage = messageCallback;

            ws.onclose = function() {
                console.error("WebSocket closed!");
            }

            return ws;
        } else {
            console.error('Dieser Browser ist nicht aktuell genug (kein Websocket Support).');
            return null;
        }
    },

    send: function(message) {
        ws.send(message);
    }
};
