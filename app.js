var telegram = require('telegram-bot-api');
var chalk = require('chalk')
var logic = require('./logic.js');
var logger = require('./logger')
var api = new telegram({
        token: '111443989:AAG2biy7U2_HuEp-akem07XtFNnbpHcDL20',
        updates: {
            enabled: true
    }
});


console.log(chalk.blue("============================"))
console.log(chalk.blue("                            "))
console.log(chalk.blue("      TeleTham Started      "))
console.log(chalk.blue("                            "))
console.log(chalk.blue("============================"))
console.log(chalk.blue("                            "))

api.on('message', function(message)
{
    logger.logMessage("incomingMessage", message);
    logger.storeLogs();

    console.log(chalk.green("Incoming Message:") + JSON.stringify(message));
    if (!message.text) { return; }
    var mess = message;
    if (message.text.indexOf("@ThamBot")!=-1){ //Direct mentions
        var index = message.text.indexOf("@ThamBot");
        mess.text = mess.text.substr(0, index);
        console.log("2: " + JSON.stringify(mess));
    }

    var response = logic.getResponse(mess);

    logger.logMessage("outgoingMessage", response);
    logger.storeLogs();



    if (response.valid) {
        if (response.type == 'text') {
            api.sendMessage({
                chat_id: message.chat.id,
                text: response.text
            }, function(err, data)  {
                console.log(err);
               // console.log(util.inspect(data, false, null));
            });
        } else if (response.type == 'image') {
            api.sendPhoto({
                chat_id: message.chat.id,
                caption: response.text,
                // you can also send file_id here as string (as described in telegram bot api documentation)
                photo: response.media
            }, function(err, data)  {
                console.log(err);
               // console.log(util.inspect(data, false, null));
            });
        } else if (response.type == 'sticker') {
            api.sendSticker({
                chat_id: message.chat.id,
                sticker: response.media
            });
        }
    }
    

});




