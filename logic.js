var admin = require('./admin');
var aroundNUS = require('./aroundNUS');
var auth = require('./auth');
var dataManip = require('./modifyHouseData');
var msgs = require('./messages');
var broadcaster = require('./broadcaster');
var jf = require('jsonfile');

var broadcastMsgFilepath =  './private/messages.json';
var broadcastLibraryMessages = jf.readFileSync(broadcastMsgFilepath);


function getResponse(message) {
    var cmd, cmdArr, msg;
    if (message.text != null) {
        
        msg = message.text.toLowerCase();

        if (!auth.isAllowed(message.from.id) && !auth.isOGL(message.from.id)) {
            if (message.text[0] == '/') {        
                cmdArr = (msg.substr(1)).split(' '); 
                cmd = cmdArr[0]; 
                switch(cmd) {
                case 'addfreshie':
                    if(cmdArr.length!=3) { return sendMessage(msgs.command_error); }
                    else {
                        var matric = cmdArr[1];
                        var house = cmdArr[2];
                        return objectify(admin.addStudent(message.from.id, 
                                                          message.from.first_name, 
                                                          matric, 
                                                          house), 'text', null);
                    }
                    break;
                case 'addogl': 
                    if(cmdArr.length!=3) { return sendMessage(msgs.command_error); }
                    else {
                        var matric = cmdArr[1];
                        var house = cmdArr[2];
                        return objectify(admin.addOGL(message.from.id, message.from.first_name, matric, house), 'text', null);
                    }
                    break;
                default:
                    return sendMessage("Are you a USP freshman??????????");
                }
            }
            return sendMessage("Are you a USP freshman??????????");
    }
        
        msg = message.text.toLowerCase();

        if (message.text[0] == '/') {
            cmdArr = (msg.substr(1)).split(' '); 
            cmd = cmdArr[0]; 
            if (cmd === "broadcast") {
                var temp = cmdArr
                cmdArr = [];
                cmdArr[0] = temp[0];
                cmdArr[1] = temp[1]
                cmdArr[2] = message.text.split("%")[1];
            }
        }
        else {
            if (msg == 'yuyen') return objectify('', 'sticker', yuyen_sticker);
            if (msg == 'frisbee') return objectify('Did someone say FRISBEE?', 'image', varun_frisbee);
            if (msg == 'hello' || msg == 'hi') return objectify("Hello, " +  message.from.first_name + "!", 'text', null);
            if (contains(msg, "bot friend")) return objectify("I have a friend called Gort! Please get to know him. Add @GortBot", 'text', null);
            if (contains(msg, "thambot")) return objectify("I refuse to answer to anything other than what I've been instructed to.", 'text', null);
            if (contains(msg, "tham ")) return objectify("Welcome.", 'text', null);
            if (contains(msg, "naomi")) return objectify("HARRY POTTARRRRR", 'text', null);
        }
    
    
    switch(cmd) {
        //////////////////////////////////////////////MESSAGES
        case 'help':
            return sendMessage(msgs.help);
        case 'ogl_help': 
            if (!auth.isOGL(message.from.id)) {
                return sendMessage(msgs.not_ogl);
            } else {
                return sendMessage(msgs.ogl_help);
            }
            break;
        case 'remove_student': 
            if (!auth.isOGL(message.from.id)) {
                return sendMessage(msgs.not_ogl);
            } else if (cmdArr.length != 2) {
                return sendMessage(msgs.command_error);
            } else {
                return objectify(admin.removeStudent(cmdArr[1]), 'text', null);
            }
            break;
        case 'get_students':
            if (!auth.isOGL(message.from.id)) {
                return sendMessage(msgs.not_ogl);
            } else if (cmdArr.length != 2) {
                return sendMessage(msgs.command_error);
            } else {
                return objectify(admin.getStudents(cmdArr[1]), 'text', null);
            }
            break;
        case 'broadcast':
            if (auth.isLordAlmighty(message.from.id)) {
                if (cmdArr.length != 3) {
                    return objectify(msgs.command_error, 'text', null);
                } else {
                    var error = broadcaster.broadcast(cmdArr[2], cmdArr[1]);
                    if (error !== null) {
                        return objectify(error, 'text', null);    
                    }
                    return objectify("Message sent.", 'text', null);
                }
            } else {
                return objectify(msgs.unauth, 'text', null);
            }   
            break;
        case 'broadcastlib':
            if (auth.isLordAlmighty(message.from.id)) {
                if (cmdArr.length != 3) {
                    return objectify(msgs.command_error, 'text', null);
                } else {
                    var broadcastLibMsg =  broadcastLibraryMessages[cmdArr[2]]
                    if (!broadcastLibMsg) {
                        return objectify("invalid lib message", 'text', null);  
                    }
                    var error = broadcaster.broadcast(broadcastLibMsg, cmdArr[1]);
                    if (error !== null) {
                        return objectify(error, 'text', null);    
                    }
                    return objectify("Message sent.", 'text', null);
                }
            } else {
                return objectify(msgs.unauth, 'text', null);
            }   
            break;
        case 'password':
            if (cmdArr.length != 2) { return sendMessage(msgs.command_error); } 
            else {
                var pw = cmdArr[1];
                return objectify(aroundNUS.getTask(pw), 'text', null); 
            }
            break;
        
        case 'makeogl':
            if(cmdArr.length!=2) { return sendMessage(msgs.command_error);  }
            else if (!auth.isLordAlmighty(message.from.id)) { return sendMessage(msgs.unauth); }
            else { return objectify(admin.makeOGL(cmd[1]), 'text', null); }
            break;
        case 'revokeogl':
            if(cmdArr.length!=2) { return sendMessage(msgs.command_error); }
            else if (!auth.isLordAlmighty(message.from.id)) { return sendMessage(msgs.unauth); }
            else { return objectify(admin.revokeOGL(cmd[1]), 'text', null); }

            break;
        case 'addletter':
            if (!auth.isNOGL(message.from.id)) { return sendMessage(msgs.unauth); }
            else {
                if (cmdArr.length != 2) { return sendMessage(msgs.command_error); }
                else if (cmdArr[1].length > 1) { return sendMessage("A letter has ONE CHARACTER"); }
                else { 
                    return objectify(dataManip.addLetter(auth.getNOGLHouse(message.from.id), cmdArr[1]), 'text', null); 
                }
            }
            break;
        case 'letters':
            return objectify(dataManip.getLetters(auth.getHouse(message.from.id)), 'text', null);
        case 'removeletter':
            if (!auth.isNOGL(message.from.id)) { return sendMessage(msgs.unauth); }
            else {
                if (cmdArr.length != 2) { return sendMessage(msgs.command_error); }
                else if (cmdArr[1].length > 1) { return sendMessage("A letter has ONE CHARACTER"); }
                else { 
                    return objectify(dataManip.removeLetter(auth.getNOGLHouse(message.from.id), cmdArr[1]), 'text', null); 
                }
            }
            break;
        case 'clearletters':
            if(!auth.isNOGL(message.from.id)) { return sendMessage(msgs.unauth); }
            else { return objectify(dataManip.clearLetters(auth.getNOGLHouse(message.from.id)), 'text', null); }
            break;
        case 'points':
            if(cmdArr.length==1) { return objectify(dataManip.getPoints(auth.getHouse(message.from.id)), 'text', null); }
            if(cmdArr.length==2) {
                if(!auth.isOGL(message.from.id)) { return sendMessage(msgs.not_ogl); }
                else if(!admin.isValidHouse(cmdArr[1])) { return sendMessage(msgs.bad_house); }
                else { return objectify(dataManip.getPoints(cmdArr[1]), 'text', null); }
            } else {
                return sendMessage(msgs.command_error);
            }
            break;
        case 'addpoints':
            if (!auth.isLordAlmighty(message.from.id)) { return sendMessage(msgs.not_ogl); }
            else if (cmdArr.length != 3) { return sendMessage(msgs.command_error); }
            else if (isNaN(cmdArr[2])) { return sendMessage(msgs.nan_error); }
            else if (cmdArr[2] < 0) { return sendMessage("No negative numbers!"); }
            else if (!admin.isValidHouse(cmdArr[1])) { return sendMessage(msgs.bad_house); }
            else {
                return objectify(dataManip.addPoints(cmdArr[1], cmdArr[2]), 'text', null);
            } 
            break;    
        case 'penalize':
        case 'penalise':
            if (!auth.isOGL(message.from.id)) { return sendMessage(msgs.not_ogl); }
            else if (cmdArr.length != 3) { return sendMessage(msgs.command_error); }
            else if (isNaN(cmdArr[2])) { return sendMessage(msgs.nan_error); }
            else if (cmdArr[2] < 0) { return sendMessage("No negative numbers!"); }
            else if (!admin.isValidHouse(cmdArr[1])) { return sendMessage(msgs.bad_house); }
            else {
                return objectify(dataManip.subtractPoints(cmdArr[1], cmdArr[2]), 'text', null);
            } 
            break;
        default:
            return { text:"", type:'text', media:null, valid:false };
        }
    }
}

function objectify(text, type, media) {
    return { text: text, type: type, media: media, valid:true };
}

function sendMessage(msg) {
    return objectify(msg, 'text', null);
}

function contains(msg, str) {
    if (msg.indexOf(str) >= 0)   {
        return true;
    } else {
        return false;
    }
}


module.exports = {
    'getResponse': getResponse
}

var yuyen_sticker = 'BQADAgADAgEAAvR7GQABm0hmTR_O2gIC';
var varun_frisbee = 'AgADBQADB6gxG5zeNALdCWV9CofCnqHhsTIABHIhDZyGOiwNuicBAAEC';
