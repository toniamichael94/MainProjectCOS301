
'use strict';


/**
 * Module dependencies.
 */

var should = require('should'),
	mongoose = require('mongoose'),
	Order = mongoose.model('Order');


/**
 * Globals
 */

var order;


/**
 * Unit tests
 *
 */
describe('Order Model Unit Tests:', function() {
	beforeEach(function(done) {
		order = new Order({
			username: '12345',
			orderNumber: '1',
			itemName: 'Pie',
			price: 12.50,
			quantity: 2,
			category: 'pastry',
			preferences: 'no cheese',
			status: 'open'
		});
		done();
	});

	describe('Method Save', function() {
		it('should begin with no orders', function(done) {
			Order.find({}, function(err, orders) {
				orders.should.have.length(0);
				done();
			});
		});
		
		it('should be able to save without problems', function(done) {
			return order.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without name', function(done) {
			order.username = '';
			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without number', function(done) {
			order.orderNumber = undefined;
			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without item name', function(done) {
			order.itemName = '';
			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without item price', function(done) {
			order.price = undefined;
			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without quantity', function(done) {
			order.quantity = undefined;
			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without category', function(done) {
			order.category = '';
			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	
	describe('Method update', function(){
		it('should be able to update the status of an order without problems', function(done){
			Order.update({username: '12345'}, {status: 'ready'}, done);
		});
	});
	
	after(function(done) {
		Order.remove().exec();
		done();
	});
});

