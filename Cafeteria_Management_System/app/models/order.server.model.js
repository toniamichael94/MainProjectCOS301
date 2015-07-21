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
	item: {
		type: String,
		required: 'Please fill in item name'
	},
	quantity: {
		type: Number,
		required: 'Please fill in quantity'
	},
	status: {
		type: String,
		enum: ['open', 'closed'],
		default: 'open'
	}
});

mongoose.model('Order', OrderSchema);
