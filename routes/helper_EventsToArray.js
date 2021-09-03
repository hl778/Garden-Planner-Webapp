/**
 * @param {Array} an array of Event Objects in JSON,
 * @return {Array} an array of JSON, filled with event properties
 
 * This function is not redundant, because the Scheduler cannot accept _id, but id
 * Has to convert before sending data back
 */
'use strict';

module.exports = function (Events) {
    let finalData = [];
    Events.forEach(function (event) {
        let stepJSON = {
            // scheduler cannot recognise _id, but id
            id: event._id,
            text: event.text,
            start_date: event.start_date,
            end_date: event.end_date,
            modifiedBy: event.modifiedBy
        };
        if(Object.keys(stepJSON).length) {
            finalData.push(stepJSON);
        }
    });
    return finalData;
}