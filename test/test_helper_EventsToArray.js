/**
 * test file for the mimic file
 * trim test_ in the filename to locate the original file
 */
'use strict';

let EventsToArray = require("../routes/helper_EventsToArray");
// let chai = require("chai");
// let expect = chai.expect;
let assert = require('assert');

let testJSON_1 = [{
    id: 123,
    text: 123,
    start_date: 123,
    end_date: 123,
    modifiedBy: 123
}];
let expectJSON_1 = [{
    id: undefined
}];
let testJSON_2 = [{
    _id: 123,
    text: 123,
    start_date: 123,
    end_date: 123,
    modifiedBy: 123
}];
let expectJSON_2 = [{
    id: 123
}];
let testJSON_3 = [{
    _id: "123",
    text: 123,
    start_date: 123,
    end_date: 123,
    modifiedBy: 123
}];
let expectJSON_3 = [{
    id: "123"
}];
describe("arrayToArray",function() {
    it("take array of JSON return array of filtered JSON",function() {
        // expect().to.equal("");
        assert.equal(EventsToArray(testJSON_2)._id, expectJSON_2.id);
        assert.equal(EventsToArray(testJSON_1)._id, expectJSON_1.id);
        assert.equal(EventsToArray(testJSON_3)._id, expectJSON_3.id);
    });
});


