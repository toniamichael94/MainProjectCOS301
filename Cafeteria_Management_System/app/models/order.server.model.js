'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	username: {
		type: String,
		required: 'Please fill in employee ID',
		trim: true
	},
        active:{
                type: Boolean,
                default: true
        },
	created: {
		type: Date,
		default: Date.now
	},
	orderNumber: {
		type: Number,
		required: 'Order number has not been initialised'
	},
	itemName: {
		type: String,
		required: 'Please fill in item name'
	},
	price: {
		type: Number,
		required: 'item price has not been initialized'
	},
	quantity: {
		type: Number,
		required: 'Please fill in quantity'
	},
	category:{
		type: String,
		required: 'No category for menu item.'
	},
    preferences: {
        type: String,
        default: 'none'
    },
	status: {
		type: String,
		enum: ['open', 'ready', 'closed'],
		default: 'open'
	}
});

mongoose.model('Order', OrderSchema);
