/**
 * User profile operations
 * Mock implementation - in production, use database
 */

const users = new Map();

/**
 * Get user profile
 */
function getUserProfile(req, res, next) {
  try {
    const userId = req.userId;
    const user = users.get(userId) || {
      id: userId,
      name: "Alex Developer",
      email: "learner@pixellearn.com",
      subscription: "pro",
      xp: 2450,
      streak: 12,
      badges: [],
      enrolledCourses: [],
      completedExercises: [],
      createdAt: new Date(),
    };

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 */
function updateUserProfile(req, res, next) {
  try {
    const userId = req.userId;
    const updates = req.body;

    const user = users.get(userId) || { id: userId };
    const updated = { ...user, ...updates, id: userId, updatedAt: new Date() };
    users.set(userId, updated);

    res.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
};
