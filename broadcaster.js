var chalk = require('chalk');
var telegram = require('telegram-bot-api');
var jf = require('jsonfile');
var admin = require('./admin')
var api = new telegram({
    token: '111443989:AAG2biy7U2_HuEp-akem07XtFNnbpHcDL20',
    updates: {
        enabled: true
    }
});

var studentsInfoFilepath =  './private/students_info.json';
var students = jf.readFileSync(studentsInfoFilepath);
var houses = {}
houses.aviur = []
houses.amaranth = []
houses.varjo = []
houses.levian = []
houses.arete = []
houses.nidhogg = []

Object.keys(students).forEach(function (student) {
	var house = students[student].house
	houses[house].push(student)
});


function broadcast(msg, house) {
	house = house.replace(/ /g,'');
    if (!admin.isValidHouse(house) && house != "all") {
    	console.log(chalk.yellow("invalid house:", house))
        return "invalid house"
    }
    if (house != "all") {
        houses[house].forEach(function(num) {
            api.sendMessage({
                chat_id: num,
                text: msg,
            }, function(err, data) {
                if (err) {
               		console.log(chalk.read("Error Broadcasting Text Message: ") + err);
               	}
            });
        });
        return null;
    } else {
        Object.keys(houses).forEach(function(house) {
            houses[house].forEach(function(num) {
                api.sendMessage({
                    chat_id: num,
                    text: msg,
                }, function(err, data) {
                	if (err) {
                		console.log(chalk.read("Error Broadcasting Text Message: ") + err);
                	}
                });
            });
        })
        return null;
    }

}

module.exports = {
    broadcast: broadcast
}