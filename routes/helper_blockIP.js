/**
 * block given IP
 */
'use strict';
module.exports = function(currentIP) {
    let blockedIPs = require("../models/blockedIPs");
    // write value
    let newIP = new blockedIPs({
        ip:currentIP
    });
    // save to database
    newIP.save(function(err) {
        if(err) {
            console.log("database went wrong.");
        }
    });
}

