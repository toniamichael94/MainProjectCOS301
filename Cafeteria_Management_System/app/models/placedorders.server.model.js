'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * PlacedOrders Schema
 */
var PlacedOrdersSchema = new Schema({
	productID: {
		type: String,
		ref: 'Inventory'
	},
	created: {
		type: Date,
		default: Date.now
	},	
	empID: {
	type: String,
	ref: 'Users'
	}
});

mongoose.model('Inventory', InventorySchema);