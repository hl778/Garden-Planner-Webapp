/**
 * srt up passport user authentication USER object
 */
'use strict';

let passport = require("passport");
// local strategy
let LocalStrategy = require("passport-local").Strategy;
let User = require("../models/user");

// tell passport to use a local strategy
passport.use("login",new LocalStrategy(function (username,password,done) {
    User.findOne({username:username},function (err,user) {
        if(err) {
            return done(err);
        }
        // if no user
        if(!user) {
            return done(null,false,{message: "No such user exists."});
        }
        // if user exists
        user.checkPassword(password,function (err,matched) {
            if(err) {
                return done(err);
            }
            if(user.blockToken>0) {
                if(matched) {
                    // reset block token
                    user.resetBlock();
                    return done(null,user);
                }else {
                    // 1 step closer to be blocked
                    user.deductBlock();
                    return done(null,false,{message: "Invalid password."});
                }
            }else {
                // if too many tries of wrong password
                return done(null,false,{message: "Account blocked, check your email inbox."
                        +" This is a demonstration of security concern."});
            }
        });
    });
}));

module.exports = function () {
    passport.serializeUser(function (user,done) {
        // mongo uses _id as id
        done(null,user._id);
    });
    passport.deserializeUser(function (id,done) {
        User.findById(id,function (err,user) {
            done(err,user);
        });
    });
};