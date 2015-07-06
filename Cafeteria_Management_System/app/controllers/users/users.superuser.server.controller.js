'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

  /*
   * Assign Roles
   * Last Edited by {Rendani Dau}
	 */
exports.assignRoles = function(req, res) {
		User.update({username: req.body.userID}, {roles: [req.body.role]}, function(err){
			if(err) return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else {
				res.status(200).send({message: 'Role has been succesfully assigned.'});
			}
		});
};

exports.setSystemWideLimit = function(req, res){
	 
};
