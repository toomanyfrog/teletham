var admin = require('./admin');
var aroundNUS = require('./aroundNUS');
var auth = require('./auth');
var dataManip = require('./modifyHouseData');
 

//var invalidUserMessage = "Hi, you're not registered in the Thambot server. Please contact your OGL to register.";
var notOGLMessage = "Hey, you're not an OGL!";
var helpMessage =
    'Here\'s what you can ask Thambot! ' + 
    '\nType /points to get your house\'s current points.' +
    '\nType /password [PASSWORD] to enter in a password for an AcrossNUS station.' + 
    "\nType /ogl if you are an OGL for special OGL commands.";

var bad_house_msg = "That's not one of the houses...";
var errorMessage_syntax =
    'Thambot didn\'t understand that command. Thambot is confused! Type \'/help\' for more' +
    ' information.';
var errorMessage_NaN = 
    "That's not a number Thambot knows how to add or subtract :( \nNumbers look like this: 1, 2, 3, 34583489"; 

var oglHelpMessage = 
    'Type /addpoints [number] to add points.\nType /subtractpoints [number] to subtract points. \nType /addletters [letter] to add a letter.';


function getResponse(message) {
    var cmd, cmdArr;
    if (message.text != null) {
        if (message.text[0] == '/') { cmdArr = (message.text.substr(1)).split(' '); cmd = cmdArr[0]; }
        if (message.text == 'yuyen') return objectify('', 'sticker', yuyen_sticker);
        if (message.text == 'frisbee') return objectify('Did someone say FRISBEE?', 'image', varun_frisbee);
        if (message.text == 'hello') return objectify("Hello, " +  message.from.first_name + "!", 'text', null);
    }
    console.log(cmd);
    switch(cmd) {
        //////////////////////////////////////////////MESSAGES
        case 'help':
            return objectify(helpMessage, 'text', null);
        case 'ogl': 
            if (!auth.isOGL(message.from.id)) {
                return objectify(notOGLMessage, 'text', null);
            }
            return objectify(oglHelpMessage, 'text', null);     
        //////////////////////////////////////////////AUTH, BROADCASTS
        case 'password':
            if (cmdArr.length != 2) return objectify("try again", 'text', null);
            var pw = cmdArr[1];
            console.log(pw);
            return objectify(aroundNUS.getTask(pw), 'text', null);
        case 'broadcast':
            if (auth.isLordAlmighty(message.from.id)) {
                if (isNaN(cmdArr[1])) {
                    return objectify(errorMessage_NaN, 'text', null);
                } else {
                    //console.log(cmd[1]);
                    //return broadcaster.broadcast(msg, "ankaa");
                }
            } else {
                return objectify("Hey, you're not allowed back here!", 'text', null);
            }       
        case 'addOGL': 
            if(cmdArr.length!=3) {
                return objectify("try again", 'text', null);
            }
            var matric = cmdArr[1];
            var house = cmdArr[2];
            return objectify(admin.addOGL(message.from.id, message.from.first_name, matric, house), 'text', null);
        case 'makeOGL':
            if(cmdArr.length!=2) {
                return objectify("try again", 'text', null);
            }
            if (!auth.isLordAlmighty(message.from.id)) {
                return objectify("You're not worthy.", 'text', null);
            }
            return objectify(admin.makeOGL(cmd[1]), 'text', null);
        case 'makeSM':
            if(cmdArr.length!=2) {
                return objectify("try again", 'text', null);
            }
            if (!auth.isLordAlmighty(message.from.id)) {
                return objectify("You're not worthy.", 'text', null);
            }
            return objectify(admin.makeStationMaster(cmd[1]), 'text', null);
        case 'revokeOGL':
            if(cmdArr.length!=2) {
                return objectify("try again", 'text', null);
            }
            if (!auth.isLordAlmighty(message.from.id)) {
                return objectify("You're not worthy.", 'text', null);
            }
            return objectify(admin.revokeOGL(cmd[1]), 'text', null);
        case 'revokeSM':
            if (!auth.isLordAlmighty(message.from.id)) {
                return objectify("You're not worthy.", 'text', null);
            }
            if(cmdArr.length!=2) {
                return objectify("try again", 'text', null);
            }
            return objectify(admin.revokeStationMaster(cmd[1]), 'text', null);
        //////////////////////////////////////////////LETTERS 
        case 'addletter':
            if (!auth.isOGL(message.from.id)) {
                return objectify(notOGLMessage, 'text', null);
            }
            if (cmdArr.length != 2) return objectify("try again", 'text', null);
            if (cmdArr[1].length > 1) {
                return objectify("A letter has ONE CHARACTER", 'text', null);
            } else {
                return objectify(dataManip.addLetter(auth.getHouse(message.from.id), cmdArr[1]), 'text', null);
            }
        case 'letters':
            return objectify(dataManip.getLetters(auth.getHouse(message.from.id)), 'text', null);
        case 'clearletters':
            if(!auth.isOGL(message.from.id)) {
                return objectify(notOGLMessage, 'text', null);
            }
            return objectify(dataManip.clearLetters(auth.getHouse(message.from.id)), 'text', null);
        //////////////////////////////////////////////POINTS
        case 'points':
            if(cmdArr.length==1) return objectify(dataManip.getPoints(auth.getHouse(message.from.id)), 'text', null);
            if(cmdArr.length==2) {
                if(!auth.isOGL(message.from.id)) {
                    return objectify(notOGLMessage, 'text', null);
                }
                if(!admin.isValidHouse(cmdArr[1])) {
                    return objectify(bad_house_msg, 'text', null);
                }
                return objectify(dataManip.getPoints(cmdArr[1]), 'text', null);
            } else {
                return objectify("try again", 'text',null);
            }
        case 'addpoints':
            if (!auth.isSM(message.from.id)) {
                return objectify(notOGLMessage, 'text', null);
            }
            if (cmdArr.length != 3) return objectify("try again", 'text', null);
            if (isNaN(cmdArr[2])) {
                return objectify(errorMessage_NaN, 'text', null);
            } else if (!admin.isValidHouse(cmdArr[1])) {
                return objectify(bad_house_msg, 'text', null);
            } else {
                return objectify(dataManip.addPoints(cmdArr[1], cmdArr[2]), 'text', null);
            }
        case 'minuspoints':
        case 'subtractpoints':
            if (!auth.isSM(message.from.id)) {
                return objectify(notOGLMessage, 'text', null);
            }
            if (cmdArr.length != 3) return objectify("try again", 'text', null);
            if (isNaN(cmdArr[2])) {
                return objectify(errorMessage_NaN, 'text', null);
            } else if (!admin.isValidHouse(cmdArr[1])) {
                return objectify("That's not one of the houses...", 'text', null);
            }else {
                return objectify(dataManip.subtractPoints(cmdArr[1], cmdArr[2]), 'text', null);
            } 
        default:
            return objectify(helpMessage, 'text', null);
    }
    
    
}

function objectify(text, type, media) {
    return { text: text, type: type, media: media };
}



module.exports = {
    'getResponse': getResponse
}







var yuyen_sticker = 'BQADAgADAgEAAvR7GQABm0hmTR_O2gIC';
var varun_frisbee = 'AgADBQADB6gxG5zeNALdCWV9CofCnqHhsTIABHIhDZyGOiwNuicBAAEC';