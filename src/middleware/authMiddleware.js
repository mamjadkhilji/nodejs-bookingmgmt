const User = require('../models/User');

const authenticateMiddleware = async (req, res, next) => {
    console.log("Authenticating user");
    try {
        const authUser = req.headers.loginid;
        const authPasskey = req.headers.passkey;

        const isAuthenticate = await User.findOne({ userid: authUser, passkey: authPasskey });
        if (!isAuthenticate) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authenticateMiddleware;