/**
 * test file for the CSRF security
 * trim test_route in the filename to reveal the original file
 * the filename is self-explained
 */
'use strict';

let request = require('supertest');
const app = require("../index");


// CSRF security test
describe('POST /users/edit', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/users/edit')
      .send({displayName: 'admin'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/html/)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

// user reset password
describe('POST /users/reset', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/users/edit')
      .send({username: 'admin',password:'random'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/html/)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

// input_userPlants
describe('POST /users/input_userPlants', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/users/edit')
      .send({plantName: 'flower'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/html/)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

// addPlants
describe('POST /users/addPlants', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/users/edit')
      .send({plantName: 'flower'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/html/)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});