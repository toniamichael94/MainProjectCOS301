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
 * Search
 */
exports.searchEmployee=function(req,res){
    if (req.body.username) {
        User.findOne({
            username: req.body.username
        }, function (err, user) {
            console.log('users.profile.server.controller' + req.body.username);
            if (!user) {
                return res.status(400).send({
                    message: 'No account with that username has been found'
                });
            }   else if(user){
                return res.status(400).send({
                    message: 'This user has been found'
                });
            }
        });
    }
    else {
        return res.status(400).send({
            message: 'Username field must not be blank'
        });
    }
};
