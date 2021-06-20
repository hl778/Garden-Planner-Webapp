/**
 * master filter
 */

let express = require("express");
// detect browser version
// will exclude API routes
const useragent = require('express-useragent');
// compare version number
const semver = require('semver');
// no GET route
const absoluteNoGet = require('./helper_absoluteNoGet');
let master = express.Router();
// attach user agent info to req
master.use(useragent.express());

// agent filter
master.use(function (req,res,next) {
    // if user can continue using the app
    let passed;
    // minimum supported browser versions
    const CHROME = "5.0.0",
        FIREFOX = "4.0.0",
        EDGE = "9.0.0",
        SAFARI = "5.0.0",
        OPERA = "10.5.0",
        InternetExplorer = "9.0.0";
    // get user agent
    const userBrowser = req.useragent.browser;
    // format version number as x.x.x
    const versionNo = semver.valid(semver.coerce(req.useragent.version))
    // version filter
    switch(userBrowser) {
        case 'Chrome':
            passed = semver.gt(versionNo, CHROME);
            break;
        case 'Firefox':
            passed = semver.gt(versionNo, FIREFOX);
            break;
        case 'Safari':
            passed = semver.gt(versionNo, SAFARI);
            break;
        case 'Opera':
            passed = semver.gt(versionNo, OPERA);
            break;
        case 'Internet Explorer':
            passed = semver.gt(versionNo, InternetExplorer);
            break;
        case 'Edge':
            passed = semver.gt(versionNo, EDGE);
            break;
        default:
            passed = true;
    }
    // if not supported broswer
    if(!passed) {
        return res.status(403)
            .send("Your Browser is not supported."+
                "Please use a more up-to-date Browser before continue.");
    }

    // important: do NOT sanitize below values,
    // otherwise cannot read as json or array
    // req.user populated by passport midware
    res.locals.currentUser = req.user;
    // user agent
    res.locals.userAgent = req.headers["user-agent"];
    // last visited URL
    res.locals.lastVisitedURL = req.originalUrl;
    // validate error will redirect user to last visited URL,
    // which will be users/addPlants that has no GET method
    // so we need to redirect user back to list page
    if(absoluteNoGet.indexOf(res.locals.lastVisitedURL) > -1) {
        res.locals.lastVisitedURL = '/list';
    }
    // global, flash card info
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    // in detailed info rather than simple msg
    res.locals.carriers = req.flash("carrier");
    next();
});

module.exports = master;