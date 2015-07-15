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
		unique:true,
		default: '',
		required: 'Please fill inventory name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	unit: {
		type: [{
			type: String,
			enum: ['g', 'mg', 'kg','ml', 'l','units']
		}],
		default: ['units']
	},
	quantity: {
		type: Number,
		required: 'Please fill in the quantity.'
	}
});

mongoose.model('Inventory', InventorySchema);
