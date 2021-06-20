/**
 * user profile page
 */
'use strict';

let express = require("express");
let passport = require("passport");
let users = express.Router();
// mongoose model
let User = require("../models/user");
let Plant = require("../models/plant");
let userPlants = require("../models/userPlants");
const redirectLogin = require("../middlewares/redirectLogin");
const doubleLogin = require("../middlewares/doubleLogin");
// validator
// false: error.details error
// true: error object as a whole
const validateRequest = require('../middlewares/schemaValidator')(false);

//------------------------------routes--------------------------------------
// profile route
users.get("/profile/:username", function (req, res, next) {
    let username = req.sanitize(req.params.username);
    User.findOne({username: username}, function (err, user) {
        if (err) {
            return next(err);
        }
        // if no such user
        if (!user) {
            return next(404);
        }
        // if admin group
        if(user.userGroup===0) {
            Plant.find({verified:false}, function (errV, verify) {
                if(errV) {
                    return next(err);
                }
                // if no such plants
                if (!verify || verify.length===0) {
                    return res.render("profile", {
                        user: user
                    });
                }
                // if has plants waiting to be verified
                return res.render("profile", {
                    user: user,
                    //CSRF
                    csrfToken: req.csrfToken(),
                    verify:verify
                });
            });
        }else {
            // if regular user group
            res.render("profile", {
                user: user
            });
        }

    });
});

// edit profile route
users.get("/edit", redirectLogin, function (req, res) {
    res.render("edit", {
        // CSRF
        csrfToken: req.csrfToken()
    });
});

// post updated profile route
users.post("/edit", redirectLogin, function (req, res, next) {
    // populated by passport midware
    req.user.displayName = req.body.displayName;
    req.user.email = req.body.email;
    req.user.houseNo = req.body.houseNo;
    req.user.streetAddress = req.body.streetAddress;
    req.user.postCode = req.body.postCode;
    req.user.save(function (err) {
        if (err) {
            next(err);
            return
        }
        // update flash card info
        req.flash("info", "Profile updated");
        res.redirect("/usr/520/users/edit");
    });
});
// GET render reset password page
users.get("/reset", doubleLogin, function (req, res) {
    res.render("login", {
        reset: true,
        // CSRF
        csrfToken: req.csrfToken()
    });
});

// POST reset password
// should be PUT, but HTML doesn't support
users.post("/reset", doubleLogin, validateRequest, function (req, res, next) {
    let username = req.sanitize(req.body.username);
    let password = req.sanitize(req.body.password);
    User.findOne({username: username}, function (err, user) {
        if (err) {
            return res.status(500).render('maintenance');
        }
        // if no such user
        if (!user) {
            res.render("login", {
                // CSRF
                csrfToken: req.csrfToken(),
                reset: true,
                nouser: username
            });
        } else {
            user.password = password;
            // call pre-defined schema method in ~/models/user.js
            // the only reason pass 'next' is because there is another callback below
            user.save(next, function (err) {
                if (err) {
                    console.log("bcrypt or database went wrong.");
                    return res.status(500).render('maintenance');
                }
            });
        }
    });
}, passport.authenticate("login", {
    successRedirect: "/usr/520/",
    failureRedirect: "/usr/520/users/reset",
    failureFlash: true
}));

// update user plant collection
users.post('/input_userPlants', redirectLogin, validateRequest, function (req, res,next) {
    // get form data
    let username = req.user.username;
    let userPlantsGet = req.sanitize(req.body.userPlants);
    let lastVisitedURL = req.sanitize(req.body.lastVisitedURL);
    // find current user's userPlants
    // use populate to go in one level deep into the field
    User.findOne({username: username}).populate('userPlants').exec((err, findUser) => {
        if (err) {
            return next(err);
        }
        // if no such user
        // although almost impossible
        if (!findUser) {
            return next(404);
        }
        // if user exists
        // convert form string to array
        userPlantsGet = userPlantsGet.split(',');
        // count how many plant
        let countUnique = userPlantsGet.length;
        userPlantsGet.forEach(function (plant) {
            let alreadyExist = false;
            // if user has some plants in place
            if (findUser.userPlantsBackup && findUser.userPlantsBackup.length != 0) {
                for (let i = 0; i < findUser.userPlantsBackup.length; i++) {
                    // check if duplicate plants
                    if (findUser.userPlantsBackup[i] === plant) {
                        alreadyExist = true;
                        break;
                    }
                    alreadyExist = false;
                }
            }
            // only store plants have not been added yet
            if (!alreadyExist) {
                // count number of duplicates
                countUnique--;
                Plant.findOne({plantName: plant},function (errP,dataP) {
                    if(errP||!dataP) {
                        return next(err);
                    }
                    if(dataP) {
                        // push to user schema
                        let storeJson = {};
                        // pass into userPlants object
                        storeJson.plantName = plant;
                        storeJson.modifiedBy = "admin";
                        storeJson.seeding={
                            text:dataP.seeding.text,
                            start_date:dataP.seeding.start_date,
                            end_date:dataP.seeding.end_date,
                            color:dataP.seeding.color
                        };
                        storeJson.flowering={
                            text:dataP.flowering.text,
                            start_date:dataP.flowering.start_date,
                            end_date:dataP.flowering.end_date,
                            color:dataP.flowering.color
                        };
                        // the userPlant field is an objectID reference, should create an object first
                        let newUserPlants = new userPlants(storeJson);
                        newUserPlants.save();
                        // push the object into user collection
                        findUser.userPlants.push(newUserPlants);
                        // also keep a record of the plant name in another array
                        // reason for this is when user edit the calendar, keep the record consistent
                        // because the calendar will CRUD userPlants field
                        findUser.userPlantsBackup.push(plant);
                        // save to user collection
                        findUser.save();
                    }
                });
            }
        });
        // get ejs file name from URL
        let ejsName = lastVisitedURL.split('/');
        //list and search page
        if(ejsName[ejsName.length - 1]==='list') {
            let tempCard = {
                updatedUser: findUser,
                countUnique:countUnique,
                originalSelectedNumber:userPlantsGet.length
            };
            req.flash("carrier",tempCard);
            res.redirect("/usr/520/"+ejsName[ejsName.length - 1]);
        }else {
            // only get the last part since it's the ejs file name
            res.render(ejsName[ejsName.length - 1], {
                // CSRF
                csrfToken: req.csrfToken(),
                updatedUser: findUser,
                countUnique:countUnique,
                originalSelectedNumber:userPlantsGet.length
            });
        }
    });
});

// POST add plants to database
users.post("/addPlants", redirectLogin, validateRequest, function (req, res,next) {
    const usernameNow = req.user.username;
    const userGroup = req.user.userGroup===0;
    const seedingPhase = ' can be seeded <i class="fas fa-seedling"></i>';
    const floweringPhase = ' are flowering <i class="fas fa-tree"></i>';
    // get input
    let plantName = req.sanitize(req.body.plantName);
    let type = req.sanitize(req.body.type);
    let seeding_start_date = req.sanitize(req.body.seeding_start_date);
    let seeding_end_date = req.sanitize(req.body.seeding_end_date);
    let seeding_color = req.sanitize(req.body.seeding_color);
    let flowering_start_date = req.sanitize(req.body.flowering_start_date);
    let flowering_end_date = req.sanitize(req.body.flowering_end_date);
    let flowering_color = req.sanitize(req.body.flowering_color);
    let autoImg = req.sanitize(req.body.autoImg);
    let lastVisitedURL = req.sanitize(req.body.lastVisitedURL);
    let plantDesc = req.sanitize(req.body.plantDesc);
    // dictionary API
    let finalGetFromDictionary = function (callback) {
        // get from dictionary api
        const request = require('request');
        // API endpoint
        let url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${plantName}?key=eb0b08e8-11ac-4725-b691-81a1260457c7`;
        let options = {json: true};
        request(url, options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                callback(null, body);
            } else {
                callback(error);
            }
        });
    }
    // check duplicates
    // cap first letter
    const titleCase = require("./helper_capFirstLetter");
    plantName = titleCase(plantName);
    Plant.findOne({plantName: plantName, verified: true}, function (errN, duplant) {
        if (errN) {
            return next(err);
        }
        // if has plant already
        if (duplant) {
            // flash card
            req.flash("error", "Plant " + plantName + " already exist.");
            //URL format
            return res.redirect("/usr/520"+lastVisitedURL);
        } else {
            // if no duplicates
            // store user input, starts pushing now
            let storeItem = {
                plantName: plantName,
                type: type,
                seeding: {},
                flowering: {}
            };
            // now optional fields
            // seeding start
            storeItem.seeding.text = plantName + seedingPhase;
            if (typeof seeding_start_date != 'undefined') {
                let startDate = seeding_start_date.split("-");
                storeItem.seeding.start_date = new Date(startDate[0], startDate[1], startDate[2], 8, 0, 30, 0);
            }else {
                storeItem.seeding.start_date = new Date().toISOString();
            }
            //seeding end
            if (typeof seeding_end_date != 'undefined') {
                let endDate = seeding_start_date.split("-");
                storeItem.seeding.end_date = new Date(endDate[0], endDate[1], endDate[2], 0, 0, 0);
            }else {
                storeItem.seeding.end_date = new Date().toISOString();
            }
            //seeding color
            if (typeof seeding_color != 'undefined') {
                switch (seeding_color) {
                    case 'red':
                        storeItem.seeding.color = "#FF6347";
                        break;
                    case 'green':
                        storeItem.seeding.color = "#32CD32";
                        break;
                    case 'yellow':
                        storeItem.seeding.color = "#FFFF00";
                        break;
                    default:
                        // light green
                        storeItem.seeding.color = "#70dc70";
                }
            }
            // flowering start
            storeItem.flowering.text = plantName + floweringPhase;
            if (typeof flowering_start_date != 'undefined') {
                let startDate = flowering_start_date.split("-");
                storeItem.flowering.start_date = new Date(startDate[0], startDate[1], startDate[2], 0, 0, 0);
            }else {
                storeItem.flowering.start_date = new Date().toISOString();
            }
            //flowering end
            if (typeof flowering_end_date != 'undefined') {
                let endDate = flowering_end_date.split("-");
                storeItem.flowering.end_date = new Date(endDate[0], endDate[1], endDate[2], 0, 0, 0);
            }else {
                storeItem.flowering.end_date = new Date().toISOString();
            }
            //flowering color
            if (typeof flowering_color != 'undefined') {
                switch (flowering_color) {
                    case 'red':
                        storeItem.flowering.color = "#FF6347";
                        break;
                    case 'green':
                        storeItem.flowering.color = "#32CD32";
                        break;
                    case 'yellow':
                        storeItem.flowering.color = "#FFFF00";
                        break;
                    default:
                        // light red
                        storeItem.flowering.color = "#ff4d4d";
                }
            }
            // author
            storeItem.createdBy = usernameNow;
            // if admin
            if (userGroup) {
                storeItem.verified = true;
            } else {
                storeItem.verified = false;
                // flash card
                req.flash("info", "This record will not show on public database until verified," +
                    " you can view the progress in your profile page.");
            }
            //description
            if (typeof plantDesc != 'undefined' && plantDesc.length > 0) {
                storeItem.plantDesc = plantDesc;
            } else {
                finalGetFromDictionary(function (errLast, resultLast) {
                    if (errLast) {
                        console.error(errLast);
                        storeItem.plantDesc = " ";
                    } else {
                        if(resultLast&&resultLast[0]&&resultLast[0].shortdef&&
                            resultLast[0].shortdef[0]) {
                            storeItem.plantDesc = resultLast[0].shortdef[0];
                            storeItem.plantDescFromAPI = true;
                        }
                        // image
                        if (autoImg && autoImg === 'true') {
                            // get img URL from flickr
                            let Flickr = require('flickr-sdk');
                            process.env.FLICKR_API_KEY = 'abb26b7b2f88e712e7b125991e4c34e1';
                            let flickr = new Flickr(process.env.FLICKR_API_KEY);
                            flickr.photos.search({
                                text: plantName,
                                // public photos
                                privacy_filter: 1,
                                safe_search: 1,
                                // photo only
                                content_type: 1,
                                per_page: 1,
                                page: 1,
                                sort: 'relevance',
                                // https://www.flickr.com/services/api/flickr.photos.licenses.getInfo.html
                                license: '1,2,3,4,5,9,10'
                            }).then(function (resF) {
                                // img URL format
                                // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
                                if (resF.body && resF.body.photos && resF.body.photos.photo) {
                                    let farmid = resF.body.photos.photo[0].farm;
                                    let serverid = resF.body.photos.photo[0].server;
                                    let id = resF.body.photos.photo[0].id;
                                    let secret = resF.body.photos.photo[0].secret;
                                    storeItem.imageURL = `https://farm${farmid}.staticflickr.com/${serverid}/${id}_${secret}_c.jpg`;
                                    storeItem.imageURLFromAPI = true;
                                    // update database record
                                    let newPlant = new Plant(storeItem);
                                    // call pre-defined schema method in ~/models/user.js
                                    newPlant.save();
                                    // flash card
                                    req.flash("info", "Plant " + plantName + " added.");
                                    //URL format
                                    return res.redirect("/usr/520"+lastVisitedURL);
                                } else {
                                    // if bad data format flickr
                                    console.error('bonk, flickr bad data.');
                                    // update database record
                                    let newPlant = new Plant(storeItem);
                                    // call pre-defined schema method in ~/models/user.js
                                    newPlant.save();
                                    // flash card
                                    req.flash("info", "Plant " + plantName + " added without image.");
                                    //URL format
                                    return res.redirect("/usr/520"+lastVisitedURL);
                                }
                            }).catch(function (errF) {
                                // if error flickr
                                console.error('bonk', errF);
                                // update database record
                                let newPlant = new Plant(storeItem);
                                // call pre-defined schema method in ~/models/user.js
                                newPlant.save();
                                // flash card
                                req.flash("info", "Plant " + plantName + " added without image.");
                                //URL format
                                return res.redirect("/usr/520"+lastVisitedURL);
                            });
                        } else {
                            // update database record
                            let newPlant = new Plant(storeItem);
                            // call pre-defined schema method in ~/models/user.js
                            newPlant.save();
                            // flash card
                            req.flash("info", "Plant " + plantName + " added without image.");
                            //URL format
                            return res.redirect("/usr/520"+lastVisitedURL);
                        }
                    }
                });
            }
        }
    });

});
module.exports = users;