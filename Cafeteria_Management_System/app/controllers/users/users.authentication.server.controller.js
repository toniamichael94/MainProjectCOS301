'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Config = mongoose.model('Config');

/**
 * Signup
 * Last edited by {Rendani Dau}
 * added check to see if limit is less than system wide limit
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

    Config.findOne({name: 'System wide limit'}, function(err, row){
        if(!err && row){
            if(req.body.limit > row.value){
                return res.status(400).send({message: 'Limit cannot exceed ' + row.value});
            }
            else{
                if(req.body.password === req.body.confirmPassword){
                    // Init Variables
                    var user = new User(req.body);
                    var message = null;

                    // Add missing user fields
                    user.provider = 'local';
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
                        user.displayRecipientEmailOption = 'Default: send to finance';
                    }


                    // Then save the user
                    user.save(function(err) {

                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            // if (user.password === user.confirmPassword) {
                            // Remove sensitive data before login
                            user.password = undefined;
                            user.salt = undefined;

                            req.login(user, function(err) {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    res.json(user);
                                }
                            });
                            /*}else {
                             return res.status(400).send({
                             message: 'Passwords do not match'
                             });
                             }*/
                        }
                    });
                }
                else {
                    return res.status(400).send({message: 'Passwords do not match.'});
                }
            }
        }
        else{
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });


};

//load the canteen name


exports.checkSuperUser = function(){

	var error;
	User.find({roles : 'superuser'}, function(error, model) {
  //put code to process the results here
//	console.log('models');
	var v = model;
//	console.log(v);
	if(model.length < 1){
		console.log('NO USER FOUND - create default super user ');
		var superUser = new User({
			firstName : 'Super',
			lastName : 'User',
			username : 'SuperUser',
			password : 'SuperUser',
			email : 'email@address.com',
			recipientEmailAddress : 'email@address.com',
			roles : 'superuser',
			provider : 'local',
			limit : '500'
		});

			var adminUser = new User({
				firstName : 'Admin',
				lastName : 'User',
				username : 'AdminUser',
				password : 'AdminUser',
				email : 'email@address.com',
				recipientEmailAddress : 'email@address.com',
				roles : 'admin',
				provider : 'local',
				limit : '500'

		});

		Config.update({name: 'System wide limit'}, {value: '5000'}, function(err, numAffected){
			});
				var config = new Config();
				config.name = 'System wide limit';
				config.value = '5000';


				config.save(function(err){

		});
		superUser.save(function(err, superUser) {
  		if (err) error.superUser = err;//return console.error(err);
  			console.dir(superUser);
			});
			adminUser.save(function(err, adminUser) {
	  		if (err) return console.error(err);
	  			console.dir(superUser);
	});

	}else {
		console.log('USER FOUND ');
	}

});

User.find({roles : 'admin'}, function(error, model2) {
var v = model2;
if(model2.length < 1){
	console.log('NO USER FOUND - create default admin user');
	var adminUser = new User({
		firstName : 'Admin',
		lastName : 'User',
		username : 'AdminUser',
		password : 'AdminUser',
		email : 'email@address.com',
		recipientEmailAddress : 'email@address.com',
		roles : 'admin',
		provider : 'local',
		limit : '500'

		// now set default system limit
		//set default system wyde limit

	});


	adminUser.save(function(err, superUser) {
		if (err) error.superUser = err;//return console.error(err);
			console.dir(superUser);
});
}else {
	console.log('USER FOUND ');
}

});

};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							displayEmail: providerUserProfile.displayEmail,
							displayUserName: providerUserProfile.displayUserName,
                            displayRecipientEmailOption: providerUserProfile.displayRecipientEmailOption,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
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
	}
};
