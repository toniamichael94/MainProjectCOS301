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
   * Last Edited by {Rendani Dau}
	 */
exports.assignRoles = function(req, res) {
		User.update({username: req.body.userID}, {roles: [req.body.role]}, function(err, numAffected){
			if(err) return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else if (numAffected < 1){
				res.status(400).send({message: 'No such user!'});
			}
			else{
				res.status(200).send({message: 'Role has been succesfully assigned.'});
			}
		});
};

/*
* Set System Wide Limit
* Last Edited by {Rendani Dau}
*/
exports.setSystemWideLimit = function(req, res){
    Config.findOne({Name: 'System wide limit'}, function(err, model){
			if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			else{
				if(!model){
						console.log(req.body);
						var config = new Config();
						config.name = 'System wide limit';
						config.value = req.body.value;

						config.save(function(err){
							if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
							res.status(200).send({message: 'Limit has been succesfully changed.'});
						});
				}
				else{
						model.value = req.body.value;

						model.save(function(err){
							if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
							res.status(200).send({message: 'Limit has been succesfully changed.'});
						});
				}
			}
		});
};

/*
* Set Canteen Name
* Last Edited by {Rendani Dau}
*/
exports.setCanteenName = function(req, res){
		Config.findOne({Name: 'Canteen name'}, function(err, model){
			if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			if(!model){
				var config = new Config();
				config.name = 'Canteen name';
				config.value = req.body.value;

				config.save(function(err){
					if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
					res.status(200).send({message: 'Canteen name has been successfully changed.'});
				})
			}
			else {
				model.value = req.body.value;

				model.save(function(err){
					if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
					res.status(200).send({message: 'Canteen name has been succesfully changed.'});
				});
			}
		});
};
