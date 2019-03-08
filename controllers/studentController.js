const StudentTransactions = require('../database/student/studentTransactions');
const TeacherTransactions = require('../database/teacher/teacherTransactions');
const FavoriteTransactions = require('../database/favorite/favoriteTransactions');

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

module.exports.verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    console.error(err);
                    reject({success: false, message: "An error occurred"});
                }
                else {
                    decoded ? resolve(decoded) : reject({success: false, message: "Corrupted token provided"});
                }
            });
        } else {
            reject({success: false, message: "No token provided"});
        }
    });
};

module.exports.fetchDetails = (id) => {
    return new Promise((resolve, reject) => {
        StudentTransactions.findStudentById(id, (err, outputStudent) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                outputStudent ? resolve({success: true, message: "Students details fetched", student: outputStudent}) : reject({success: false, message: "No such student found"});
            }
        });
    });
};

module.exports.favorTeacher = (studentId, teacherId, skillId) => {
    return new Promise((resolve, reject) => {
        FavoriteTransactions.addFavorite(studentId, teacherId, skillId, (err) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "A same favorite already found"});
            } else {
                resolve({success: true, message: "Teacher added to favorites"});
            }
        });
    });
};

module.exports.unfavorTeacher = (studentId, teacherId, skillId) => {
    return new Promise((resolve, reject) => {
        FavoriteTransactions.removeFavorite(studentId, teacherId, skillId, err => {
            if (err) {
                console.error(err);
                reject({success: false, message: "Problem occurred while removing the teacher from favorites"});
            } else {
                resolve({success: true, message: "Removed the teacher from favorites"});
            }
        });
    });
};

module.exports.fetchFavTeachers = (studentId) => {
    return new Promise((resolve, reject) => {
        FavoriteTransactions.findFavoritesForAStudent(studentId, (err, output) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!output)
                    reject({success: false, message: "An error occurred"});
                else
                    resolve({success: true, message: "Favorite teachers fetched successfully", favTeachers: output});
            }
        });
    });
};

module.exports.fetchAllTeachers = () => {
    return new Promise((resolve, reject) => {
        TeacherTransactions.fetchAllTeachers((err, outputTeachers) => {
            if (err) {
                console.error(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputTeachers)
                    reject({success: false, message: "No teachers found"});
                else
                    resolve({success: true, message: "Teachers fetched successfully!", teachers: outputTeachers})
            }
        });
    });
};