/**
 * database - user event schema
 */

let mongoose = require("mongoose");

// setup schema
let userEventsSchema = new mongoose.Schema({
    text:{type: String, required: false, unique: false},
    start_date:Date,
    end_date:Date,
    modifiedAt: {type: Date, default: Date.now},
    modifiedBy: {type: String, default: "anonymous"}
});


// mongoose will auto plural and lowercase the collection name
let events = mongoose.model("events",userEventsSchema);
module.exports = events;