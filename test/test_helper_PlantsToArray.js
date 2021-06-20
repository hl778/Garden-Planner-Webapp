/**
 * test file for the mimic file
 * trim test_ in the filename to locate the original file
 */
'use strict';

let PlantsToArray = require("../routes/helper_PlantsToArray");
// let chai = require("chai");
// let expect = chai.expect;
let assert = require('assert');

describe("PlantsToArray",function() {
    let testJSON_1, expectJSON_1, testJSON_2, expectJSON_2, testJSON_3, expectJSON_3;
    beforeEach(function() {
        testJSON_1 = [{
            id: 234324,
            text: 123,
            start_date: 123,
            end_date: 123,
            modifiedBy: 123
        }];
        expectJSON_1 = [{
            id: undefined
        }];
        testJSON_2 = [{
            _id: 123,
            text: 123,
            start_date: 123,
            end_date: 123,
            modifiedBy: 123
        }];
        expectJSON_2 = [{
            id: 123
        }];
        testJSON_3 = [{
            _id: "123",
            text: 123,
            start_date: 123,
            end_date: 123,
            modifiedBy: 123
        }];
        expectJSON_3 = [{
            id: "123"
        }];
    });
    it("take array of JSON return array of filtered JSON",function() {
        // expect().to.equal("");
        assert.equal(PlantsToArray(testJSON_2)._id, expectJSON_2.id);
        assert.equal(PlantsToArray(testJSON_1)._id, expectJSON_1.id);
        assert.equal(PlantsToArray(testJSON_3)._id, expectJSON_3.id);
    });
});


