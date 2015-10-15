'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

  //setting up searching functionality
  app.route('/users/search').post(users.searchEmployee);

	//Setting up superuser api {Rendani Dau}
	app.route('/users/superuserAssignRoles').post(users.assignRoles);

	app.route('/users/adminUserAssignRoles').post(users.assignRolesAdminRole);
    app.route('/users/superuserChangeEmployeeID').post(users.changeEmployeeID);
    app.route('/users/superuserRemoveEmployee').post(users.removeEmployee);
    app.route('/users/superuserSetSystemWideLimit').post(users.setSystemWideLimit);

	app.route('/users/superuserSetCanteenName').post(users.setCanteenName);
	app.route('/users/superuserSetThemeName').post(users.setThemeName);
	app.route('/config/theme').post(users.getTheme);
	app.route('/users/superuserUploadImage').post(users.uploadImage);
	app.route('/users/superuserGetAuditTypes').get(users.getAuditTypes);
	app.route('/users/superuserGetAudits').post(users.getAudits);
	app.route('/users.superuserDeleteImage').post(users.deleteImage);
	
    //loading employees from db
    app.route('/loadEmployees').get(users.loadEmployees);
	
	//Setting up finance API
	app.route('/users/finance/generateReportUser').post(users.generateReportUser);
	app.route('/users/finance/generateReportAll').post(users.generateReportAll);

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
	app.route('/users/accounts').delete(users.removeOAuthProvider);
    app.route('/users/getSystemLimit').get(users.getSystemLimit);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);
	app.route('/auth/checkSuperUser').post(users.checkSuperUser);

/*	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	*/// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));
/*
	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));
*/
	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
