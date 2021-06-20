/**
 * App entry point
 * @structure
 *  modules required
 *  non-routing midwares
 *  static files
 *  dynamic view files
 *  routing midwares
 *  start server
 * @tag
 *  #debug debug purpose
 *  #analyse analyse purpose
 *  #delete remember to delete at production stage
 *  #change remember to toggle at production stage
 */
'use strict';

//------------------------------------modules------------------------------------
// express server
const express = require('express');
// view engine
let ejs = require("ejs");
// secure app by setting various HTTP headers
const helmet = require('helmet');
// assets compiles and minifies
const connectAssets = require("connect-assets");
// static file path
let path = require('path');
// user session
let session = require('express-session');
// session-in-mongo
let MongoDBStore = require('connect-mongodb-session')(session);
// CSRF
let csrf = require('csurf');
// log requests
let logger = require("morgan");
// compress responds
const compression = require('compression');
// outgoing request
const request = require('request');
// sanitize
const expressSanitizer = require('express-sanitizer');
// cookie
let cookieParser = require('cookie-parser');
// flash card info
let flash = require('connect-flash');
// mongoose
const mongoose = require('mongoose');
// user authentication
let passport = require("passport");

//---------------------------------mini app routers------------------------------
// root/global routers
let global = require('./routes/app_global'),
    // record errors, current user, etc
    masterFilter = require("./routes/app_masterFilter"),
    // blacklist IPs router
    ipblocker = require('./routes/app_ipblocker'),
    // calendar router
    calendar = require("./routes/app_calendar"),
    // login router
    login = require("./routes/app_login"),
    // register router
    register = require("./routes/app_register"),
    // logout router
    logout = require("./routes/app_logout"),
    // list router
    list = require("./routes/app_list"),
    // draw router
    draw = require("./routes/app_draw"),
    // search router
    search = require("./routes/app_search"),
    // user profile route
    userProfile = require("./routes/app_users"),
    // 500 router
    dataError = require("./routes/app_500"),
    // 404 router
    voidPage = require("./routes/app_404"),
    //---------------helper----------------------------------------------------
    // passport
    setUpPassport = require("./routes/helper_setuppassport");

//------------------------initialize app and database----------------------------
// make an express app
let app = express();
// session collection in mongo
let sessionStore = new MongoDBStore({
    uri: 'mongodb://localhost:********',
    collection: 'sessions'
}, function (err) {
    if (err) {
        console.log("entry point database failed @ index.js -1");
        console.log(err);
    }
});
// Catch mongo session errors
sessionStore.on('error', function (err) {
    if (err) {
        console.log("entry point database failed @ index.js -2");
        console.log(err);
    }
});
// connect to database
mongoose.connect("mongodb://localhost:****************",
    {
        // to avoid discontinued feature
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    function (err, data, next) {
        if (err) {
            console.log("entry point database failed @ index.js. -3");
            return next(err);
        }
        console.log("Connected to " + data.name + " database");
    });
// title will be passed to API round trip URL
app.locals.title = "**********";
// #change when production
app.disable("view cache");
// set port property
app.set("port", process.env.PORT || 8000);
// initialize passport
setUpPassport();

//----------------------------3rd party midwares-----------------------------
// set header
app.use(helmet());
// express-sanitizer
app.use(expressSanitizer());
// log each request #debug #analyse
app.use(logger("dev"));
// check if blocked ips
app.use(ipblocker);
// assets compiles and minifies
app.use(connectAssets());
// compress all responses
app.use(compression());
// parse nested json format, for APIs
app.use(express.json());
// parse requests
// no need body parser since express 4.16+
app.use(express.urlencoded({extended: true}));
// cookie
app.use(cookieParser());
// session initialise
app.use(session({
    secret: '*********************',
    cookie: {
        // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: sessionStore,
    // avoid default name to prevent attack
    name: 'sessionId',
    // update session even no modify was made
    resave: true,
    // recurring visitors
    saveUninitialized: true,
}));
// error info
app.use(flash());
// init passport auentication
app.use(passport.initialize());
app.use(passport.session());

//--------------------------------static files----------------------------------
// let publicPath = path.resolve(__dirname, "public");
// app.use(express.static(publicPath));

// #delete when production
let srcPath = path.resolve(__dirname, "src");
app.use(express.static(srcPath));
let buildPath = path.resolve(__dirname, "build");
app.use(express.static(buildPath));

//--------------------------------dynamic files----------------------------------
// templating engine
app.set('view engine', "ejs");
app.set('views', path.resolve(__dirname, "views"));
// map html files to ejs
app.engine('html', ejs.renderFile);

//--------------------------------mid-ware stack routing--------------------------
// attach res.locals cookies, such as flash card, passport authentication
// check browser version
app.use(masterFilter);
// let calendar bypass CSRF check
// will use other method to prevent CSRF
app.use("/calendar", calendar); //calendar
// CSRF
app.use(csrf({cookie: true}));
// cascading filters
app.use("/search", search); //search
app.use("/list", list); //list
app.use("/register", register); //register
app.use("/login", login); //login
app.use("/logout", logout); //logout
app.use("/draw", draw); //draw AR
app.use("/users", userProfile); //user profile
app.use("/", global); //index and routes need to be visible globally
app.use("/500", dataError); //internal server error
app.use(voidPage); //404
// catch-all error handling
app.use(function (err, req, res, next) {
    // if it's not a CSRF attack
    if (err.code != 'EBADCSRFTOKEN') {
        next(err);
    }
    // handle CSRF token errors
    //-------------------------method one: block ip----------------------------
    // let blockIP = require("./routes/helper_blockIP");
    // // block given ip
    // blockIP(req.ip);
    // only visible to backend admins. Hide detailed info from user
    console.log("Redirecting...");
    return res.status(403)
        .send("Terminating connection...");
});
// if error, put into under maintenance mode
app.use(function (err, req, res, next) {
    res.status(503).render("maintenance");
});

//--------------------------start server then callback console------------------
app.listen(app.get("port"), function (err) {
    console.log("Info: Gardening App listening on port "
        + app.get("port"));
    if (err) {
        console.log(err);
    }
});

module.exports = app;
/*------------------------------------End of code-------------------------------*/
