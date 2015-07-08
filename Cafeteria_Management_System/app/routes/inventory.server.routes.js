/*'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var inventory = require('../../app/controllers/inventory.server.controller');

	// Inventory Routes
	app.route('/inventory')
		.get(inventory.list)
		.post(users.requiresLogin, inventory.create);

	app.route('/inventory/:inventoryItemId')
		.get(inventory.read)
		.put(users.requiresLogin, inventory.hasAuthorization, inventory.update)
		.delete(users.requiresLogin, inventory.hasAuthorization, inventory.delete);

	// Finish by binding the Order middleware
	app.param('inventoryId', inventory.orderByID);
};*/

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var orders = require('../../app/controllers/orders.server.controller');

	// Orders Routes
	app.route('/orders')
		.get(orders.list)
		.post(users.requiresLogin, orders.create);

	app.route('/orders/:orderId')
		.get(orders.read)
		.put(users.requiresLogin, orders.hasAuthorization, orders.update)
		.delete(users.requiresLogin, orders.hasAuthorization, orders.delete);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
