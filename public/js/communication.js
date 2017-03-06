var comHandle = {
    ws: null,
    connectionRetry: false,
	connect: function(url, port, messageCallback, gameId, joinId) {
    	if (window.WebSocket) {   
            ws = new WebSocket('ws://' + url + ':' + port, 'kekse');
        	
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
                    console.error('Try to reconnect to localhost now!');
                    comHandle.connect("localhost", "4001", messageCallback, gameId, joinId);
                }
            }
                    
        	ws.onmessage = messageCallback;

            ws.onclose = function(e) {
                console.log("WebSocket closed!", e.code);
            }

            return ws;
        } else {
            console.error('Dieser Browser ist nicht aktuell genug (kein Websocket Support).');
            return null;
        }
    },

    send: function(message) {
        var m = JSON.stringify(message);
        ws.send(m);
    }
};
