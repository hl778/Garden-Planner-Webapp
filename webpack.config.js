/**
 * Webpack master config
 */

'use strict';

const path = require("path");
// uglify files
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        index: './src/js/home.js'
    },
    output: {
        path: path.resolve(__dirname,"build"),
        // include hash to cross check
        filename: '[name].[contentHash].bundle.js',
        // this only for webPack-dev-server
        publicPath: "/build"
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                // Webpack access loader in reverse order
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: 6,
            },
        })
    ]
};