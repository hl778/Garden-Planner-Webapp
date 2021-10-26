/**
 * database - plants collection schema
 */

let mongoose = require("mongoose");
// validate color
const colorValidator = require("./helper_colorValidator");
// URL validator
require('mongoose-type-url');

// setup schema
let plantSchema = new mongoose.Schema({
    plantName: {type: String, required: true, unique: true},
    seeding: {
        text: String,
        // will not using Date type here, but will validate date in validator
        start_date: {type: Date},
        end_date: {type: Date},
        color: {type: String, validate: [colorValidator, 'not a valid color format.']},
    },
    flowering: {
        text: String,
        // will not using Date type here, but will validate date in validator
        start_date: {type: Date},
        end_date: {type: Date},
        color: {type: String, validate: [colorValidator, 'not a valid color format.']},
    },
    type: {type: String, default: "plant",required: true},
    plantDesc: String,
    plantDescFromAPI: {type: Boolean, default: false},
    imageDefault: {type: String, unique: false, default: "/assets/img/siteImg/defaultPlantsImg.png"},
    imageURL: {type: mongoose.SchemaTypes.Url, unique: false,required: false},
    imageURLFromAPI: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: String, default: "anonymous"},
    verified: {type: Boolean, default: false}
});
// get plant name
plantSchema.methods.name = function () {
    return this.plantName;
};

// mongoose will auto plural and lowercase the collection name
let Plant = mongoose.model("Plant", plantSchema);
module.exports = Plant;

