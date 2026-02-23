const { enrollments } = require("../data/mockDb");

const enroll = (req, res) => {
    const { courseId } = req.body;
    const userEnrollments = enrollments.get(req.userId) || [];
    if (!userEnrollments.includes(courseId)) {
        userEnrollments.push(courseId);
        enrollments.set(req.userId, userEnrollments);
    }
    res.json({ success: true, enrolledCourses: userEnrollments });
};

const getEnrolledCourses = (req, res) => {
    const userEnrollments = enrollments.get(req.userId) || [];
    res.json({ enrolledCourses: userEnrollments });
};

module.exports = {
    enroll,
    getEnrolledCourses
};
