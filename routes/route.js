const router = require('express').Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassHOD } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');

const {
    HODRegister,
    HODLogIn,
    getHOD,
    getHODDetail,
    deleteHOD,
    deleteHODs,
    updateHOD,
    HODAttendance,
    deleteHODByClass,
    updateExamResult,
    clearAllHODAttendanceBySubject,
    clearAllHODAttendance,
    removeHODAttendanceBySubject,
    removeHODAttendance } = require('../controllers/HOD_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// HOD

router.post('/HODReg', HODRegister);
router.post('/HODLogin', HODLogIn)

router.get("/HOD/:id", getHOD)
router.get("/HOD/:id", getHODDetail)

router.delete("/HOD/:id", deleteHODs)
router.delete("/HODClass/:id", deleteHODByClass)
router.delete("/HOD/:id", deleteHOD)

router.put("/HOD/:id", updateHOD)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/HODAttendance/:id', HODAttendance)

router.put('/RemoveAllHODSubAtten/:id', clearAllHODAttendanceBySubject);
router.put('/RemoveAllHODAtten/:id', clearAllHODAttendance);

router.put('/RemoveHODSubAtten/:id', removeHODAttendanceBySubject);
router.put('/RemoveHODAtten/:id', removeHODAttendance)

// Teacher

router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn)

router.get("/Teachers/:id", getTeachers)
router.get("/Teacher/:id", getTeacherDetail)

router.delete("/Teachers/:id", deleteTeachers)
router.delete("/TeachersClass/:id", deleteTeachersByClass)
router.delete("/Teacher/:id", deleteTeacher)

router.put("/TeacherSubject", updateTeacherSubject)

router.post('/TeacherAttendance/:id', teacherAttendance)

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)

// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);

// Sclass

router.post('/SclassCreate', sclassCreate);

router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail)

router.get("/Sclass/HOD/:id", getSclassHOD)

router.delete("/Sclasses/:id", deleteSclasses)
router.delete("/Sclass/:id", deleteSclass)

// Subject

router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail)

router.delete("/Subject/:id", deleteSubject)
router.delete("/Subjects/:id", deleteSubjects)
router.delete("/SubjectsClass/:id", deleteSubjectsByClass)

module.exports = router;