'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Placeorder Schema
 */
var PlaceorderSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Placeorder name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Placeorder', PlaceorderSchema);