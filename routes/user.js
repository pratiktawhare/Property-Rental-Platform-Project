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

router.route("/users/profile")
    .get((req, res) => {
        if (!req.isAuthenticated()) {
            req.flash("error", "You must be signed in");
            return res.redirect("/login");
        }
        res.render("users/profile", { user: req.user });
    })
    .post(wrapAsync(async (req, res) => {
        if (!req.isAuthenticated()) {
            req.flash("error", "You must be signed in");
            return res.redirect("/login");
        }
        
        const { username, userType, phone } = req.body.user;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { username, userType, phone },
            { new: true }
        );
        
        req.flash("success", "Profile updated successfully");
        res.redirect("/users/profile");
    }));
router.get("/users/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'bookings',
                populate: {
                    path: 'listing',
                    select: 'title image location'
                }
            })
            .populate({
                path: 'listings',
                select: 'title image location'
            });
            
        res.render("users/dashboard", {
            user,
            bookings: user.bookings,
            listings: user.listings
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        req.flash("error", "Failed to load dashboard");
        res.redirect("/");
    }
});

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
