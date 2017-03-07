fs = require('fs');

var basePath = "mp";
var resultPath = "MP";

var colors = {
	"Yellow" : 0,
	"Blue" : 1,
	"Green" : 2,
	"Red" : 3
};

function calcCorrectId(id) {
    var idParts = id.split('\_');
    var baseId = idParts[0] + '_' + idParts[1] + '_';
    var majorLevel = parseInt(idParts[2]);
    var minorLevel = parseInt(idParts[3]);

    if(majorLevel < 10)
		majorLevel = '0' + majorLevel;
	if(minorLevel < 10)
		minorLevel = '0' + minorLevel;
	
	var newId = baseId + majorLevel + '_' + minorLevel;
	debugger;
	return newId;
}

fs.readdir(basePath, function(err, files) {
    if(err) return console.log(err);
    
    for(var i = 0; i < files.length; i++) {
    //for(var i = 0; i < 2; i++) {
	var curFileName = files[i];
	console.log(files[i]);

	var curFile = fs.readFileSync(basePath+ "/" + curFileName, 'utf8');
	var curFileObj = JSON.parse(curFile.substring(8));
	
	var result = {};
	result._id = calcCorrectId(curFileName.split('\.')[0]);
	result.type = curFileName.split('\_')[0];
	result.subtype = curFileName.split('\_')[1];
	result.name = curFileObj.name;
	result.description = curFileObj.description;
	result.minturns = parseInt(curFileObj.min_turns);
	result.board = [];

	for(var key in curFileObj.board) {
		var curFigure = curFileObj.board[key];
		var resultFigure = {};
		resultFigure.type = (curFigure.type == "Tower")? "ROOK" : curFigure.type.toUpperCase();
		resultFigure.color = colors[curFigure.color];
		resultFigure.x = parseInt(curFigure.x) + 1;
		resultFigure.y = parseInt(curFigure.y) + 1;

		result.board.push(resultFigure);	
	}

	fs.writeFileSync(resultPath + "/" + result._id + ".json", JSON.stringify(result)); //example: SP/sp_rook_1_1.json
	
    }
});



