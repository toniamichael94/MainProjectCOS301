'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var menuItems = require('../../app/controllers/menuItems.server.controller');

	//Display Menu Items
	app.route('/loadMenuItems').get(menuItems.loadMenuItems);
	app.route('/loadMenuCategories').get(menuItems.loadMenuCategories);

	// check inventory items:
	app.route('/inventoryItems').get(menuItems.inventoryItems);
	app.route('/inventoryItems').post(menuItems.inventoryItems);
    app.route('/menu/search').post(menuItems.searchMenu);

     //Update
	app.route('/orders/updateMenuItem').post(menuItems.updateMenuItem);
	//Delete
	app.route('/orders/deleteMenuItem').post(menuItems.deleteMenuItem);
	//create order
	app.route('/orders/createMenuItem').post(menuItems.createMenuItem);
	//create menu category
	app.route('/orders/createMenuCategory').post(menuItems.createMenuCategory);

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
