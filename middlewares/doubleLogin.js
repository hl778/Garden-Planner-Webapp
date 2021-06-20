/**
 * prevent double login
 */

'use strict';

const doubleLogin = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
        req.flash("info","Please logout before accessing that page.");
        res.redirect("/usr/520/");
    }else {
        next();
    }
}

module.exports = doubleLogin;