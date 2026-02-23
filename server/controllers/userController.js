const { users } = require("../data/mockDb");

const getProfile = (req, res) => {
    const user = users.get(req.userId) || {
        id: req.userId,
        name: "Alex Developer",
        email: "learner@pixellearn.com",
        subscription: "pro",
        xp: 2450,
        streak: 12,
        badges: [],
        enrolledCourses: [],
        completedExercises: [],
    };
    res.json(user);
};

const updateProfile = (req, res) => {
    const user = users.get(req.userId) || {};
    const updated = { ...user, ...req.body, id: req.userId };
    users.set(req.userId, updated);
    res.json(updated);
};

module.exports = {
    getProfile,
    updateProfile
};
