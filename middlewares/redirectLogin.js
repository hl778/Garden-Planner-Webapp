/**
 * redirect login if not logged in
 */
'use strict';

const redirectLogin = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    }else {
        req.flash("info","Please login first to access the page");
        res.redirect("/usr/520/login");
    }
}

module.exports = redirectLogin;