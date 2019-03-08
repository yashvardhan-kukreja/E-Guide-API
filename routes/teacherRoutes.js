const TeacherController = require('../controllers/teacherController');
const router = require('express').Router();
const untoken_router = require('express').Router();

try {
    var config = require('../config');
} catch (e) {
    console.log("Unable to access config variables");
}

const secret = process.env.SECRET || config.SECRET;

router.use((req, res, next) => {
    let token = req.headers['x-access-token'];
    TeacherController.verifyToken(token, secret).then(data => {
        req.decoded = data.decoded;
        next();
    }).catch(err => res.json(err));
});

// Fetching the details of the teacher
router.get('/fetchDetails', (req, res) => {
    TeacherController.fetchDetails(req.decoded._id).then(data => res.json(data)).catch(err => res.json(err));
});

// Adding skills to the teacher
router.post('/addSkills', (req, res) => {
    let skills = req.body.skills;
    TeacherController.addSkills(req.decoded._id, skills).then(data => res.json(data)).catch(err => res.json(err));
});

untoken_router.post('/addSkills', (req, res) => {
    let skills = req.body.skills;
    let email = req.body.teacher_email;
    TeacherController.addSkillsByEmail(email, skills).then(data => res.json(data)).catch(err => res.json(err));
});


// Fetch the list of all the skills
untoken_router.get('/fetchAllSkills', (req, res) => {
    TeacherController.fetchAllSkills().then(data => res.json(data)).catch(err => res.json(err));
});

//Adding skills to the teacher using teacher email
router.get('/fetchFavStudents', (req, res) => {
    let teacher_id = req.decoded._id;
    TeacherController.fetchFavoredStudentsOfATeacher(teacher_id).then(data => res.json(data)).catch(err => res.json(err));
});

module.exports = {
    router: router,
    untoken_router: untoken_router
};