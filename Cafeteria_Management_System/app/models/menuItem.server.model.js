'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * MenuItem Schema
 */
var MenuItemSchema = new Schema({
	name: {
		type: String,
		default: '',
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
		requried: 'Please provide a description of the menu item.'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('MenuItem', MenuItemSchema);