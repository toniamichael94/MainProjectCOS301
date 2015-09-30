'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Audit = mongoose.model('Audit');

/**
 * Globals
 */
var audit, audit2;

/**
 * Unit tests
 */
 describe('Audit Model Unit Tests:', function() {
	before(function(done) {
		audit = new Audit({
			event: 'Role change',
			details: 'Finance role has been assigned to 123456 by superuser'
		});
		
		audit2 = new Audit({
			event: 'Branding settings change',
			details: 'The cafeteria name has been changed to Mugg&Bean'
		});
		
		done();
	});
	
	describe('Method Save', function() {
		it('should begin with no audits', function(done) {
			Audit.find({}, function(err, audits) {
				audits.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			audit.save(done);
		});
		
		it('should be able to show an error when trying to save without event', function(done) {
			audit2.event = '';
			return audit2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without details', function(done) {
			audit2.details = '';
			return audit2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		after(function(done) {
			Audit.remove().exec();
			done();
		});
	});
 });