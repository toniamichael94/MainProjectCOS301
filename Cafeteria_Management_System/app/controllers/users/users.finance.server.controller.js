'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Config = mongoose.model('Config'),
    formidable = require('formidable'),
    fs = require('fs'),
	configs = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	jsreport = require('jsreport');
	
exports.generateReport = function(req, res){
	console.log('in generate report');
	jsreport.render("<h1>Hello world</h1>").then(function(out) {
		console.log('in render function');
		out.stream.pipe(res);
	});
};