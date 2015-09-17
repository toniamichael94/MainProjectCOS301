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
	Order = mongoose.model('Order'),
    formidable = require('formidable'),
    fs = require('fs'),
	path = require('path'),
	configs = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	jsreport = require('jsreport');
	
	

	
exports.generateReport = function(req, res){
	User.findOne({username: req.body.username}, function(err, user){
		if(err || !user) return res.status(400).send({message: 'Could not generate report!'});
		Order.find({username: req.body.username, created: {$gt: req.body.start, $lt: req.body.end}}, function(err, orders){
			if(err) return res.status(400).send({message: 'Could not generate report!'});
			
			//Read the sample html file for pdf format
			var sample = fs.readFileSync(path.resolve(__dirname, '../../reportTemplates/sample.html'), 'utf8');
			//Render PDF with the given details
			console.log('rendering');
			jsreport.render({
				template:{ content: sample,
					helpers: 'function mult(a,b){ return a*b; }',//'function total(order){return 10;}'],
					engine: 'handlebars'},
				data: {
					date: new Date().getDate(),
					to: { name: user.displayName, mail: user.email},
					items: orders
				}
			}).then(function(out) {
				//if(err) return res.status(400).send({message: 'Could not render report!'})
				console.log('in render function');
				out.stream.pipe(res);
			});
		});
	
	});
	
};