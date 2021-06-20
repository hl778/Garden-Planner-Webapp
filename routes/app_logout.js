/**
 * logout page
 */
'use strict';

let express = require("express");
let logout = express.Router();
const redirectLogin = require("../middlewares/redirectLogin");

// logout
logout.get('/', redirectLogin, (req, res) => {
    // passport function
    req.logout();
    res.redirect("/usr/520/");
});

module.exports = logout;