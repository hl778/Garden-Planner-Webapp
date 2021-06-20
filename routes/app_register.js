/**
 * register page
 */
'use strict';

// validator
// false: error.details error
// true: error object as a whole
const validateRequest = require('../middlewares/schemaValidator')(false);
let express = require("express");
// database schema
let User = require("../models/user");
// create router
let register = express.Router();
// authentication
let passport = require("passport");
// already logged in or not
const doubleLogin = require("../middlewares/doubleLogin");
// pexel API
const PexelsAPI = require('pexels-api-wrapper');
//Create Client instance by passing in API key
let pexelsClient = new PexelsAPI("563492ad6f917000010000019ab8e4cbba794eadab78fed0d02b1f6a");


//------------------------------routes--------------------------------------
// register
register.get('/', doubleLogin, function (req, res) {
    let pageRan = Math.floor((Math.random() * 500)) + 1;
    //Search Video API
    pexelsClient.searchVideos("garden", 1, pageRan)
        .then(function (result) {
            // if fetched result and valid
            if (result
                && result.videos instanceof Array
                && result.videos[0]
                && result.videos[0].video_files
                && result.videos[0].video_files[0]
            ) {
                let videoURL = result.videos[0].video_files[0].link;
                let originalURL = result.videos[0].url;
                let authorName = result.videos[0].user.name;
                let authorURL = result.videos[0].user.url;
                let passedInEjsVariable = {
                    originalURL: originalURL,
                    videoURL: videoURL,
                    authorName: authorName,
                    authorURL: authorURL
                };
                return res.render("register", {
                    // CSRF
                    csrfToken: req.csrfToken(),
                    passed: true,
                    passedInEjsVariable: passedInEjsVariable
                });
            } else {
                // if nonsense data returned
                return res.render("register", {
                    csrfToken: req.csrfToken(),
                    passed: false
                });
            }
        }).catch(function (e) {
        console.error(e);
        return res.render("register", {
            csrfToken: req.csrfToken(),
            passed: false
        });
    });
});

// POST registered form
register.post('/',doubleLogin,validateRequest,function (req, res, next) {
    // just in case, sanitize again after validate middleware
    let username = req.sanitize(req.body.username);
    let password = req.sanitize(req.body.password);
    let email = req.sanitize(req.body.email);
    let postCode = req.sanitize(req.body.postCode);
    // search if duplicate exists
    User.findOne({username: username}, function (err, user) {
        if (err) {
            return next(err);
        }
        // if username exists
        if (user) {
            req.flash("error", "Username already exists!");
            return res.redirect("/usr/520/register");
        } else {
            // store user input
            let storeItem = {
                username: username,
                // hashed password will be saved in save() function below
                // plain password will NOT be passed into database
                password: password,
            };
            // check if optional fields are filled
            if(typeof email!='undefined') {
                User.findOne({email: email}, function (err, emailExist) {
                    if (err) {
                        return next(err);
                    }
                    if(emailExist) {
                        req.flash("error", "Email already registered,"
                            +" please choose a different one.");
                        return res.redirect("/usr/520/register");
                    }
                });
                storeItem.email = email;
            }
            //only store postcode if it exists
            if(typeof postCode!='undefined') {
                storeItem.postCode = postCode;
            }
            // update database record
            let newUser = new User(storeItem);
            // call pre-defined schema method in ~/models/user.js
            // the only reason pass 'next' is because there is another callback below
            newUser.save(next, function (err) {
                if (err) {
                    console.log("login callback or database went wrong.");
                    return res.status(500).render('maintenance');
                }
            });
        }
    });
    // auto login after registering
}, passport.authenticate("login", {
    successRedirect: "/usr/520/",
    failureRedirect: "/usr/520/register",
    // write to flash card
    failureFlash: true
}));

module.exports = register;