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
		unique: 'testing error message',
		required: 'Please fill in the name of the menu item',
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
	ingredients:{
		ingredient:String,
		quantity:Number	//add reference to inventory
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/**
 * Find possible not used 
 */
MenuItemSchema.statics.findUniqueItemName = function(itemName, suffix, callback) {
	var _this = this;
	var possibleItemName = itemName + (suffix || '');

	_this.findOne({
		itemName: possibleItemName
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleItemName);
			} else {
				return _this.findUniqueItemName(itemName, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('MenuItem', MenuItemSchema);
