/**
 * schema for validate form
 */
'use strict';

// load Joi module
const Joi = require('@hapi/joi');
// forbidden keywords
let reservedKeyword = require("../middlewares/reservedKeywords");

// Joi validation options
const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: false // remove unknown keys from the validated data
};

// register form schema
const registerSchema = Joi.object().options(validationOptions).keys({
    // prevent CSRF attack, node plugin
    _csrf: Joi.string(),
    // anonymous is webapp reserved keyword
    username: Joi.string().required().trim().min(3).max(20).alphanum()
        .lowercase().invalid(...reservedKeyword),
    password: Joi.string().required().trim().min(5).max(16)
        .pattern(/^(?=.*\d)(?=.*[a-z])[0-9a-z]/i,
            '\'Password must contain at least 1 lowercase and 1 digit.'
            + ' For example: abc123.\''),
    email: Joi.string().trim().email().min(4).max(100).lowercase().allow(''),
    postCode: Joi.string().alphanum().uppercase().trim().min(4).max(8).allow('')
})

// login form schema
const loginSchema = Joi.object().options(validationOptions).keys({
    // prevent CSRF attack, node plugin
    _csrf: Joi.string(),
    // anonymous is webapp reserved keyword
    username: Joi.string().required().trim().min(3).max(20).alphanum()
        .lowercase(),
    password: Joi.string().required().trim().max(16)
})

// reset password form schema
const resetSchema = Joi.object().options(validationOptions).keys({
    // prevent CSRF attack, node plugin
    _csrf: Joi.string(),
    // anonymous is webapp reserved keyword
    username: Joi.string().required().trim().min(3).max(20).alphanum()
        .lowercase(),
    password: Joi.string().required().trim().min(5).max(16)
        .pattern(/^(?=.*\d)(?=.*[a-z])[0-9a-z]/i,
            '\'Password must contains at least 1 lowercase English letter and 1 digit.'
            + ' For example: abc123.\'')
})

// search plants form schema
const searchPlantSchema = Joi.object().options(validationOptions).keys({
    // prevent CSRF attack, node plugin
    _csrf: Joi.string(),
    keyword: Joi.string().required().trim().min(1).max(30).alphanum()
        .lowercase()
})

// user_InputPlant route
const inputUserPlantSchema = Joi.object().options(validationOptions).keys({
    // prevent CSRF attack, node plugin
    _csrf: Joi.string(),
    userPlants: Joi.array().items(Joi.string().min(2).max(100))
})

// /users/addPlants route
const userAddPlantSchema = Joi.object().options(validationOptions).keys({
    // prevent CSRF attack, node plugin
    _csrf: Joi.string(),
    plantName: Joi.string().required().min(2).max(100),
    type:Joi.string().required().min(4).max(15),
    plantDesc:Joi.string().max(1000).allow(''),
    seeding_start_date:Joi.string().pattern(/^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/).allow(''),
    seeding_end_date:Joi.string().pattern(/^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/).allow(''),
    seeding_color:Joi.string().required().min(3).max(10),
    flowering_start_date:Joi.string().pattern(/^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/).allow(''),
    flowering_end_date:Joi.string().pattern(/^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/).allow(''),
    flowering_color:Joi.string().required().min(3).max(10),
})

// export to respective routes
module.exports = {
    '/register': registerSchema,
    '/login':loginSchema,
    '/users/reset':resetSchema,
    '/search':searchPlantSchema,
    // add plant to user's collection
    '/users/input_userPlants':inputUserPlantSchema,
    //add plant to database
    '/users/addPlants':userAddPlantSchema
};

//------------------End of code--------------------------------------