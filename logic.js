var admin = require('./admin');
var aroundNUS = require('./aroundNUS');
var auth = require('./auth');
var dataManip = require('./modifyHouseData');
var msgs = require('./messages');
var broadcaster = require('./broadcaster')



function getResponse(message) {
    var cmd, cmdArr, msg;
    
    if (!auth.isAllowed(message.from.id) && !auth.isOGL(message.from.id)) {
        return sendMessage("Are you a USP freshman??????????");
    }
    
    if (message.text != null) {
        
        msg = message.text.toLowerCase();

        if (message.text[0] == '/') {
            
            cmdArr = (msg.substr(1)).split(' '); 
            cmd = cmdArr[0]; 
        }
        else {
            if (msg == 'yuyen') return objectify('', 'sticker', yuyen_sticker);
            if (msg == 'frisbee') return objectify('Did someone say FRISBEE?', 'image', varun_frisbee);
            if (msg == 'hello') return objectify("Hello, " +  message.from.first_name + "!", 'text', null);
        }
    }
    
    switch(cmd) {
            
            
        //////////////////////////////////////////////MESSAGES
        case 'help':
            return sendMessage(msgs.help);
            
            break;
        case 'ogl_help': 
            if (!auth.isOGL(message.from.id)) {
                return sendMessage(msgs.not_ogl);
            } else {
                return sendMessage(msgs.ogl_help);
            }
            break;
            
        case 'broadcast':
            if (auth.isLordAlmighty(message.from.id)) {
                if (cmdArr.length != 3) {
                    return objectify(msgs.command_error, 'text', null);
                } else {
                    var error = broadcaster.broadcast(cmdArr[2], cmdArr[1]);
                    if (error != null) {
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
        case 'addfreshie':
            if(cmdArr.length!=3) { return sendMessage(msgs.command_error); }
            else {
                var matric = cmdArr[1];
                var house = cmdArr[2];
                return objectify(admin.addStudent(message.from.id, message.from.first_name, matric, house), 'text', null);
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
            break;
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
            return { text:"", type:'text', media:null, valid:false } ;
    }
    
    
}

function objectify(text, type, media) {
    return { text: text, type: type, media: media, valid:true };
}

function sendMessage(msg) {
    return objectify(msg, 'text', null);
}


module.exports = {
    'getResponse': getResponse
}







var yuyen_sticker = 'BQADAgADAgEAAvR7GQABm0hmTR_O2gIC';
var varun_frisbee = 'AgADBQADB6gxG5zeNALdCWV9CofCnqHhsTIABHIhDZyGOiwNuicBAAEC';