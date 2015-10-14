'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var menuItems = require('../../app/controllers/menuItems.server.controller');

	//Reporting for menu Items
		app.route('/orders/generatePopularReport').post(menuItems.generatePopularReport);
		app.route('/orders/generateSoldReport').post(menuItems.generateSoldReport);
		app.route('/orders/generateReport').post(menuItems.generateReport);
			app.route('/orders/orders/inventoryReport').post(menuItems.inventoryReport);

	//Display Menu Items
	app.route('/loadMenuItems').get(menuItems.loadMenuItems);
	app.route('/loadMenuCategories').get(menuItems.loadMenuCategories);

	// check inventory items:
	app.route('/inventoryItems').get(menuItems.inventoryItems);
	app.route('/inventoryItems').post(menuItems.inventoryItems);

	//Search functions
  app.route('/menu/search').post(menuItems.searchMenu);
	app.route('/searchMenuCategory').post(menuItems.searchMenuCategory);

  //Update
	app.route('/orders/updateMenuItem').post(menuItems.updateMenuItem);
	app.route('/updateMenuCategory').post(menuItems.updateMenuCategory);
	app.route('/updateCategoryMenuItems').post(menuItems.	updateCategoryMenuItems);

	//Add image
	app.route('/orders/uploadImage').post(menuItems.uploadImage);

	//Delete
	app.route('/orders/deleteMenuItem').post(menuItems.deleteMenuItem);
	app.route('/orders/deleteMenuCategory').post(menuItems.deleteMenuCategory);

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
