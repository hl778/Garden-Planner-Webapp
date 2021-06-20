/**
 * main dynamic routing midware
 */
'use strict';

let express = require("express");
// create router
let global = express.Router();


// index route
global.get('/', function (req, res) {
    // if logged in
    // look for count of plant and event number
    if (req.user) {
        //mongoose
        let User = require("../models/user");
        let Plant = require("../models/plant");
        let Event = require("../models/event");
        let finalCount = [];
        User.findOne({username: req.user.username}, function (err, data, next) {
            if (err || !data) {
                return next(err);
            }
            if (data) {
                //admin group
                if (req.user.userGroup === 0) {
                    // non empty flowering count
                    Plant.count({verified: true, "flowering.start_date": {"$nin": [""]}},
                        function (err, count) {
                            if (err) {
                                return next(err);
                            }
                            // non empty seeding count
                            Plant.count({verified: true, "seeding.start_date": {"$nin": [""]}},
                                function (errN, countN) {
                                    if (err) {
                                        return next(err);
                                    }
                                    // count event
                                    Event.count({modifiedBy: req.user.username,}, function (errU, dataU) {
                                        if (errU) {
                                            return next(err);
                                        }
                                        // final count
                                        // seeding , flowering, event
                                        finalCount = [countN,count,dataU];
                                        res.render('index',{
                                            finalCount:finalCount
                                        });
                                    });
                                });
                        });
                } else {
                    // regular user
                    // find userplants who has start_date
                    User.findOne({username: req.user.username}).populate('userPlants').exec((err, findUser) => {
                        if (err) {
                            return next(err);
                        }
                        let seedCount = 0;
                        let flowerCount = 0;
                        findUser.userPlants.forEach(function(eachPlant) {
                            if(eachPlant.seeding.start_date) {
                                seedCount++;
                            }
                            if(eachPlant.flowering.start_date) {
                                flowerCount++;
                            }
                        });
                        Event.count({modifiedBy: req.user.username,}, function (errU, dataU) {
                            if (errU) {
                                return next(err);
                            }
                            // final count
                            // seeding , flowering, event
                            finalCount = [seedCount,flowerCount,dataU];
                            res.render('index',{
                                finalCount:finalCount
                            });
                        });
                    });
                }
            }

        });
    } else {
        // if visitor
        res.render('index');
    }
});

module.exports = global;