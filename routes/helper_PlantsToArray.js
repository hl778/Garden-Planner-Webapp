/**
 * @param {Array} an array of Plant Objects in JSON,
 * @return {Array} an array of JSON, filled with seeding and flowering events
 */
'use strict';

module.exports = function (Plants) {
    let finalData = [];
    for (let i = 0; i < Plants.length; i++) {
        let stepJson = {};
        if (Plants[i].seeding&&Plants[i].seeding.start_date) {
            console.log(Plants[i]);
            stepJson.id = Plants[i]._id + "_plantseed";
            stepJson.text = Plants[i].seeding.text;
            stepJson.start_date = Plants[i].seeding.start_date;
            stepJson.end_date = Plants[i].seeding.end_date;
            stepJson.color = Plants[i].seeding.color;
            stepJson.textColor = "#050505";
        }
        if(Object.keys(stepJson).length) {
            finalData.push(stepJson);
        }
        stepJson = {};
        if (Plants[i].flowering&&Plants[i].flowering.start_date) {
            stepJson.id = Plants[i]._id + "_plantflow";
            stepJson.text = Plants[i].flowering.text;
            stepJson.start_date = Plants[i].flowering.start_date;
            stepJson.end_date = Plants[i].flowering.end_date;
            stepJson.color = Plants[i].flowering.color;
            stepJson.textColor = "#050505";
        }
        if(Object.keys(stepJson).length) {
            finalData.push(stepJson);
        }
    }
    return finalData;
}