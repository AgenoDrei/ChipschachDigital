/* 
msg = {
   type: String,
   gameId: String,
   joinId: String,
   [origX, origY, destX, destY]
}
*/

//Requirements
const WebSocketServer = require('websocket').server; //Websockets
const http = require('http'); //HTTP-Server
const playerType = require('../model/playerType');

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
                gameHandler.getGame(m.gameId).done(function(game) {
                    game.connect(m.joinId, connection).done(function(player) {
                        var response = {
                            type: "hello",
                            message: "You entered game " + game.getId() + " as " + player,
                            gameId: game.getId(),
                            player: player
                        };
                        console.log('Server> ', response);
                        connection.sendUTF(JSON.stringify(response));
                        if (player == playerType.PLAYERTWO) {
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
               	gameHandler.turn(m.gameId, m.joinId, connection, m.origX, m.origY, m.destX, m.destY).done(function(msg) {
                    gameHandler.sendToAll(m.gameId, m);
                    if(msg > 0) {
                        var response = {type : "win", player: msg};
                        gameHandler.sendToAll(m.gameId, response)
                    }
               	},
               	function(err) {
               		errorResponse.message = err;
                    console.log('Server> ', errorResponse);
                    connection.sendUTF(JSON.stringify(errorResponse));
               	});
                break;
            case 'yield':
                gameHandler.yield(m.gameId, m.joinId).done(function (msg) {
                    var response = {type: 'yield', player: msg};
                    gameHandler.sendToAll(m.gameId, response);
                },
                function (err) {
                    errorResponse.message = err;
                    console.log('Server> ', errorResponse);
                    connection.sendUTF(JSON.stringify(errorResponse));
                });
                break;
            case 'undo':
                gameHandler.undo(m.gameId, m.joinId).done(function (undoResponses) {
                        gameHandler.sendToAll(m.gameId, undoResponses.move);
                        if(undoResponses.recreate != null)
                            gameHandler.sendToAll(m.gameId, undoResponses.recreate);
                    },
                    function (err) {
                        errorResponse.message = err;
                        console.log('Server> ', errorResponse);
                        connection.sendUTF(JSON.stringify(errorResponse));
                    });
                break;
            case 'end':
                gameHandler.endGame(m.gameId).done(function(msg) {
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