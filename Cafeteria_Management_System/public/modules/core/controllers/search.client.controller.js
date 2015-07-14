'use strict';
/**
 * Created by tonia on 2015/07/13.
 */

var User = require('./app/models/user.server.model.js');

// get all the users
User.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
});
