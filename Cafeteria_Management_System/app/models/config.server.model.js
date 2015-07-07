'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

  var ConfigSchema = new Schema({
      name: {
        type: String,
        default: '',
        required: 'Please fill config name'
      },
      value: {
        type: String,
        default: '',
        required: 'Please fill config value'
      }
  });

  mongoose.model('Config', ConfigSchema);
