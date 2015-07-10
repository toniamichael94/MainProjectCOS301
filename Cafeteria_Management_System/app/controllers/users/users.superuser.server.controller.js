'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Config = mongoose.model('Config');
  /*
   * Assign Roles
   * Last Edited by {Semaka Malapane}
	 */
exports.assignRoles = function(req, res) {
		User.update({username: req.body.userID}, {roles: [req.body.role]}, function(err, numAffected){
            console.log('USERNAME' + req.body.employeeID);
            console.log('ROLE' + req.body.role);
			if(err) return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else if (numAffected < 1){
				res.status(400).send({message: 'No such user!'});
			}
            /*else if(req.body.role === 'superuser'){
                console.log('HEEEEEEEEEEEEEEEELLLLLLLLLLLLLLLLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
                console.log('USERNAME2' + req.body.employeeID);
                User.update({username: req.body.employeeID}, {roles: 'user'});
                res.status(200).send({message: 'Role has been successfully assigned.'});
                //req.body.homePath;
            }*/
			else{
				res.status(200).send({message: 'Role has been successfully assigned.'});
			}
		});
};

/*
* Set System Wide Limit
* Last Edited by {Rendani Dau}
*/
exports.setSystemWideLimit = function(req, res){
	Config.update({name: 'System wide limit'}, {value: req.body.value}, function(err, numAffected){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		else if (numAffected < 1){
			var config = new Config();
			config.name = 'System wide limit';
			config.value = req.body.value;

			config.save(function(err){
				if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
				res.status(200).send({message: 'Limit has been succesfully changed.'});
			});
		}
		else{
			res.status(200).send({message: 'Limit has been succesfully changed.'});
		}
	});
};

/*
* Set Canteen Name
* Last Edited by {Rendani Dau}
*/
exports.setCanteenName = function(req, res){
	Config.update({name: 'Canteen name'}, {value: req.body.value}, function(err, numAffected){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		else if (numAffected < 1){
			var config = new Config();
			config.name = 'Canteen name';
			config.value = req.body.value;

			config.save(function(err){
				if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
				res.status(200).send({message: 'Canteen name has been succesfully changed.'});
			});
		}
		else{
			res.status(200).send({message: 'Canteen name has been succesfully changed.'});
		}
	});
};
