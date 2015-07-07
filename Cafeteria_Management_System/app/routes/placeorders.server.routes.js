'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var placeorders = require('../../app/controllers/placeorders.server.controller');

	// placeorders Routes
	app.route('/placeorders')
		.get(placeorders.list)
		.post(users.requiresLogin, placeorders.create);

	app.route('/placeorders/:placeorderId')
		.get(placeorders.read)
		.put(users.requiresLogin, placeorders.hasAuthorization, placeorders.update)
		.delete(users.requiresLogin, placeorders.hasAuthorization, placeorders.delete);

	// Finish by binding the placeorder middleware
	app.param('placeorderId', placeorders.placeorderByID);
};
