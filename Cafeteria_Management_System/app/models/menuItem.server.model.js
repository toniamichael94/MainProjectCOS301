'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var MenuItemSchema = new Schema({
	itemName: {
		type: String,
		default: '',
		required: 'Please fill in the name of the menu item',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	price: {
		type: Number,
		required: 'Please fill in the price of the menu item.'
	},
	description: {
		type: String,
		default:'',
		requried: 'Please provide a description of the menu item.'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('MenuItem', MenuItemSchema);
