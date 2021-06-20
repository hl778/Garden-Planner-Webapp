/**
 * database - plants collection schema
 */

// ------------------helper function-----------------------
// validate color format
module.exports = function (v) {
    if (v.indexOf('#') == 0) {
        if (v.length == 7) {  // #f0f0f0
            return true;
        } else if (v.length == 4) {  // #fff
            return true;
        }
    }
};