'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Inventory = mongoose.model('Inventory');

/**
 * Globals
 */
var inventory, inventory2;

/**
 * Unit tests
 */
 //Last edited by {Rendani Dau}
 
  describe('Inventory Model Unit Tests:', function() {
	before(function(done) {
		inventory = new Inventory({
			productName: 'carrots',
			unit: 'units',
			quantity: 5
		});
		
		inventory2 = new Inventory({
			productName: 'carrots',
			unit: 'units',
			quantity: 5
		});
		
		done();
	});
	
	describe('Method Save', function() {
		it('should begin with no inventory', function(done) {
			Inventory.find({}, function(err, inventories) {
				inventories.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			inventory.save(done);
		});
		
		it('should fail to save an existing inventory item again', function(done) {
			inventory.save();
			return inventory2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without inventory name', function(done) {
			inventory.productName = '';
			return inventory.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without quantity', function(done) {
			inventory.quantity = '';
			return inventory.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save with incorrect unit', function(done) {
			inventory.unit = 'randomUnit';
			return inventory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	
	describe('Method update', function(){
		it('should be able to update inventory without problems', function(done){
			Inventory.update({productName: 'carrots'}, {quantity: 10}, done);
		});
	});
	
	after(function(done) {
		Inventory.remove().exec();
		done();
	});
});