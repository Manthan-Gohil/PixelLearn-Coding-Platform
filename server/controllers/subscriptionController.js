const { users } = require("../data/mockDb");

const updateSubscription = (req, res) => {
    const { plan } = req.body;
    const user = users.get(req.userId) || {};
    user.subscription = plan;
    users.set(req.userId, user);
    res.json({ success: true, subscription: plan });
};

module.exports = {
    updateSubscription
};
