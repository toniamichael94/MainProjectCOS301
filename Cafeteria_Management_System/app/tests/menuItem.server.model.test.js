/*
 * Last Edited by {Rendani Dau}
 * Will revisit
 */
 
 'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	MenuItem = mongoose.model('MenuItem');

/**
 * Globals
 */
var menuItem, menuItem2;

/**
 * Unit tests
 */
 //Last edited by {Rendani Dau}
 
  describe('MenuItem Model Unit Tests:', function() {
	before(function(done) {
		menuItem = new MenuItem({
			itemName: 'Tramezzini',
			description: 'Delicious tram with cheese and tomato',
			price: 50,
			category: 'meals',
			ingredients: {ingredients:['bread', 'butter'],quantities:[1, 5]},
			user: mongoose.Types.ObjectId()
		});
		
		menuItem2 = new MenuItem({
			itemName: 'Tramezzini',
			description: 'Delicious tram with cheese and tomato',
			price: 50,
			category: 'meals',
			ingredients: {ingredients:['bread', 'butter'],quantities:[1, 5]},
			user: mongoose.Types.ObjectId()
		});
		done();
	});
	
	describe('Method Save', function() {
		it('should begin with no menu items', function(done) {
			MenuItem.find({}, function(err, menuItems) {
				menuItems.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			menuItem.save(done);
		});
		
		it('should fail to save an existing menu item again', function(done) {
			menuItem.save();
			return menuItem2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without menu item name', function(done) {
			menuItem.itemName = '';
			return menuItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without description', function(done) {
			menuItem.description = '';
			return menuItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without price', function(done) {
			menuItem.price = null;
			return menuItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without category', function(done) {
			menuItem.category = null;
			return menuItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save with incorrect category', function(done) {
			menuItem.category = 'aRandomCategory';
			return menuItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when trying to save without ingredients', function(done) {
			menuItem.ingredients = null;
			return menuItem.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	
	describe('Method update', function(){
		it('should be able to update the menu item without problems', function(done){
			MenuItem.update({itemName: 'Tramezzini'}, {price: 35}, done);
		});
	});
		
	after(function(done) {
		MenuItem.remove().exec();
		done();
	});
});