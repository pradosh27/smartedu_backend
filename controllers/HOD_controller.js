const bcrypt = require('bcrypt');
const HOD = require('../models/HODSchema.js');
const Subject = require('../models/subjectSchema.js');
const HODRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingHOD = await HOD.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingHOD) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const HOD = new HOD({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await HOD.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const HODLogIn = async (req, res) => {
    try {
        let HOD = await HOD.findOne({ rollNum: req.body.rollNum, name: req.body.HODName });
        if (HOD) {
            const validated = await bcrypt.compare(req.body.password, HOD.password);
            if (validated) {
                HOD = await HOD.populate("school", "schoolName")
                HOD = await HOD.populate("sclassName", "sclassName")
                HOD.password = undefined;
                HOD.examResult = undefined;
                HOD.attendance = undefined;
                res.send(HOD);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "HOD not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getHOD = async (req, res) => {
    try {
        let HOD = await HOD.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (HOD.length > 0) {
            let modifiedHOD = HOD.map((HOD) => {
                return { ...HOD._doc, password: undefined };
            });
            res.send(modifiedHOD);
        } else {
            res.send({ message: "No HOD found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getHODDetail = async (req, res) => {
    try {
        let HOD = await HOD.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (HOD) {
            HOD.password = undefined;
            res.send(HOD);
        }
        else {
            res.send({ message: "No HOD found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteHOD = async (req, res) => {
    try {
        const result = await HOD.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteHODs = async (req, res) => {
    try {
        const result = await HOD.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No HOD found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteHODByClass = async (req, res) => {
    try {
        const result = await HOD.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No HOD found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateHOD = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await HOD.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const HOD = await HOD.findById(req.params.id);

        if (!HOD) {
            return res.send({ message: 'HOD not found' });
        }

        const existingResult = HOD.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            HOD.examResult.push({ subName, marksObtained });
        }

        const result = await HOD.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const HODAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const HOD = await HOD.findById(req.params.id);

        if (!HOD) {
            return res.send({ message: 'HOD not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = HOD.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the HOD has already attended the maximum number of sessions
            const attendedSessions = HOD.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            HOD.attendance.push({ date, status, subName });
        }

        const result = await HOD.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllHODAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await HOD.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllHODAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await HOD.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeHODAttendanceBySubject = async (req, res) => {
    const HODId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await HOD.updateOne(
            { _id: HODId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeHODAttendance = async (req, res) => {
    const HODId = req.params.id;

    try {
        const result = await HOD.updateOne(
            { _id: HODId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    HODRegister,
    HODLogIn,
    getHOD,
    getHODDetail,
    deleteHODs,
    deleteHOD,
    updateHOD,
    HODAttendance,
    deleteHODByClass,
    updateExamResult,

    clearAllHODAttendanceBySubject,
    clearAllHODAttendance,
    removeHODAttendanceBySubject,
    removeHODAttendance,
};