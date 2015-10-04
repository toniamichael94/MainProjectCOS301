'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var AuditSchema = new Schema({
	date: {
		type: Date,
		default: Date.now
	},
	event: {
        type: String,
        required: 'Please fill audit type'
    },
    details: {
       type: String,
       required: 'Please fill audit event'
    }
});

mongoose.model('Audit', AuditSchema);
