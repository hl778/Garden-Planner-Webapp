/**
 * list plants page
 */
'use strict';

let express = require("express");
// create router
let list = express.Router();
// mongoose model
let Plant = require("../models/plant");
let User = require("../models/user");
let userPlants = require("../models/userPlants");
const redirectLogin = require("../middlewares/redirectLogin");
// validator
// false: error.details error
// true: error object as a whole
const validateRequest = require('../middlewares/schemaValidator')(false);
// how many plants to display before click 'load more ' btn
const loadMoreThreshold = 10;

// list plants pagination
list.get('/pageIndex/:index/:load?', function (req, res) {
    const paramIndex = req.sanitize(req.params.index);
    // plant name start with passed params index
    const regexp = new RegExp("^"+ paramIndex,'i');
    // search database
    const loadParam = req.sanitize(req.params.load);
    // search database
    Plant.find({plantName:regexp,verified: true},function (err,result) {
        if(err) {
            return next(err);
        }
        if(Array.isArray(result)&&result.length>0) {
            // slice result array
            let trueResult;
            // if user clicked 'load more' btn
            console.log(req.session.dataLoadmore);
            if(loadParam==='true') {
                // increase count by one, will be used as index when slicing
                req.session.dataLoadmore+=1;
            }else {
                // reset request 'load more' count
                req.session.dataLoadmore = 0;
            }
            // if the database is less than threshold
            if(result.length<=loadMoreThreshold+(req.session.dataLoadmore*loadMoreThreshold)) {
                if(loadParam==='true') {
                    if(req.session.dataLoadmore*loadMoreThreshold>=result.length) {
                        return res.status(204).send('overflowed');
                    }
                    return res.send(result.slice(req.session.dataLoadmore*loadMoreThreshold,
                        result.length));
                }else {
                    trueResult = result;
                }
                // if the data is more than threshold * an index
            }else {
                if(loadParam==='true') {
                    return res.send(result.slice(req.session.dataLoadmore*loadMoreThreshold,
                        req.session.dataLoadmore*loadMoreThreshold+loadMoreThreshold));
                }else {
                    trueResult = result.slice(0, loadMoreThreshold);
                }
            }
            return res.render('list', {
                availablePlants: trueResult,
                // CSRF
                csrfToken: req.csrfToken()
            });
        }else {
            // if no data
            req.flash("info","There is no plant starts with the letter "+
                paramIndex+" in database yet.");
            return res.render("list",{
                listFlashMessage:req.flash("info"),
                // CSRF
                csrfToken: req.csrfToken()
            });
        }
    }).sort('plantName');
});

// list plants
list.get('/:load?', function (req, res) {
    // how many plants to display before click 'load more ' btn
    const loadMoreThreshold = 10;
    const loadParam = req.sanitize(req.params.load);

    // search database
    Plant.find({verified: true},function (err,result) {
        if(err) {
            return next(err);
        }
        if(Array.isArray(result)&&result.length>0) {
            // slice result array
            let trueResult;
            // if user clicked 'load more' btn
            if(loadParam==='true') {
                // increase count by one, will be used as index when slicing
                req.session.dataLoadmore+=1;
            }else {
                // reset request 'load more' count
                req.session.dataLoadmore = 0;
            }
            // if the database is less than threshold
            if(result.length<=loadMoreThreshold+(req.session.dataLoadmore*loadMoreThreshold)) {
                if(loadParam==='true') {
                    if(req.session.dataLoadmore*loadMoreThreshold>=result.length) {
                        return res.status(204).send('overflowed');
                    }
                    return res.send(result.slice(req.session.dataLoadmore*loadMoreThreshold,
                        result.length));
                }else {
                    trueResult = result;
                }
            // if the data is more than threshold * an index
            }else {
                if(loadParam==='true') {
                    return res.send(result.slice(req.session.dataLoadmore*loadMoreThreshold,
                        req.session.dataLoadmore*loadMoreThreshold+loadMoreThreshold));
                }else {
                    trueResult = result.slice(0, loadMoreThreshold);
                }
            }
            return res.render('list', {
                availablePlants: trueResult,
                // CSRF
                csrfToken: req.csrfToken()
            });
        }else {
            // if no data
            req.flash("info","There is no plant in database yet.");
            return res.render("list",{
                listFlashMessage:req.flash("info"),
                // CSRF
                csrfToken: req.csrfToken()
            });
        }
    }).sort('plantName');
});

list.post('/pageIndex/users/input_userPlants', redirectLogin, validateRequest,function(req, res,next) {
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
        //list and search page
            let tempCard = {
                updatedUser: findUser,
                countUnique:countUnique,
                originalSelectedNumber:userPlantsGet.length
            };
            req.flash("carrier",tempCard);
            res.redirect("/usr/520/list");
    });
  });

module.exports = list;