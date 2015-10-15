'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');

	app.route('/loadCanteenInfo').get(core.loadCanteenInfo);
	app.route('/loadCaptions').get(core.loadCaptions);
	app.route('/').get(core.index);
};
