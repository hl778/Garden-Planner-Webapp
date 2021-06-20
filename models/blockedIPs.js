/**
 * database - ip collection schema
 */

let mongoose = require("mongoose");

// setup schema
let ipSchema = new mongoose.Schema({
    ip: {type: String, required: true, unique: false},
    blocked: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});
// get blocked boolean value
ipSchema.methods.getBlocked = function () {
    return this.blocked;
};

module.exports = mongoose.model("blockedips",ipSchema);