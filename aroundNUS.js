var jf = require("jsonfile");

var stationsFilepath =  './private/stations.json';
var stations = jf.readFileSync(stationsFilepath);
var stationsArray; var passwordsArray;
var lettersArray;
readStations(stations);
var wrongPasswordMsg = "Wrong password!";

function getTask(password) {
	for(var i=0; i<passwordsArray.length; i++) {
        if (password == passwordsArray[i]) {
            return "TASK: " + stationsArray[i].task + "\nAVAILABLE LETTERS: " + lettersArray[i];
        }
    }
    return wrongPasswordMsg;
}

function readStations(station_list) {
    var arr_stations = [];
    var arr_passwords = [];
    var arr_letters = [];
    for (var station_name in station_list) {
        if (station_list.hasOwnProperty(station_name)) {
            var station = station_list[station_name];
            arr_stations.push(station);
            for (var property in station) {
                if(property == "password") {
                    if (station.hasOwnProperty(property)){
                        arr_passwords.push(station[property]);
                    } 
                }
                if (property == "letters") {
                    if (station.hasOwnProperty(property)){
                        arr_letters.push(station[property]);
                    }
                }
            }
            
        }
    }
    stationsArray = arr_stations;
    passwordsArray = arr_passwords;
    lettersArray = arr_letters;
}


module.exports = {
    'getTask': getTask
};