'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var NotificationsSchema = new Schema({
    	username: {
       		type: String,
       		required: 'Please fill in username'
        },
	subject: {
       		type: String,
       		required: 'Please fill in message subject'
        },
	message: {
        	type: String,
        	required: 'Please fill in message type'
    	},
	status: {
		type: String,
		enum: ['read', 'unread'],
		default: 'unread'
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Notifications', NotificationsSchema);
