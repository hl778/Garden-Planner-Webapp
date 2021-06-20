/**
 * test file for the connectivity security
 * trim test_route in the filename to reveal the original file
 * the filename is self-explained
 */
'use strict';

let request = require('supertest');
const app = require("../index");


// index
describe('GET /', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

// list
describe('GET /list', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/list')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

// search
describe('GET /search', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/search')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

// draw
describe('GET /draw', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/draw')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
});

// 404
describe('GET /', function() {
    it('responds with 404', function(done) {
      request(app)
        .get('/random')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html/)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
});