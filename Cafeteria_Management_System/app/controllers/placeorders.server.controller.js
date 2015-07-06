'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Placeorder = mongoose.model('Placeorder'),
	_ = require('lodash');

/**
 * Create a Placeorder
 */
exports.create = function(req, res) {
	var placeorder = new Placeorder(req.body);
	placeorder.user = req.user;

	placeorder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placeorder);
		}
	});
};

/**
 * Show the current Placeorder
 */
exports.read = function(req, res) {
	res.jsonp(req.placeorder);
};

/**
 * Update a Placeorder
 */
exports.update = function(req, res) {
	var placeorder = req.placeorder ;

	placeorder = _.extend(placeorder , req.body);

	placeorder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placeorder);
		}
	});
};

/**
 * Delete an Placeorder
 */
exports.delete = function(req, res) {
	var placeorder = req.placeorder ;

	placeorder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placeorder);
		}
	});
};

/**
 * List of Placeorders
 */
exports.list = function(req, res) { 
	Placeorder.find().sort('-created').populate('user', 'displayName').exec(function(err, placeorders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(placeorders);
		}
	});
};

/**
 * Placeorder middleware
 */
exports.placeorderByID = function(req, res, next, id) { 
	Placeorder.findById(id).populate('user', 'displayName').exec(function(err, placeorder) {
		if (err) return next(err);
		if (! placeorder) return next(new Error('Failed to load Placeorder ' + id));
		req.placeorder = placeorder ;
		next();
	});
};

/**
 * Placeorder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.placeorder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
