'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Config = mongoose.model('Config'),
    formidable = require('formidable'),
    fs = require('fs')

  /*
   * Assign Roles
   */
exports.assignRoles = function(req, res) {

    if(req.body.role === 'admin'){
        User.find({roles: 'admin'}, function(err, items) {
            if(items.length > 0 ){
                User.update({username: items[0].username}, {roles: ['user']}, function(err1, numAffected1){
                });
            }
            else {
                res.status(400).send({message: 'Did not change Admin!'});
            }
        });
    }

		User.update({username: req.body.userID}, {roles: [req.body.role]}, function(err, numAffected){
			if(err) return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else if (numAffected < 1){
				res.status(400).send({message: 'No such employee ID!'});
			}
            else if(req.body.role === 'superuser'){
                User.update({username: req.user.username}, {roles: ['user']}, function(err, numAffected){
                    if(err) return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    else if (numAffected < 1){
                        res.status(400).send({message: 'Did not change superuser!'});
                    }
                    else{
                        res.status(200).send({message: 'SU Changed'});
                    }
                });
            }
			else{
				res.status(200).send({message: 'Role has been successfully assigned.'});
			}
		});
};


/*
* Set roles by the Admin user
*/

exports.assignRolesAdminRole = function(req, res) {
	var userName = req.body.userID;
	var role = req.body.role;
	var error;

		if(req.body.role === 'superuser'){
			User.find({roles: 'superuser'}, function(err, items) {
                if(items.length > 0){
                    User.update({username: items[0].username}, {roles: ['user']}, function(err1, numAffected1){
                    });
                }
                else {
                      res.status(400).send({message: 'Did not change Admin!'});
                }
			});
        }

		User.update({username: req.body.userID}, {roles: [req.body.role]}, function(err, numAffected){
			if(err) return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else if (numAffected < 1){
				res.status(400).send({message: 'No such Employee ID!'});
			}
            else if(req.body.role === 'admin'){

                User.update({username: req.user.username}, {roles: ['user']}, function(err, numAffected){
                    if(err) return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    else if (numAffected < 1){
                        res.status(400).send({message: 'Did not change Admin!'});
                    }
                    else{
                        res.status(200).send({message: 'Admin Changed'});
                    }
                });
            }
			else{
				res.status(200).send({message: 'Role has been successfully assigned.'});
			}
		});
};


/*
 * Change Employee ID
 * Last Edited by {Semaka Malapane and Tonia Michael}
 */
exports.changeEmployeeID = function(req, res) {
    if(req.body.newUserID) {
        User.update({username: [req.body.currentUserID]}, {username: req.body.newUserID}, function (err, numAffected) {
            console.log('current user id ' + req.body.currentUserID);
            console.log('new user id ' + req.body.newUserID);
            if (err) return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
            else if (numAffected < 1) {
                res.status(400).send({message: 'No such employee ID!'});
            }
            else {
                res.status(200).send({message: 'Employee ID has been successfully changed.'});
            }
        });
    }
    else
    {
        res.status(400).send({message: 'The new employee id field cannot be empty!'});
    }
};

/*
 * Remove Employee
 * Last Edited by {Semaka Malapane and Tonia Michael}
 */
exports.removeEmployee = function(req, res) {
    if(req.body.userID) {
        User.remove({username: [req.body.userID]}, function (err, numAffected) {
            console.log('remove user id ' + req.body.userID);
            if (err) return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
            else if (numAffected < 1) {
                res.status(400).send({message: 'No such employee!'});
            }
            else {
                res.status(200).send({message: 'Employee has been successfully removed.'});
            }
        });
    }
    else
    {
        res.status(400).send({message: 'The employee id field cannot be empty!'});
    }
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
				res.status(200).send({message: 'Limit has been successfully changed.'});
			});
		}
		else{
			res.status(200).send({message: 'Limit has been successfully changed.'});
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
				res.status(200).send({message: 'Canteen name has been successfully changed.'});
			});
		}
		else{
			res.status(200).send({message: 'Canteen name has been successfully changed.'});
		}
	});
};

/*
 * Upload main image for branding
 * Last Edited by {Rendani Dau}
 */
exports.uploadImage = function(req, res){
	var form = new formidable.IncomingForm();
	console.log('About to parse image');
    console.log(req);
	form.parse(req, function(error, fields, files){
		console.log('image parsed');
		if(error){
			return res.status(400).send({message: errorHandler.getErrorMessage(error)});
		}
		fs.rename(files.upload.path, './public/modules/core/img/brand/logo.png', function(err){
			if(err){
				console.log(errorHandler.getErrorMessage(err));
				fs.unlink('./public/modules/core/img/brand/logo.png');
				fs.rename(files.upload.path, './public/modules/core/img/brand/logo.png');
			}
			res.redirect('/');
		});
	});
};

/*
 * Loading the employees from the database
 */
exports.loadEmployees = function(req, res){

    User.find({}, function(err, employees) {
        var itemMap = {};

        employees.forEach(function(employees) {
            itemMap[employees._id] = employees;
            console.log(employees.username);
            //console.log(employees.username);
        });
        if(err || !itemMap) return res.status(400).send({message: 'Employees not found' });
        else {
            console.log('LOAD');
            //console.log(employees);
            res.status(200).send({message: itemMap});
        }
    });
/*

    exports.really = function(req, res) {
        $scope.r = confirm("Press a button");
        if ($scope.r == true) {
            $scope.x = "You pressed OK!";
        } else {
            $scope.x = "You pressed Cancel!";
        }
    };*/


};
