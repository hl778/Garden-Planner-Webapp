/**
 * 404 page
 */
'use strict';

let express = require("express");
// create router
let voidPage = express.Router();
// res 404
voidPage.use(function (req, res) {
    return res.status(404).render("404");
});
module.exports = voidPage;