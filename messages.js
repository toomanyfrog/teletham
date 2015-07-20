var not_ogl = "Hey, you're not an OGL!";
var help =
    'Here\'s what you can ask Thambot! ' + 
    '\nType /points to get your house\'s current points.' +
    '\nType /password [PASSWORD] to enter in a password for an AcrossNUS station.' + 
    "\nType /ogl_help if you are an OGL and you need help";

var bad_house = "That's not one of the houses...";
var command_error =
    'Thambot didn\'t understand that command. Thambot is confused! Type \'/help\' for more' +
    ' information.';
var nan_error = 
    "That's not a number Thambot knows how to add or subtract :( \nNumbers look like this: 1, 2, 3, 34583489"; 

var ogl_help = 
    "XFIRE: \n /penalize [house_name] [amount] for game rule violation \n" 
    + "Across NUS: \n /addletter [letter] \n /removeletter [letter] \n /clearletters";

//STILL HAVE TO FIX NOGL ADD HOUSE LETTERS 

var unauth = "Permission denied";

module.exports = {
    'not_ogl': not_ogl,
    'help': help,
    'bad_house': bad_house,
    'command_error': command_error,
    'nan_error': nan_error,
    'ogl_help': ogl_help,
    'unauth': unauth
}