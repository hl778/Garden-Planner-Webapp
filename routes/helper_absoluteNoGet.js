/**
 * stores the route that has no GET method, absolutely
 * reason for this is to track user last visited URL which has no GET method
 */
'use strict';

// the order of the array is important, to distinguish the redirect route
// add new routes at the bottom, do not cut in line

// if an endpoint needs to redirect to multiple potential routes,
// an array of visited URL will be used
module.exports = [
    // 0 -> redirect to GET list.ejs
    '/users/addPlants',
    // 1 -> redirect to GET search.ejs
    '/users/input_userPlants'
];
