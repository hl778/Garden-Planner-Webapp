/**
 * test file for the mimic file
 * trim test_ in the filename to locate the original file
 */
'use strict';

let capFirst = require("../routes/helper_capFirstLetter");
// let chai = require("chai");
// let expect = chai.expect;
let assert = require('assert');

describe("capFirst",function() {
    it("cap first letter",function() {
        // expect(capFirst("")).to.equal("");
        assert.equal(capFirst("random"), "Random");
        assert.equal(capFirst(" "), " ");
        assert.equal(capFirst("1"), "1");
    });
});


