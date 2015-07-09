/**
 * Created by Semaka Malapane on 2015/07/08.
 */
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
    before(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            role: 'user',
            limit: '500',
            recipientEmailAddress: 'test@test.com'
        });
        user2 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            role: 'user',
            limit: '500',
            recipientEmailAddress: 'test@test.com'
        });

        done();
    });

    describe('Method Update', function() {
        /*****
         * tests the user is logged in
        it('should begin with user logged in', function(done) {
            User.signin().find({}, function(err, users) {
                users.should.have.length(0);
                done();
            });
        });
         */
        it('be able to update the name of the user', function(done) {
            user.firstName = 'Bob';
            user.update(done);
        });

        it('be able to update the last name of the user', function(done) {
            user.lastName = 'Smith';
            user.update(done);
        });

        it('be able to update the limit of the user', function(done) {
            user.limit = 100;
            user.update(done);
        });

        it('be able to update the email address of the user', function(done) {
            user.email = 'Me@you.com';
            user.update(done);
        });

        it('be able to update where the monthly bill will be sent to', function(done) {
            user.recipientEmailAddress = 'Me@you.com';
            user.update(done);
        });

      /*  it('should fail if the name is empty', function(done) {
            user2.firstName = '';
            return user2.update(function(err) {
                should.exist(err);
                done();
            });
        });*/ // this test is irelevent since it will display nothing if the name is empty in the name field

        it('should fail if the email address is invalid', function(done) {
            user2.email = 'me.com';
            return user2.update(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail if the limit is less than R0', function(done) {
            user2.limit = -1;
            /*return*/ user2.update(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});
