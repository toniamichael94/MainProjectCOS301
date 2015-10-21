'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Notification = mongoose.model('Notifications');

/**
 * Globals
 */
var notification, notification2;

/**
 * Unit tests
 */
 describe('Notifications Model Unit Tests:', function() {
	before(function(done) {
		notification = new Notification({
			username: 'UserA',
			subject: 'a subject',
			message: 'a message',
			status: 'unread'
		});
		
		notification2 = new Notification({
			username: 'UserB',
			subject: 'a subject',
			message: 'a message',
			status: 'unread'
		});
		
		done();
	});
	
	describe('Method Save', function() {
		it('should begin with no notifications', function(done) {
			Notification.find({}, function(err, notif) {
				notif.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			notification.save(done);
		});
		
		it('should be able to show an error when trying to save without username', function(done) {
			notification2.username = '';
			return notification2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without subject', function(done) {
			notification2.username = 'aUser';
			notification2.subject = '';
			return notification2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without message', function(done) {
			notification2.subject = 'aSubject';
			notification2.message = '';
			return notification2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save with incorrect status', function(done) {
			notification2.message = 'a Message';
			notification2.status = 'a Status';
			return notification2.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	
	describe('Method update', function(){
		it('should be able to update the status of a notification without problems', function(done){
			Notification.update({username: 'UserA'}, {status: 'read'}, done);
		});
	});
	
	after(function(done) {
		Notification.remove().exec();
		done();
	});
 });