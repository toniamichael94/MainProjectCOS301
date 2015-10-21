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

/**
 * Load Canteen info
 * The function is used to get the canteen name from the database and display it everywhere it shoud
 * @param {Object} req
 * @param {Object} res
 */
exports.loadCanteenInfo = function(req, res) {
	Config.findOne({name: 'Canteen name' }, function(err, canteenName){
		if(err || !canteenName) return res.status(400).send({message: 'canteen name not found' });
		else {
			res.status(200).send({message: canteenName});
		}
	});
};

/**
 * Load captions
 * The function is used to get the image captions from the database and display them with their corresponding images
 * @param {Object} req
 * @param {Object} res
 */
exports.loadCaptions = function(req, res){
	Config.find({$or: [{name: 'Carousel-caption1'},{name: 'Carousel-caption2'},{name: 'Carousel-caption3'},{name: 'Carousel-caption4'}]}, function(err, captions){
		res.status(200).send({message: captions});
	});
};
