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
        if (studentsInfo[id].nogl_house) {
            return studentsInfo[id].nogl_house
        }
        return studentsInfo[id].house;
    }
    return false;
}

function getNOGLHouse(id) {
    if(isAllowed(id)) {
       return studentsInfo[id].nogl_house;
    }
    return false;
}


function isOGL(id) {
    if(isAllowed(id)) {
	   return studentsInfo[id].ogl;
    }
    return false;
}

function isNOGL(id) {
    if(isAllowed(id)) {
        if(isOGL(id)) {
	       return studentsInfo[id].nogl;
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
        return studentsInfo[id].isLordAlmighty;
    }
    return false;
}

function getNOGL(id) {
    var house = studentsInfo[id].house;
    var nogl = "Tham"
    for (student in studentsInfo) {
        if (studentsInfo[student].nogl === true && studentsInfo[student].nogl_house === house) {
            nogl = studentsInfo[student].firstname
            return nogl
        }
    }
    return nogl

}

module.exports = {
    isAllowed: isAllowed,
    getHouse: getHouse,
    getNOGLHouse: getNOGLHouse,
    getNOGL: getNOGL,
    isOGL: isOGL,
    isNOGL: isNOGL,
    getFirstName: getFirstName,
    isLordAlmighty: isLordAlmighty
};