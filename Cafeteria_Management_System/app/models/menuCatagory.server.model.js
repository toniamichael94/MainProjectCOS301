'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

  var  MenuCatagorySchema = new Schema({
      name: {
        type: String,
        unique: 'Config type exists',
        required: 'Please fill config name'
      },
			active:{
				type: Boolean,
				default: true
			}
  });

  mongoose.model('MenuCatagory', MenuCatagorySchema);
