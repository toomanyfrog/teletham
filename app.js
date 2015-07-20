var telegram = require('telegram-bot-api');
var logic = require('./logic.js');
var api = new telegram({
        token: '111443989:AAG2biy7U2_HuEp-akem07XtFNnbpHcDL20',
        updates: {
            enabled: true
    }
});

api.on('message', function(message)
{
    console.log(message);

    var response = logic.getResponse(message);

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
});




