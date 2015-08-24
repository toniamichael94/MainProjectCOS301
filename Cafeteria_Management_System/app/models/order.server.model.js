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
