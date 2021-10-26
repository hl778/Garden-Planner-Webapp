/**
 * login page
 */
'use strict';

let express = require("express");
let login = express.Router();
let passport = require("passport");
// prevent double login
const doubleLogin = require("../middlewares/doubleLogin");
// validator
// false: error.details error
// true: error object as a whole
const validateRequest = require('../middlewares/schemaValidator')(false);
// require node-fetch
const fetch = require('node-fetch');
global.fetch = fetch;
// require unsplash
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;
const unsplash = new Unsplash({accessKey: "b56zcKpsAxvONB-OXFySJz5Ebo39fHsuD_Myc_pihaE"});

// login
login.get('/', doubleLogin,function (req, res) {
    // api unsplash
    let imageBack;
    const queryImg = {query: "home garden"};
    unsplash.photos.getRandomPhoto(queryImg)
        .then(toJson)
        .then(json => {
            if (json && json.urls) {
                imageBack = json.urls.regular;
                // author url
                let author = json.user.links.html;
                author = author + "?utm_source=Gardening-Web-App&utm_medium=referral";
                // unsplash ref url
                let urlUnsplash = "https://unsplash.com/?utm_source="
                    +req.app.locals.title+"&utm_medium=referral";
                // name of author
                let authorName = json.user.name;
                res.render('login',{
                    imageBack:imageBack,
                    author:author,
                    urlUnsplash: urlUnsplash,
                    authorName:authorName,
                    // CSRF
                    csrfToken: req.csrfToken()
                });
            } else {
                // unsplash ref url
                let urlUnsplash = "https://unsplash.com/?utm_source="
                    +req.app.locals.title+"&utm_medium=referral";
                res.render('login',{
                    urlUnsplash: urlUnsplash,
                    //CSRF
                    csrfToken: req.csrfToken() });
            }
        })
        .catch(err => {
            console.log(err);
            // unsplash ref url
            let urlUnsplash = "https://unsplash.com/?utm_source="
                +req.app.locals.title+"&utm_medium=referral";
            res.render("login",{
                urlUnsplash: urlUnsplash,
                //CSRF
                csrfToken: req.csrfToken() });
        });
});
// logged in
login.post('/', doubleLogin,validateRequest,passport.authenticate("login",{
    successRedirect: "/usr/520/",
    failureRedirect: "/usr/520/login",
    // connect flash card
    failureFlash: true
}));

module.exports = login;