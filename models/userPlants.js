/**
 * database - user plants and events schema
 */

let mongoose = require("mongoose");
const colorValidator = require("./helper_colorValidator");

// setup schema
let userPlantsSchema = new mongoose.Schema({
    plantName: {type: String, required: false, unique: false},
    seeding: {
        text: String,
        // will not using Date type here, but will validate date in validator
        start_date: Date,
        end_date: Date,
        color: {type: String, validate: [colorValidator, 'not a valid color format.']},
    },
    flowering: {
        text: String,
        // will not using Date type here, but will validate date in validator
        start_date: Date,
        end_date: Date,
        color: {type: String, validate: [colorValidator, 'not a valid color format.']},
    },
    modifiedAt: {type: Date, default: Date.now},
    modifiedBy: {type: String, default: "anonymous"}
});
// get plantDesc
userPlantsSchema.methods.getDesc = function () {
    return this.plantDesc;
};

// mongoose will auto plural and lowercase the collection name
let userPlants = mongoose.model("userPlants",userPlantsSchema);
module.exports = userPlants;