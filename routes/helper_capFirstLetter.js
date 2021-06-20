/**
 * capital first letter
 */
'use strict';

// cap first letter
module.exports = function(str) {
    let splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase()
            + splitStr[i].substring(1, splitStr[i].length);
        str = splitStr.join(" ");
    }
    return str;
}
