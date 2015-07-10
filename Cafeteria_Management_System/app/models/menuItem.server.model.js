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
		required: 'Please fill in the price of the menu item.',
		min:0
	},
	description: {
		type: String,
		default:'',
		requried: 'Please provide a description of the menu item.'
	},
	category: {
		type: [{
			type: String,
			enum: ['drinks', 'meals','snacks', 'dessert']
		}],
		default: ['units']
	},
	ingredients:{
		ingredient:String,
		quantity:Number	//add reference to inventory
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('MenuItem', MenuItemSchema);
