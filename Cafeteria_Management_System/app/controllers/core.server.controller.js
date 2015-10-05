'use strict';

/**
 * Module dependencies.
 */
 var _ = require('lodash'),
 	//errorHandler = require('./errors.server.controller'),
 	mongoose = require('mongoose'),
 	passport = require('passport'),
 	User = mongoose.model('User'),
 	Config = mongoose.model('Config');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.loadCanteenInfo = function(req, res) {

	Config.findOne({name: 'Canteen name' }, function(err, canteenName){
		if(err || !canteenName) return res.status(400).send({message: 'canteen name not found' });
		else {
			res.status(200).send({message: canteenName});
		//	var v = canteenName; // testing
		//	console.log(v); // testing 
		}

	});

	//console.log(canteenName);
};
