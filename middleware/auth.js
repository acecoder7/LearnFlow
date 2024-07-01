const mongoose = require("mongoose");
const User = mongoose.model("users");

const ensureAuth = async (req, res, next) => {
    if (req.cookies.user_id) {
        const user = await User.findById(req.cookies.user_id);
        if (user) {
            return next();
        }
    }

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/auth/login");
}

const ensureGuest = async (req, res, next) => {
    if (req.cookies.user_id) {
        const user = await User.findById(req.cookies.user_id);
        if (user) {
            return res.redirect("/user/dashboard");
        }
    }

    if (req.isAuthenticated()) {
        return res.redirect("/user/dashboard");
    }

    next();
}


module.exports = { ensureAuth, ensureGuest };