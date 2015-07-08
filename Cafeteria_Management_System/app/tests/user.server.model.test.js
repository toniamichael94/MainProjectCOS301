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

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when trying to save without last name', function(done) {
            user.lastName = '';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when the password is too short', function(done) {
            user.password = 'pass';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when the passwords do not match', function(done) {
            user.password = 'password';
            user.confirmPassword = 'password1';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when the email does not contain an @ sign', function(done) {
            user.email = 'you.com';
            return user.save(function(err) {
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
