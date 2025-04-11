const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try { 
        const { username, email, password, phone, userType } = req.body;
        const newUser = new User({email, username, phone, userType});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Nivaas-Luxe!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    // Populate user listings after successful login
    const user = await User.findById(req.user._id).populate('listings');
    req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome back to Nivaas-Luxe!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};

module.exports.renderDashboard = async (req, res) => {
    // First get user without population to check if bookings exist
    const user = await User.findById(req.user._id);
    
    if (user.bookings && user.bookings.length > 0) {
        await user.populate({
            path: 'bookings',
            populate: {
                path: 'listing',
                select: 'title'
            }
        });
    }
    res.render("users/dashboard.ejs", { user });
};
