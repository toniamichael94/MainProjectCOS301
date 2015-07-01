'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tests = require('../../app/controllers/tests.server.controller');

	// Tests Routes
	app.route('/tests')
		.get(tests.list)
		.post(users.requiresLogin, tests.create);

	app.route('/tests/:testId')
		.get(tests.read)
		.put(users.requiresLogin, tests.hasAuthorization, tests.update)
		.delete(users.requiresLogin, tests.hasAuthorization, tests.delete);

	// Finish by binding the Test middleware
	app.param('testId', tests.testByID);
};
