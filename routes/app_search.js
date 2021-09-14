/**
 * search plants page
 */
'use strict';

let express = require("express");
// create router
let search = express.Router();
const redirectLogin = require("../middlewares/redirectLogin");
// validator
// false: error.details error
// true: error object as a whole
const validateRequest = require('../middlewares/schemaValidator')(false);
// mongoose model
let Plant = require("../models/plant");

// search index
search.get('/', function (req, res) {
    res.render("search", {
        // CSRF
        csrfToken: req.csrfToken()
    });
});

// search plant result
search.post('/',validateRequest,function (req, res) {
    const keyword = req.sanitize(req.body.keyword);
    const queryPlant = {
        "plantName" : { $regex: keyword, $options: 'i' }
    }
    Plant.find(queryPlant,function (err,result) {
        if(err) {
            return next(err);
        }
        if(Array.isArray(result)&&result.length>0) {
            return res.render('search', {
                availablePlants: result,
                // CSRF
                csrfToken: req.csrfToken()
            });
        }else {
            req.flash("info","There is no such plant in database.");
            return res.render("search",{
                // CSRF
                message:req.flash("info"),
                csrfToken: req.csrfToken()
            });
        }
    });
});

module.exports = search;