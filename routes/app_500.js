/**
 * 500 page
 */
'use strict';

let express = require("express");
// create router
let voidPage = express.Router();
// res 500
voidPage.use(function (req, res) {
    res.statusCode = 500;
    res.render("500");
    return;
});
module.exports = voidPage;