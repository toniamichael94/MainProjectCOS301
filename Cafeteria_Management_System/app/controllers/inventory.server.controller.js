'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inventory = mongoose.model('Inventory'),
	_ = require('lodash');

/**
 * Create an inventory item
 */
exports.create = function(req, res) {
	console.log('here');
	var inventoryItem = new Inventory(req.body);
	inventoryItem.user = req.user;

	inventoryItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventoryItem);
		}
	});
};

/**
 * Show the current inventory item
 */
exports.read = function(req, res) {
	res.jsonp(req.inventoryItem);
};

/**
 * Update an inventory item
 */
exports.update = function(req, res) {
	var inventoryItem = req.inventoryItem ;

	inventoryItem = _.extend(inventoryItem , req.body);

	inventoryItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventoryItem);
		}
	});
};

/**
 * Delete an inventory Item
 */
exports.delete = function(req, res) {
	var inventoryItem = req.inventoryItem ;

	inventoryItem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventoryItem);
		}
	});
};

/**
 * List of inventoryItems
 */
exports.list = function(req, res) {
	Inventory.find().sort('-created').populate('user', 'displayName').exec(function(err, inventory) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventory);
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
	Inventory.findById(id).populate('user', 'displayName').exec(function(err, inventoryItem) {
		if (err) return next(err);
		if (! inventoryItem) return next(new Error('Failed to load Order ' + id));
		req.inventoryItem = inventoryItem ;
		next();
	});
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.inventoryItem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
