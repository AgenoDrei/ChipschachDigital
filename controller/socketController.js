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
        console.log("Websocket opend on port " + configuration.socket.port);
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
                        },
                        function(err) {
                            errorResponse.message = err;
                            console.log('Server> ', errorResponse);
                            connection.sendUTF(JSON.stringify(errorResponse));
                        });
                });
                break;
            case "turn": // Client sends a turn order
                if ((rooms[roomID].currentTurn == 1 && rooms[roomID].connection1 == connection) //Is it the turn of the client 1....
                    ||
                    (rooms[roomID].currentTurn == 2 && rooms[roomID].connection2 == connection)) { //... or 2?
                    var gameState = rooms[roomID].game.turn(convertPlayer(rooms[roomID].currentTurn), m.x, m.y, m.oldX, m.oldY); //Let the game logic do its work
                    respond(connection, m, gameState, roomID); //Answer the client
                } else {
                    connection.sendUTF('{"type": "error", "message": "turn"}'); //It is not your turn!
                }
                break;
            case "undo": //Not used, only debug
                rooms[roomID].game.undo(rooms[roomID].currentTurn);
                break;
            case 'yield':
                rooms[roomID].game.yield(convertPlayer(rooms[roomID].currentTurn));
                break;
            case 'end':
                gameHandler.endGame(gameId).then(function(msg) {
                    var response = { type: 'exit', msg: msg };
                    connection.sendUTF(JSON.stringify(response));
                }, function(err) {
                    errorResponse.message = err;
                    connection.sendUTF(JSON.stringify(errorResponse));
                });
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

/*
 * Respond to the client dependent on the gameState
 * 
 *  0: normal turn, is allowed
 *  1: turn allowed, player 1 wins
 *  2: turn allowed, player 2 wins
 *  
 *  -1: turn forbidden, the player was put in check
 *  -2: turn forbidden, field blocked, or invalid turn	
 *  
 */
function respond(connection, m, gameState, roomID) {
    // Check wether the turn is allowed/someone won
    switch (gameState) {
        case 0:
            // Turn allowed
            rooms[roomID].connection1.sendUTF('{"type": "turn", "x": "' + m.x + '", "y": "' + m.y + '", "oldX": "' + m.oldX + '", "oldY": "' + m.oldY + '", "player": "' + rooms[roomID].currentTurn + '"}');
            rooms[roomID].connection2.sendUTF('{"type": "turn", "x": "' + m.x + '", "y": "' + m.y + '", "oldX": "' + m.oldX + '", "oldY": "' + m.oldY + '", "player": "' + rooms[roomID].currentTurn + '"}');
            if (rooms[roomID].currentTurn == 1)
                rooms[roomID].currentTurn = 2;
            else
                rooms[roomID].currentTurn = 1;
            break;
        case 1:
            // Turn allowed
            rooms[roomID].connection1.sendUTF('{"type": "win", "x": "' + m.x + '", "y": "' + m.y + '", "oldX": "' + m.oldX + '", "oldY": "' + m.oldY + '", "player": "' + rooms[roomID].currentTurn + '"}');
            rooms[roomID].connection2.sendUTF('{"type": "win", "x": "' + m.x + '", "y": "' + m.y + '", "oldX": "' + m.oldX + '", "oldY": "' + m.oldY + '", "player": "' + rooms[roomID].currentTurn + '"}');
            //		endGame(connection); // end the game
            break;
        case 2:
            // Turn allowed, player 2 wins
            rooms[roomID].connection1.sendUTF('{"type": "win", "x": "' + m.x + '", "y": "' + m.y + '", "oldX": "' + m.oldX + '", "oldY": "' + m.oldY + '", "player": "' + rooms[roomID].currentTurn + '"}');
            rooms[roomID].connection2.sendUTF('{"type": "win", "x": "' + m.x + '", "y": "' + m.y + '", "oldX": "' + m.oldX + '", "oldY": "' + m.oldY + '", "player": "' + rooms[roomID].currentTurn + '"}');
            //		endGame(connection); //end the game
            break;
        case -1:
            // Turn forbidden, check
            connection.sendUTF('{"type": "error", "message": "check"}');
            break;
        case -2:
            // Turn forbidden, no valid turn
            connection.sendUTF('{"type": "error", "message": "impossible"}');
            break;
    }
}

/* 
 * convert player number to 'yellow' or 'blue'
 */
function convertPlayer(player) {
    if (player == 1)
        return 'yellow';
    else if (player == 2)
        return 'blue';
}