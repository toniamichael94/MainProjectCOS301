'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Config = mongoose.model('Config');

/**
 * Globals
 */
var config, config2;

/**
 * Unit tests
 */
 //Last edited by {Rendani Dau}
 describe('Config Model Unit Tests:', function() {
	before(function(done) {
		config = new Config({
			name: 'Sytem wide limit',
			value: '2000'
		});
		
		config2 = new Config({
			name: 'Sytem wide limit',
			value: '2000'
		});
		
		done();
	});
	
	describe('Method Save', function() {
		it('should begin with no configs', function(done) {
			Config.find({}, function(err, configs) {
				configs.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			config.save(done);
		});
		
		it('should fail to save an existing config again', function(done) {
			config.save();
			return config2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without config name', function(done) {
			config.name = '';
			return config.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without config value', function(done) {
			config.value = '';
			return config.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	
	describe('Method update', function(){
		it('should be able to update a config without problems', function(done){
			Config.update({name: 'Sytem wide limit'}, {value: 5000}, done);
		});
	});
	
	after(function(done) {
		Config.remove().exec();
		done();
	});
});