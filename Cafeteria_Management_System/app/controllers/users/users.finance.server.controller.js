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
	path = require('path'),
	configs = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	jsreport = require('jsreport');
	
	

	
exports.generateReport = function(req, res){
	console.log('in generate report');
		console.log('rendering');
		var sample = fs.readFileSync(path.resolve(__dirname, '../../reportTemplates/sample.html'), 'utf8');
		jsreport.render({
			template:{ content: sample},
			data: {
				number: '1',
				date: '01-01-2014',
				dueDate: '01-20-2014',
				to: { name: 'John Lemon' , description: '', mail: 'john.lemon@finmail.com'},
				items : [ { name: 'Designing online portal', quantity: 1, price : 1000}, 
							{ name: 'Implementing online portal', quantity: 1, price : 8000},
							{ name: 'Testing online portal', quantity: 1, price : 2000} ]
			}
		}).then(function(out) {
			console.log('in render function');
			out.stream.pipe(res);
		});
	
};