'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var menuItems = require('../../app/controllers/menuItems.server.controller');

	//Display Menu Items
	app.route('/loadMenuItems').get(menuItems.loadMenuItems);

	// check inventory items:
	app.route('/inventoryItem').get(menuItems.loadMenuItems);


	//create order
	app.route('/orders/createMenuItem').post(menuItems.createMenuItem);

	// MenuItems Routes
	/*app.route('/orders')
		.get(menuItems.list)
		.post(users.requiresLogin, menuItems.create);*/

	app.route('/orders/:orderId')
		.get(menuItems.read)
		.put(users.requiresLogin, menuItems.hasAuthorization, menuItems.update)
		.delete(users.requiresLogin, menuItems.hasAuthorization, menuItems.delete);

	// Finish by binding the menuItem middleware
	app.param('menuItemId', menuItems.orderByID);

};
