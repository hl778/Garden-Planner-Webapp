/**
 * Webpack production/build config
 */

'use strict';

let path = require("path");

module.exports = {
    output: {
        path: path.resolve(__dirname,"build"),
        filename: '[name].[contentHash].bundle.js',
        // this only for webPack-dev-server
        publicPath: "/build"
    }
};