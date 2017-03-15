/* 
msg = {
   type: String,
   gameId: String,
   joinId: String,
   [origX, origY, destX, destY]
}
*/

//Requirements
var WebSocketServer = require('websocket').server; //Websockets
var http = require('http'); //HTTP-Server

//Initalization
module.exports = function(configuration, gameHandler) {
    // HTTP-Server
    this.server = http.createServer(function(req, res) {
        res.writeHead(404);
        res.end();
    });
    server.listen(configuration.socket.port, function() { //start http server
        console.log("Websocket opened on port " + configuration.socket.port);
    });

    // Upgrade http server to WebSocket
    this.wsserver = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false //hey i will do that
    });

    //When a new connection is opened
    wsserver.on("request", function(req) {
        var connection = req.accept("kekse", req.origin); //Accept connection with "kekse" protocol
        console.log("Server> New Connection " + req.origin);
        console.log("Server> Connection " + connection.remoteAddress + " accepted.");

        //When a client sends a message
        connection.on("message", function(message) {
            console.log("Client> ", message.utf8Data);
            evaluate(connection, message); //Do some stuff with it, analytics you know :P
        });

        //When a client closes the connection
        connection.on("close", function(reasonCode, description) {
            console.log("Server> Connection " + connection.remoteAddress + " closed (reason: " + reasonCode + ").");
            endGame(connection); //Close all connections
        });
    });

    //Evaluates the message -> look at the protocol in the wiki
    this.evaluate = function(connection, message) {
        var errorResponse = {
            type: 'error',
            message: ''
        };
        try {
            var m = JSON.parse(message.utf8Data); //get a object from the datastring
        } catch (e) { // No valid JSON, send error
            return connection.sendUTF('{"type": "error", "message": "json"}'); //No valid string 
        }
        //Search for the room, where the current connection is saved

        // Evaluation
        switch (m.type) { //see protocol
            case "hello":
                gameHandler.getGame(m.gameId).then(function(game) {
                    game.connect(m.joinId, connection).then(function(player) {
                        var response = {
                            type: "hello",
                            message: "You entered game " + game.getId() + " as " + player
                        };
                        console.log('Server> ', response);
                        connection.sendUTF(JSON.stringify(response));
                        if (player == "Player 2") {
                            console.log('Server> Am going to start', m.gameId);
                            gameHandler.sendToAll(m.gameId, {
                                type: "start",
                                message: "Auf die Plätze, fertig, los!"
                            });
                        }
                    },
                    function(err) {
                        errorResponse.message = err;
                        console.log('Server> ', errorResponse);
                        connection.sendUTF(JSON.stringify(errorResponse));
                    });
                });
                break;
            case "turn": // Client sends a turn order
               	gameHandler.turn(m.gameId, m.joinId, connection, m.origX, m.origY, m.destX, m.destY).then(function(msg) {
                    gameHandler.sendToAll(m.gameId, m);
                    if(msg > 0) {
                        var response = {type : "win", player: (msg==1?0:1)};
                        gameHandler.sendToAll(m.gameId, response)
                    }
               	},
               	function(err) {
               		errorResponse.message = err;
                    console.log('Server> ', errorResponse);
                    connection.sendUTF(JSON.stringify(errorResponse));
               	});
                break;
            case "undo": //Not used, only debug
                break;
            case 'yield':
                gameHandler.yield(m.gameId, m.joinId).then(function (msg) {
                    var response = {type: 'yield', player: (msg==1?0:1)};
                    gameHandler.sendToAll(m.gameId, response);
                },
                function (err) {
                    errorResponse.message = err;
                    console.log('Server> ', errorResponse);
                    connection.sendUTF(JSON.stringify(errorResponse));
                });
                break;
            case 'end':
                gameHandler.endGame(m.gameId).then(function(msg) {
                    var response = { type: 'exit', msg: msg };
                    connection.sendUTF(JSON.stringify(response));
                }, function(err) {
                    errorResponse.message = err;
                    connection.sendUTF(JSON.stringify(errorResponse));
                });
                break;
            default: //Not used in the protocol
                connection.sendUTF('{"type": "error", "message": "cmd"}');
                break;
        }
    }

    /*
     * only important for the game logic & chat, sends messsage to both player in the affected room
     */
    this.sendToPlayers = function(text, id) {
        console.log('Server> ', text);
    }

    return this;
};