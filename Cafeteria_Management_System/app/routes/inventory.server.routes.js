'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var inventory = require('../../app/controllers/inventory.server.controller');

	//loadinginventory items from db
	app.route('/loadInventoryItems').get(inventory.loadInventoryItems);
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
