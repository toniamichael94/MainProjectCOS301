'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inventory Schema
 */
var InventorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter product name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},	
	price: {
	type: Number,
	default: 0
	}
});

mongoose.model('Inventory', InventorySchema);