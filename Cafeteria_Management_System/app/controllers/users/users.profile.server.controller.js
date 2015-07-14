'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
    Config = mongoose.model('Config');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;
		user.displayEmail = user.email;
		user.displayUserName = user.username;

        if((user.recipientEmailAddress1 === true)&&(user.recipientEmailAddress2 === false)){
            user.displayRecipientEmailOption = 'Finance';
        }
        if((user.recipientEmailAddress2 === true)&&(user.recipientEmailAddress1 === false)){
            user.displayRecipientEmailOption = 'Email account provided';
        }
        if((user.recipientEmailAddress2 === true)&&(user.recipientEmailAddress1 === true)){
            user.displayRecipientEmailOption = 'Finance and email account provided';
        }
        if((user.recipientEmailAddress2 === false)&&(user.recipientEmailAddress1 === false)){
            user.displayRecipientEmailOption = 'Default: email account provided';
        }

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Get system wide limit
 * Last edited by {Rendani Dau}
 */
exports.getSystemLimit = function(req, res){
    console.log('getting system limit');
    Config.findOne({name: 'System wide limit'}, function(err, row){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(200).json({val: row.value});
        }
    });
};
