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
		unique: true,
		required: 'Please fill in the item name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		default:'',
		required: 'Please provide a description of the menu item.'
	},
	price: {
		type: Number,
		required: 'Please fill in the price of the menu item.',
		min:0
	},
	category: {
		type: [{
			type: String,
			enum: ['burgerBar', 'dailyLunch','extra', 'onTheSide', 'resaleItems', 'saladBar', 'sweetTreats', 'toastedSandwiches','tramezzinis', 'drinks', 'specialOfTheDay']
		}],
		required: 'Please provide a category for the menu item.'
	},
	ingredients:{type:Object,default:[], required:'Please provide ingredients'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('MenuItem', MenuItemSchema);
