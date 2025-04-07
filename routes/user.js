const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);
router.get("/users/dashboard", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
}, userController.renderDashboard);

// Policy Pages Routes
router.get("/privacy-policy", (req, res) => {
    res.render("policies/privacy");
});

router.get("/terms-of-service", (req, res) => {
    res.render("policies/terms");
});

router.get("/cancellation-policy", (req, res) => {
    res.render("policies/cancellation");
});

router.get("/refund-policy", (req, res) => {
    res.render("policies/refund");
});

router.get("/trust-safety", (req, res) => {
    res.render("policies/trust-safety");
});

router.get("/contact-us", (req, res) => {
    res.render("policies/contact");
});

module.exports = router;
