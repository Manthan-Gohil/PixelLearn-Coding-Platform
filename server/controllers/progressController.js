const { progress } = require("../data/mockDb");

const completeExercise = (req, res) => {
    const { exerciseId, xpReward } = req.body;
    const userProgress = progress.get(req.userId) || {
        completedExercises: [],
        xp: 0,
        streak: 0,
    };

    if (!userProgress.completedExercises.includes(exerciseId)) {
        userProgress.completedExercises.push(exerciseId);
        userProgress.xp += xpReward || 0;
        userProgress.streak += 1;
        progress.set(req.userId, userProgress);
    }

    res.json({ success: true, progress: userProgress });
};

const getProgress = (req, res) => {
    const userProgress = progress.get(req.userId) || {
        completedExercises: [],
        xp: 0,
        streak: 0,
    };
    res.json(userProgress);
};

module.exports = {
    completeExercise,
    getProgress
};
