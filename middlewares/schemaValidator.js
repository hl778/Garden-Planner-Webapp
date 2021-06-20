/**
 * schema-validate-navigator middleware
 * this navigates requests to their destination Schema
 * @logic
 *  - get current request route
 *  - check if it's pre-defined in the validate schema (../routes/helper_schemaValidate.js)
 *  - if it is, apply the schema
 *  - if it's not, continue to next() middleware
 * @reference https://www.digitalocean.com/community/tutorials/node-api-schema-validation-with-joi
 */
'use strict';

// helper
const _ = require('lodash');
// validator schema
const Schemas = require('../routes/helper_schemaValidate');
// no GET route
const absoluteNoGet = require('../routes/helper_absoluteNoGet');
// useJoiError determines if we should respond with the base Joi error
// boolean: defaults to false
module.exports = (useJoiError = false) => {
    // validate Boolean type and value
    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
    // enabled HTTP methods for request data validation
    // not need to check GET
    const _supportedMethods = ['post', 'put', 'delete'];

    // return the validation middleware
    return (req, res, next) => {
        // current URL path
        let route = req.originalUrl;
        // redirect to list if user add plants
        // format method as uniform
        const method = req.method.toLowerCase();
        // if it's supported method, then check
        // and if the validator schema has defined given rules
        if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
            // get schema for the current route
            const _schema = _.get(Schemas, route);
            // validate error will redirect user to last visited URL,
            // which will be users/addPlants that has no GET method
            // so we need to redirect user back to list page
            let noGetIndex = absoluteNoGet.indexOf(route);
            if(noGetIndex > -1) {
                switch(noGetIndex) {
                    case 0:
                        route = '/list';
                        break;
                    case 1:
                        route = '/search';
                        break;
                    default:
                        route = '/';
                }
            }
            // double check if the schema pre-defined
            if (_schema) {
                // Validate req.body using the schema and validation options
                const {error, value} = _schema.validate(req.body);
                // if did NOT pass
                if (error) {
                    // if passed true for fetch a whole error object
                    if(_useJoiError) {
                        req.flash("error", error);
                    }else {
                        // if asked for a detailed error msg
                        req.flash("error", error.details);
                    }
                    // redirect to the original page
                    return res.redirect(route);
                } else {
                    // pass validated value to body and continue to the next midware
                    req.body = value;
                    // must return otherwise it will skip one step ahead
                    // because we call another next() below
                    return next();
                }
            }
        }
        // if there is no pre-defined schema
        next();
    };
};

//--------------------------------End of Code---------------------------