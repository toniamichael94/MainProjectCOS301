'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var inventory = require('../../app/controllers/inventory.server.controller');

	//loadinginventory items from db
	app.route('/loadInventoryItems').get(inventory.loadInventoryItems);
	//create order
	app.route('/orders/create').post(inventory.create);

    //search route
    app.route('/orders/search').post(inventory.searchInventory);

    //update route
    app.route('/orders/updateInventory').post(inventory.updateInventory);

		//Reporting
		app.route('/orders/monthlyReport').post(inventory.monthlyReport);


	//update inventory quantity
	app.route('/orders/updateInventoryQuantity').post(inventory.updateInventoryQuantity);

	//decrease inventory quantity
	app.route('/orders/decreaseInventory').post(inventory.decreaseInventory);

	//Delete an inventory item
	app.route('/orders/deleteInventoryItem').post(inventory.deleteInventoryItem);

	// Inventory Routes
	app.route('/orders')
		.get(inventory.list)
		.post(users.requiresLogin, inventory.create);

	app.route('/orders/:orderId')
		.get(inventory.read)
		.put(users.requiresLogin, inventory.hasAuthorization, inventory.update)
		.delete(users.requiresLogin, inventory.hasAuthorization, inventory.delete);

	// Finish by binding the Order middleware
	app.param('inventoryId', inventory.orderByID);


};
