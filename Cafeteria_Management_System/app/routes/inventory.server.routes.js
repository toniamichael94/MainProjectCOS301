/*'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var orders = require('../../app/controllers/inventory.server.controller');

	// Inventory Routes
	app.route('/orders')
		.get(orders.list)
		.post(users.requiresLogin, orders.create);

	app.route('/orders/:orderId')
		.get(orders.read)
		.put(users.requiresLogin, orders.hasAuthorization, orders.update)
		.delete(users.requiresLogin, orders.hasAuthorization, orders.delete);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};*/

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var inventory = require('../../app/controllers/inventory.server.controller');
	
	//create order
	app.route('/orders/create').post(inventory.create);

	// Inventory Routes
	app.route('/orders')
		.get(inventory.list)
		.post(users.requiresLogin, inventory.create);

	app.route('/orders/:orderId')
		.get(inventory.read)
		.put(users.requiresLogin, inventory.hasAuthorization, inventory.update)
		.delete(users.requiresLogin, inventory.hasAuthorization, inventory.delete);

	// Finish by binding the Order middleware
	app.param('invnetoryId', inventory.orderByID);

};
