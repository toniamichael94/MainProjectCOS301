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
	productName: {
		type: String,
		default: '',
		required: 'Please fill inventory name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	/*user: {
		type: Schema.ObjectId,
		ref: 'User'
	},*/
	unit: {
		type: String,
		default: '',
		required: 'Please fill in the unit type, for example grams, litre etc.'
	}
});

mongoose.model('Inventory', InventorySchema);
