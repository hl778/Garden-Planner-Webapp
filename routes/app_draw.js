/**
 * draw plants page
 */
'use strict';

let express = require("express");
// create router
let draw = express.Router();
const redirectLogin = require("../middlewares/redirectLogin");
// AR draw
draw.get('/', function (req, res) {
    res.render('draw');
    return;
});

module.exports = draw;