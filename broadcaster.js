var chalk = require('chalk');
var telegram = require('telegram-bot-api');
var api = new telegram({
    token: '111443989:AAG2biy7U2_HuEp-akem07XtFNnbpHcDL20',
    updates: {
        enabled: true
    }
});



function broadcast(msg, house) {
    if (!admin.isValidHouse(house) || house != "all") {
        return "invalid house"
    }
    if (house != "all") {
        houses[house].forEach(function(num) {
            api.sendMessage({
                chat_id: num,
                text: msg,
            }, function(err, data) {
                console.log(chalk.read("Error Broadcasting Text Message: ") + err);
                // console.log(util.inspect(data, false, null));
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
                    console.log(chalk.read("Error Broadcasting Text Message: ") + err);
                    // console.log(util.inspect(data, false, null));
                });
            });
        })
        return null;
    }

}

module.exports = {
    broadcast: broadcast
}