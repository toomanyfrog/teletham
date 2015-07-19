var jf = require("jsonfile");

var studentsInfoFilepath =  './private/students_info.json';
var studentsInfo = jf.readFileSync(studentsInfoFilepath);

//unused
function isAllowed(id) {
    studentsInfo = jf.readFileSync(studentsInfoFilepath);
    return studentsInfo.hasOwnProperty(id);
}

function getHouse(id) {
    if(isAllowed(id)) {
	   return studentsInfo[id].house;
    }
    return false;
}

function isOGL(id) {
    if(isAllowed(id)) {
	   return studentsInfo[id].ogl;
    }
    return false;
}

function isSM(id) {
    if(isAllowed(id)) {
        if(isOGL(id)) {
	       return studentsInfo[id].sm;
        }
    }
    return false;
}

//unused
function getFirstName(id) {
    if(isAllowed(id)) {
        return studentsInfo[id].firstname;
    }
    return false;
}

function isLordAlmighty(id) {
    if(isAllowed(id)) {
        return studentsInfo[id].lordAlmighty;
    }
    return false;
}

module.exports = {
    isAllowed: isAllowed,
    getHouse: getHouse,
    isOGL: isOGL,
    isSM: isSM,
    getFirstName: getFirstName,
    isLordAlmighty: isLordAlmighty
};