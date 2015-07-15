'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

  var ConfigSchema = new Schema({
      name: {
        type: String,
        unique: 'Config type exists',
        required: 'Please fill config name'
      },
      value: {
        type: String,
        required: 'Please fill config value'
      }
  });

  mongoose.model('Config', ConfigSchema);
