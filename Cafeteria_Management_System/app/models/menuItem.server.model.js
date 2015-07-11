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
			enum: ['drinks', 'meals','snacks', 'dessert']
		}],
		required: 'Please provide a category for the menu item.'
	},
	/*ingredients:{
		ingredient:String,
		quantity:Number	//add reference to inventory
	},*/
	/*ingredients:{
					type:[{ingredient:String, quantity:Number}]
				},*/
	/*ingredients:[
	{ingredient:String, quantity:Number}
	],*/
	ingredients:{type:Object,default:[], required:'Please provide ingredients'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('MenuItem', MenuItemSchema);
