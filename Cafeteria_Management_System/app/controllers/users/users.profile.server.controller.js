'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

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
        console.log("reci : "+ user.recipientEmailAddress);

        if((user.recipientEmailAddress1 ==true)&&(user.recipientEmailAddress2 ==false)){
            user.displayRecipientEmailOption = 'Finance';
            console.log("display: "+user.displayRecipientEmailOption);
        }
        if((user.recipientEmailAddress2 ==true)&&(user.recipientEmailAddress1 ==false)){
            user.displayRecipientEmailOption = 'Email account provided';
            console.log("display: "+user.displayRecipientEmailOption);
        }
        if((user.recipientEmailAddress2 ==true)&&(user.recipientEmailAddress1 ==true)){
            user.displayRecipientEmailOption = 'Finance and email account provided';
            console.log("display: "+user.displayRecipientEmailOption);
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
