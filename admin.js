//@author YW
/**
 "6593716368": {
        "firstname": "Varun",
        "lastname": "Patro",
        "matric": "A0131729E",
        "email": "varunpatro@u.nus.edu",
        "ogl": true,
        "house": "ianthe"
    },
    **/

var fs = require('fs');
var studentsInfoFilepath =  './private/students_info.json';
var studentsInfo_obj =  JSON.parse(fs.readFileSync(studentsInfoFilepath).toString()); //OBJECT

var already_registered_msg = "You're already registered, you dummy!";
var bad_matric_msg = "Bad matric number!";
var bad_house_msg = "That's not one of the houses...";

function addStudent(id, firstname, matric, house) {
    if (studentsInfo_obj.hasOwnProperty(id)) {
        return already_registered_msg;
    }
    if (!isValidMatric(matric)) {
        return bad_matric_msg;
    }
    if (!isValidHouse(house)) {
        return bad_house_msg;
    }
    Object.defineProperty(studentsInfo_obj,id,{
        value: { firstname: firstname,
                matric: matric.toUpperCase(),
                ogl: false,
                house: house },
        enumerable: true
    });
    fs.writeFile(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "Added!";
}
function addOGL(id, firstname, matric, house) {
    if (studentsInfo_obj.hasOwnProperty(id)) {
        return already_registered_msg;
    } 
    if (!isValidMatric(matric)) {
        return bad_matric_msg;
    }
    if (!isValidHouse(house)) {
        return bad_house_msg;
    }
    Object.defineProperty(studentsInfo_obj,id,{
        value: { firstname: firstname,
                matric: matric.toUpperCase(),
                ogl: true,
                house: house },
        enumerable: true
    });
    fs.writeFile(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "Added!";
}

function makeOGL(phone) {
    for (var phone in studentsInfo_obj) {
        if(studentsInfo_obj.hasOwnProperty(phone)) {
            var student = studentsInfo_obj[phone];
            for(var property in student) {
                if (property == "ogl") {
                    if (student.hasOwnProperty(property)) {
                        if (student.ogl == false) {
                            student.ogl = true;
                        }
                    }
                }
            }
        }
    }
    console.log(JSON.stringify(houses_obj));
   // fs.writeFile(housesFilepath, JSON.stringify(houses_obj));
    return "PROMOTED";
}
function revokeOGL(phone) {
    for (var phone in studentsInfo_obj) {
        if(studentsInfo_obj.hasOwnProperty(phone)) {
            var student = studentsInfo_obj[phone];
            for(var property in student) {
                if (property == "ogl") {
                    if (student.hasOwnProperty(property)) {
                        if (student.ogl == true) {
                            student.ogl = false;
                        }
                    }
                }
            }
        }
    }
    console.log(JSON.stringify(houses_obj));
   // fs.writeFile(housesFilepath, JSON.stringify(houses_obj));
    return "REVOKED";
}

function makeStationMaster(phone) {
    if(!isOGL(phone)) return "If not OGL, how station master?";
    for (var phone in studentsInfo_obj) {
        if(studentsInfo_obj.hasOwnProperty(phone)) {
            var student = studentsInfo_obj[phone];
            for(var property in student) {
                if (property == "sm") {
                    if (student.hasOwnProperty(property)) {
                        if (student.sm == false) {
                            student.sm = true;
                        }
                    }
                }
            }
        }
    }
    return "PROMOTED";
}

function revokeStationMaster(phone) {
    if(!isOGL(phone)) return "If not OGL, how station master?";
    for (var phone in studentsInfo_obj) {
        if(studentsInfo_obj.hasOwnProperty(phone)) {
            var student = studentsInfo_obj[phone];
            for(var property in student) {
                if (property == "sm") {
                    if (student.hasOwnProperty(property)) {
                        if (student.sm == true) {
                            student.sm = false;
                        }
                    }
                }
            }
        }
    }
    return "REVOKED";
}

function isValidMatric(matric) {
    var m = matric.toUpperCase();
    if(m[0] != 'A' || m.length != 9 || m[1] != 0) {
        return false;
    } 
    if(!isNaN(m[8]) || isNaN(m.substr(1,7))) {
        return false;
    } 
    return true;
}

function isValidHouse(house) {
    var houses = ['aviur', 'varjo', 'amaranth', 'levian', 'arete', 'nidhogg'];
    for(var i=0; i<houses.length; i++) {
        if (house == houses[i]) {
            return true;
        }
    }
    return false;
}

module.exports = {
    'isValidHouse': isValidHouse,
    'addOGL': addOGL,
    'makeOGL': makeOGL,
    'revokeOGL': revokeOGL,
    'makeStationMaster': makeStationMaster,
    'revokeStationMaster': revokeStationMaster
};