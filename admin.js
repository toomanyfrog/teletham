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



var houses = {};

populateArrays();

function populateArrays() {
    houses.aviur = []
    houses.amaranth = []
    houses.varjo = []
    houses.levian = []
    houses.arete = []
    houses.nidhogg = []
    Object.keys(studentsInfo_obj).forEach(function (student) {
        
        var studentObj = studentsInfo_obj[student];
        var house = studentObj.house
        houses[house].push([studentObj.firstname, student]);
    });
}

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
    studentsInfo_obj[id] = {
            firstname: firstname,
            matric: matric.toUpperCase(),
            ogl: false,
            nogl: false,
            isLordAlmighty: false,
            house: house
    };
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "Added!";
}

function removeStudent(id) {
    if (!studentsInfo_obj.hasOwnProperty(id)) {
        return "Student doesn't exist";
    }
    
    delete studentsInfo_obj[id];
    console.log("deleted obj: " + studentsInfo_obj[id])
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "Removed!";
}

function getStudents(house) {
    populateArrays();
    var retStr = "";
    houses[house].forEach(function (studentObj) {
        retStr += studentObj[0] + " " + studentObj[1] + "\n";
    });
    return retStr;
                          
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
    studentsInfo_obj[id] = {
            firstname: firstname,
            matric: matric.toUpperCase(),
            ogl: true,
            nogl: false,
            isLordAlmighty: false,
            house: house
    };
    
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    populateArrays();
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
    
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
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
    
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "REVOKED";
}

function makeNOGL(phone, house) {
    if (!house) {
        return "Enter a house after phoneID."
    }
    if (!isValidHouse(house)) {
        return '"' + house + '" is an invalid house. Try again'
    }
    for (var phone in studentsInfo_obj) {
        if(studentsInfo_obj.hasOwnProperty(phone)) {
            var student = studentsInfo_obj[phone];
            for(var property in student) {
                if (property == "nogl") {
                    if (student.hasOwnProperty(property)) {
                        student.nogl = true;
                    }
                }
            }
        }
    }
    
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "PROMOTED to NOGL";
}

function revokeNOGL(phone) {
    for (var phone in studentsInfo_obj) {
        if(studentsInfo_obj.hasOwnProperty(phone)) {
            var student = studentsInfo_obj[phone];
            for(var property in student) {
                if (property == "nogl") {
                    if (student.hasOwnProperty(property)) {
                        student.nogl = false;
                        student.nogl_house = ""
                    }
                }
            }
        }
    }
    
    fs.writeFileSync(studentsInfoFilepath, JSON.stringify(studentsInfo_obj));
    return "REVOKED NOGL";
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
    'addStudent': addStudent,
    'removeStudent': removeStudent,
    'getStudents': getStudents
};