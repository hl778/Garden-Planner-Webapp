/**
 * database - user collection schema
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;
let mongoose = require("mongoose");
// how many tries allowed to enter wrong password
const BLOCKTOKEN = 20;
const events = require("./event");

// setup schema
let userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: String, // will check uniqueness in route
    displayName: {type:String, unique:false},
    houseNo: String,
    streetAddress: String,
    postCode: String,
    userPlants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'userPlants'
    }],
    userEvents: [{
        type: mongoose.Schema.ObjectId,
        ref: 'events'
    }],
    userPlantsBackup:[{type:String}],
    createdAt: {type: Date, default: Date.now},
    userGroup: {type: Number, default: 9},
    // to lock account after certain tries
    // if this is a real life app, will add node module based on time range
    blockToken: {type: Number, default: BLOCKTOKEN}
});
// get username
userSchema.methods.name = function () {
    return this.username;
};
// reset block token
userSchema.methods.resetBlock = function () {
    this.blockToken = BLOCKTOKEN;
    this.save();
};
// deduct block token
userSchema.methods.deductBlock = function () {
    this.blockToken -= 1;
    this.save();
};
// before saving password, hash it
userSchema.pre("save", function (done) {
    // instance of an user
    let user = this;
    // if it's new or unmodified
    if (!user.isModified("password")) {
        return done();
        console.log("password is not modified.");
    }
    // hash
    bcrypt.hash(user.password, saltRounds, function (err, hashedPassword) {
        if (err) {
            return done(err);
        }
        user.password = hashedPassword;
        done();
    });
});
// check password
userSchema.methods.checkPassword = function(guess,done) {
    bcrypt.compare(guess,this.password,function(err,matched) {
        done(err,matched);
    });
};

// mongoose will auto plural and lowercase the collection name
let User = mongoose.model("User",userSchema);
module.exports = User;