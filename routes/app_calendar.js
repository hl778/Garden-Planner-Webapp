/**
 * Calendar router
 */
'use strict';

let express = require("express");
const redirectLogin = require("../middlewares/redirectLogin");
let calendar = express.Router();
let Plant = require("../models/plant");
let User = require("../models/user");
let Event = require("../models/event");
let userPlants = require("../models/userPlants");
// helper function, returns an array of JSON
const PlantsToArray = require("./helper_PlantsToArray");
const EventsToArray = require("./helper_EventsToArray");


// calendar main
calendar.get('/', redirectLogin,function (req, res) {
    res.render('calendar');
});

// calendar onload
calendar.get('/data', redirectLogin, function (req, res, next) {
    let username = req.user.username;
    // 0 is admin user group
    let userGroup = req.user.userGroup===0;
    // send back data
    let finalData = [];
    // if admin group
    if (userGroup) {
        // if admin, show all plants calendar, no matter added to collection or not
        Plant.find({verified: true}, function (errN, findPlants) {
            if (errN) {
                return next(err);
            }
            // prepare plants data
            if (findPlants) {
                finalData = PlantsToArray(findPlants);
            }
            // prepare event data
            User.findOne({username: username}).populate('userEvents').exec((err, findUser) => {
                if (err) {
                    return next(err);
                }
                if (findUser) {
                    // join prepared data
                    finalData = finalData.concat(EventsToArray(findUser.userEvents));
                }
                // res data
                res.send(finalData);
            });
        });
        //    if not admin, will only show plants that being pre-added to user's collection
    } else {
        // find userPlants for the current logged in user
        User.findOne({username: username}).populate('userPlants').exec((errN, findUser) => {
            if (errN) {
                return next(err);
            }
            if (findUser && findUser.userPlants && findUser.userPlants.length !== 0) {
                finalData = PlantsToArray(findUser.userPlants);
            }
            // search for user events
            User.findOne({username: username}).populate('userEvents').exec((err, findUser) => {
                if (err) {
                    return next(err);
                }
                // if data
                if (findUser && findUser.userEvents && findUser.userEvents.length != 0) {
                    // join prepared data
                    finalData = finalData.concat(EventsToArray(findUser.userEvents));
                }
                // res data
                res.send(finalData);
            });
        });
    }
});


// calendar POST CUD
calendar.post('/data', redirectLogin, function (req, res, next) {
    let username = req.user.username;
    // 0 is admin user group
    let userGroup = req.user.userGroup===0;
    // mode - the type of the operation;
    // sid - the original task/link ID;
    // tid - the ID of the task/link after the operation.
    // JSON response looks like:  {"action":"updated", "sid":15, "tid":15}
    let data = req.body;
    let mode = data["!nativeeditor_status"];
    let sid = data.id;
    let tid = sid;
    // attached postfix of id, if has any
    let postfix;
    let realID;
    // find out which collection
    if (data.id.length < 10) {
        postfix = "event";
    } else {
        postfix = String(data.id).slice(String(data.id).length - 9, String(data.id).length);
        realID = String(data.id).slice(0, String(data.id).length - 10);
    }
    if (mode === "updated") {
        // seeding event
        if (postfix === 'plantseed') {
            // if admin
            // will edit the Plant collection directly
            if(userGroup) {
                Plant.findOne({_id: realID}).exec(function (err, plant) {
                    if (err) {
                        return next(err);
                    }
                    if (plant) {
                        plant.seeding.text = data.text;
                        plant.seeding.start_date = data.start_date;
                        plant.seeding.end_date = data.end_date;
                        plant.modifiedBy = username;
                        plant.save();

                        userPlants.find({plantName:plant.plantName,modifiedBy:"admin"},function(errN,dataN){
                            if (errN) {
                                return next(err);
                            }
                            if(dataN) {
                                dataN.forEach(function(eachPlant) {
                                    eachPlant.seeding.text = data.text;
                                    eachPlant.seeding.start_date = data.start_date;
                                    eachPlant.seeding.end_date = data.end_date;
                                    eachPlant.modifiedBy = "admin";
                                    eachPlant.save();
                                });
                            }
                        });
                    }
                });
            }else {
            // if not admin, update the userPlants collection
                userPlants.findOneAndUpdate({_id: realID},  {
                    $set:{
                        "seeding.text":data.text,
                        "seeding.start_date":data.start_date,
                        "seeding.end_date":data.end_date,
                        modifiedBy:username
                    }
                }, {new: true}, (err, doc) => {
                    if (err) {
                        return next(err);
                    }
                });
            }
        } else if (postfix == 'plantflow') {
            //flowering event
            // if admin
            // will edit the Plant collection directly
            if(userGroup) {
                Plant.findOne({_id: realID}).exec(function (err, plant) {
                    if (err) {
                        return next(err);
                    }
                    if (plant) {
                        plant.flowering.text = data.text;
                        plant.flowering.start_date = data.start_date;
                        plant.flowering.end_date = data.end_date;
                        plant.modifiedBy = username;
                        plant.save();
                        
                        userPlants.find({plantName:plant.plantName,modifiedBy:"admin"},function(errN,dataN){
                            if (errN) {
                                return next(err);
                            }
                            if(dataN) {
                                dataN.forEach(function(eachPlant) {
                                    eachPlant.flowering.text = data.text;
                                    eachPlant.flowering.start_date = data.start_date;
                                    eachPlant.flowering.end_date = data.end_date;
                                    eachPlant.modifiedBy = "admin";
                                    eachPlant.save();
                                });
                            }
                        });
                    }
                });
            }else {
                // if not admin group, update the userPlants collection
                userPlants.findOneAndUpdate({_id: realID},  {
                    $set:{
                        "flowering.text":data.text,
                        "flowering.start_date":data.start_date,
                        "flowering.end_date":data.end_date,
                        modifiedBy:username
                    }
                }, {new: true}, (err, doc) => {
                    if (err) {
                        return next(err);
                    }
                });
            }
        } else {
            // other event
            Event.findOne({_id: sid}).exec(function (err, event) {
                if (err) {
                    return next(err);
                }
                if (event) {
                    event.text = data.text;
                    event.start_date = data.start_date;
                    event.end_date = data.end_date;
                    event.modifiedBy = username;
                    event.save();
                }
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send({action: mode, sid: sid, tid: String(tid)});
    } else if (mode === "inserted") {
        User.findOne({username: username}, function (errI, user) {
            if (errI) {
                return next(err);
            }
            if (user) {
                let newEvent = new Event({
                    text: data.text,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    modifiedBy: username
                });
                newEvent.save();
                user.userEvents.push(newEvent);
                user.save();
                res.setHeader("Content-Type", "application/json");
                return res.send({action: mode, sid: sid, tid: String(newEvent._id)});
            } else {
                // no user
                return next(err);
            }
        });
    } else if (mode === "deleted") {
        // seeding event
        if (postfix === 'plantseed') {
            if (userGroup) {
                Plant.updateMany({_id: realID},
                    {$unset: {"seeding.start_date": "", "seeding.end_date": ""}}, {multi: true},
                    function (err, plant) {
                        if (err) {
                            return next(err);
                        }
                    });
                    
                    // update userplants collection
                    Plant.findOne({_id: realID},function(err,plant) {
                        if (err) {
                            return next(err);
                        }
                        userPlants.find({plantName:plant.plantName,modifiedBy:"admin"},function(errN,dataN){
                            if (errN) {
                                return next(err);
                            }
                            if(dataN) {
                                dataN.forEach(function(eachPlant) {
                                    eachPlant.seeding.start_date = "";
                                    eachPlant.seeding.end_date = "";
                                    eachPlant.modifiedBy = "admin";
                                    eachPlant.save();
                                });
                            }
                        });
                    });
            } else {
                // if not admin group
                //Find the user with the name and populate the userPlants field
                userPlants.update({_id: realID},
                    {$unset: {"seeding.start_date": "", "seeding.end_date": "", modifiedBy:username}}, {multi: true},
                    function (err, data) {
                        if (err) {
                            return next(err);
                        }
                    });
            }
        } else if (postfix == 'plantflow') {
            //flowering event
            if (userGroup) {
                Plant.update({_id: realID},
                    {$unset: {"flowering.start_date": "", "flowering.end_date": ""}}, {multi: true},
                    function (err, plant) {
                        if (err) {
                            return next(err);
                        }
                    });

                // update userplants collection
                Plant.findOne({_id: realID},function(err,plant) {
                    if (err) {
                        return next(err);
                    }
                    userPlants.find({plantName:plant.plantName,modifiedBy:"admin"},function(errN,dataN){
                        if (errN) {
                            return next(err);
                        }
                        if(dataN) {
                            dataN.forEach(function(eachPlant) {
                                eachPlant.flowering.start_date = "";
                                eachPlant.flowering.end_date = "";
                                eachPlant.modifiedBy = "admin";
                                eachPlant.save();
                            });
                        }
                    });
                });
            } else {
                // if not admin group
                //Find the user with the name and populate the userPlants field
                userPlants.update({_id: realID},
                    {$unset: {"flowering.start_date": "", "flowering.end_date": "", modifiedBy:username}}, {multi: true},
                    function (err, data) {
                        if (err) {
                            return next(err);
                        }
                    });
            }
        } else {
            // other event
            Event.findByIdAndDelete(sid, {}, function (err, data) {
                if (err) {
                    return next(err);
                }
            });
        }
        res.setHeader("Content-Type", "application/json");
        res.send({action: mode, sid: sid, tid: String(tid)});
    } else {
        res.send("Not supported operation");
    }
});

module.exports = calendar;