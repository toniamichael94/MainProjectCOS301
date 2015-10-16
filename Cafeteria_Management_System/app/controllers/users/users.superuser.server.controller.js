'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Audit = mongoose.model('Audit'),
	Config = mongoose.model('Config'),
	Order = mongoose.model('Order'),
    formidable = require('formidable'),
	configs = require('../../../config/config'),
	nodemailer = require('nodemailer'),
  fs = require('fs'),
  fse = require('fs-extra');
 function audit(_type, data){
	var _audit = {
		event: _type,
		details: JSON.stringify(data)
	};
	Audit.create(_audit, function(err){
		if(err){ 
			console.log('Audit not created for ' + _type);
			console.log(errorHandler.getErrorMessage(err));
		}
	});
}
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
		
		
		var dat = req.body.role + ' role has been assigned to ' + req.body.userID + ' by Superuser';
		audit('Role change', dat);
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
			
			
			var dat = req.body.role + ' role has been assigned to ' + req.body.userID + ' by Admin user';
			audit('Role change', dat);
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
                return res.status(400).send({message: 'No such employee ID!'});
            }
            else {
				var dat = 'EmployeeID changed from ' + req.body.currentUserID + ' to ' + req.body.newUserID;
				
				audit('EmployeeID change', dat);

                Order.update({username: [req.body.currentUserID]}, {username: req.body.newUserID}, {multi: true }, function (err, numAffected) {
                    console.log('current user id ' + req.body.currentUserID);
                    console.log('new user id ' + req.body.newUserID);
                    if (err) return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    else if (numAffected < 1) {
                        res.status(400).send({message: 'Employee has no orders placed - EmployeeID updated in user database!'});
                    }
                    /*else {
                        //var dat = 'EmployeeID changed from ' + req.body.currentUserID + ' to ' + req.body.newUserID;

                        //audit('EmployeeID change', dat);
                        res.status(200).send({message: 'Employee ID has been successfully changed.'});
                    }*/
                });
                return res.status(200).send({message: 'Employee ID has been successfully changed.'});
            }
        });
    }
    else
    {
        res.status(400).send({message: 'The new employee id field cannot be empty!'});
    }
};

/*
 * Audits
 */
exports.getAudits = function(req, res){
	if(req.body.type === 'all'){
		Audit.find({date: {$gte: req.body.from, $lte: req.body.to}}, function(err, audits){
			if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			res.status(200).send({message: audits});
		});
	}
	else
		Audit.find({event: req.body.type}, function(err, audits){
			if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			res.status(200).send({message: audits});
		});
};

exports.getAuditTypes = function(req, res){
	Audit.find().distinct('event', function(err, result){
		if(err) return res.status(400).send({message: 'Could not get audit types'});
		
		return res.status(200).send({message: result});
	});
};

/*
 * Remove Employee
 * Last Edited by {Semaka Malapane and Tonia Michael}
 */
exports.removeEmployee = function(req, res) {
  if(req.body.userID) {
        User.update({username: [req.body.userID]}, {active: false}, function (err, numAffected) {
            console.log('deactivate user id ' + req.body.userID);
            if (err) return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
            else if (numAffected < 1) {
                return res.status(400).send({message: 'No such employee!'});
            }
            else {
		var dat = 'Employee with EmployeeID ' + req.body.userID + ' has been removed from database';
		audit('Employee removal', dat);
                Order.update({username: [req.body.userID]}, {active: false}, function (err, numAffected) {
                    if (err) return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    else if (numAffected < 1) {
                        res.status(400).send({message: 'Employee has no orders placed but has been removed in the user database!'});
                    }
                    /*else {
                        res.status(200).send({message: 'Employee has been successfully removed.'});
                    }*/
                });
                return res.status(200).send({message: 'Employee has been successfully removed.'});
            }
        });
    }
    else
    {
        res.status(400).send({message: 'The employee id field cannot be empty!'});
    }
    /*if(req.body.userID) {
        User.remove({username: [req.body.userID]}, function (err, numAffected) {
            console.log('remove user id ' + req.body.userID);
            if (err) return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
            else if (numAffected < 1) {
                return res.status(400).send({message: 'No such employee!'});
            }
            else {
				var dat = 'Employee with EmployeeID ' + req.body.userID + ' has been removed from database';
				audit('Employee removal', dat);
                Order.update({username: [req.body.userID]}, {active: false}, function (err, numAffected) {
                    if (err) return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    else if (numAffected < 1) {
                        res.status(400).send({message: 'Employee has no orders placed but has been removed in the user database!'});
                    }
                });
                return res.status(200).send({message: 'Employee has been successfully removed.'});
            }
        });
    }
    else
    {
        res.status(400).send({message: 'The employee id field cannot be empty!'});
    }*/
};

/*
 * Activate Employee
 * Last Edited by {Semaka Malapane}
 */
/*exports.activateEmployee = function(req, res) {
    if(req.body.userID) {
        User.update({username: [req.body.userID]}, {active: true}, function (err, numAffected) {
            console.log('reactivate user id ' + req.body.userID);
            if (err) return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
            else if (numAffected < 1) {
                res.status(400).send({message: 'No such employee - employee needs to sign up!'});
            }
            else {
				/*var dat = 'Employee with EmployeeID ' + req.body.userID + ' has been removed from database';
				audit('Employee removal', dat);
                res.status(200).send({message: 'Employee has been successfully reactivated.'});
            }
        });
    }
    else
    {
        res.status(400).send({message: 'The employee id field cannot be empty!'});
    }
};*/

/*
* Set System Wide Limit
* Last Edited by {Semaka Malapane}
*/
//Helper function to notify all users of CMS about system limit change
/*function sendMessage(newLimit){
	User.findOne({}, function(err, user){
		users.forEach(function(user){
			if(err){
				console.log(err);
				return;
			}
			var mailOptions = {
				subject: 'Your Order Is Ready'
			};
			mailOptions.to = user.username;
			mailOptions.text = '<p> Dear ' + user.displayName + ',<br> <br> ' +
										'Please note the system limit for the Cafeteria Management System has been changed to R' + newLimit + '. <br>'+
										'Please go to edit profile if you\'d like to adjust your limit.<br> <br>'+
										'The CMS Team <br> </p>';
			var notification = new Notifications({
				username: mailOptions.to,
				subject: mailOptions.subject,
				message: mailOptions.text
			});
			notification.save(function(err) {
				if(err) {
					console.log('ERROR!!!!!!!!!!');
					console.log(notification);
					return;
				}
				console.log('Notification has been created');
			});
		});
	});
}*/

/*
* Set System Wide Limit
* Last Edited by {Rendani Dau}
*/
//Helper function to mail all users of CMS
function sendEmail(newLimit){
	User.find({}, function(err, users){
		var smtpTransport = nodemailer.createTransport(configs.mailer.options);
		users.forEach(function(user){
			
			var mailOptions = {
				from: configs.mailer.from,
				subject: 'System Wide Spending Limit Updated'
			};
			mailOptions.to = user.email;
			mailOptions.text = 'Dear ' + user.displayName + ',\n\n' +
									'Please note the system limit for the Cafeteria Management System has been changed to R' + newLimit + '\n'+
									'Please visit CMS if you\'d like to adjust your limit.\n\n'+
									'The CMS Team';
			smtpTransport.sendMail(mailOptions, function(err){ 
				if(err) console.log('Email not sent' + err); 
			});
		});
	});
}

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
				
				User.update({limit: { $gt: req.body.value }}, {limit: req.body.value}, { multi: true }, function(err, numAffected){
				if(err)
					res.status(200).send({message: 'Limit has been successfully changed. No users updated!'});
				else
					res.status(200).send({message: 'Limit has been successfully changed. ' + numAffected + ' users have been updated'});
				var dat = 'The system wide limit has been changed to ' + req.body.value;
				audit('Admin settings change', dat);
				sendEmail(req.body.value);
			});
			});
		}
		else{
			User.update({limit: { $gt: req.body.value }}, {limit: req.body.value}, { multi: true }, function(err, numAffected){
				if(err)
					res.status(200).send({message: 'Limit has been successfully changed. No users updated!'});
				else
					res.status(200).send({message: 'Limit has been successfully changed. ' + numAffected + ' users have been updated'});
				var dat = 'The system wide limit has been changed to R' + req.body.value;
				audit('Admin settings change', dat);
				sendEmail(req.body.value);
				//sendMessage(req.body.value);
			});
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
			var dat = 'The canteen name has been changed to ' + req.body.value;
			audit('Branding settings change', dat);
			res.status(200).send({message: 'Canteen name has been successfully changed.'});
		}
	});
};

/*
 * Set Theme  Name
 */
exports.setThemeName = function(req, res) {
    console.log('Theme name2 ' + req.body.value);
    var name = req.body.value;

    //find old value to check what current colour is
   Config.findOne({name: 'Theme name'}, function (err, row) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else
        {    if(row===null)
            {
                row={
                    value:'orange'
                }
            }
            if (name === 'green' )
            { //users.css is orange, currently using red!!!!!!!!!!!!!!!!!!!!!!
                console.log('You want orange, curently users.css contains red ' );
                fse.copy('public/modules/users/css/greenUsers.txt', 'public/modules/users/css/users.css', function (err) {
                    if (err) console.log('ERROR: ' + err);
                    else console.log('Changed:'  );
                });
                //public/modules/orders/css/orders.css
                fse.copy('public/modules/orders/css/greenOrders.txt', 'public/modules/orders/css/orders.css', function (err) {
                    if (err) console.log('ERROR: ' + err);
                    else console.log('Changed:'  );
                });
            }
            else if (name === 'orange' )
            { //users.css is orange, currently using red!!!!!!!!!!!!!!!!!!!!!!
                console.log('You want orange, curently users.css contains red ' );
                fse.copy('public/modules/users/css/orangeUsers.txt', 'public/modules/users/css/users.css', function (err) {
                    if (err) console.log('ERROR: ' + err);
                    else console.log('Changed:'  );
                });
                //public/modules/orders/css/orders.css
                fse.copy('public/modules/orders/css/orangeOrders.txt', 'public/modules/orders/css/orders.css', function (err) {
                    if (err) console.log('ERROR: ' + err);
                    else console.log('Changed:'  );
                });
            }
            else if (name === 'red')
            {
                console.log('You want red, curently its orange ' );
                fse.copy('public/modules/users/css/redUsers.txt', 'public/modules/users/css/users.css', function (err) {
                    if (err) console.log('ERROR: ' + err);else console.log('Changed:'  );
                });
                //public/modules/orders/css/orders.css
                fse.copy('public/modules/orders/css/redOrders.txt', 'public/modules/orders/css/orders.css', function (err) {
                    if (err) console.log('ERROR: ' + err);
                    else console.log('Changed:'  );
                });
            }
            else
            {
                console.log('ERROR' );
            }
            /*else(name === 'default' && row.value==='green')
             {
                 console.log('You want red, curently its orange ' );
                 fs.rename('public/modules/users/css/users.css', 'public/modules/users/css/greenUsers.txt', function (err) {
                     if (err) console.log('ERROR: ' + err);else console.log('Changed:'  );
                 });
                 fs.rename('public/modules/orders/css/orders.css', 'public/modules/orders/css/greenOrders.txt', function (err) {
                     if (err) console.log('ERROR: ' + err);
                     else console.log('Changed:'  );
                 });
             }*/
        }
       Config.update({name: 'Theme name'}, {value: req.body.value}, function(err, numAffected){
           if(err) return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
           });
           else if (numAffected < 1){
               var config = new Config();
               config.name = 'Theme name';
               config.value = req.body.value;

               config.save(function(err){
                   if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
                   return res.status(200).send({message: 'Theme has been successfully changed.'});
               });
           }
           else{
               return res.status(200).send({message: 'Theme has been successfully changed.'});
           }
       });
       //return res.status(200).send({message: name});
    });
};

/*
 * Upload main image for branding
 * Last Edited by {Rendani Dau}
 */
exports.uploadImage = function(req, res){
	var form = new formidable.IncomingForm();
	console.log('About to parse image');
    //console.log(req);
	form.parse(req, function(error, fields, files){
		console.log('image parsed');
		if(error){
			return res.status(400).send({message: errorHandler.getErrorMessage(error)});
		}
		//console.log(files);
		//res.redirect('/');
		var imageName = 'carousel-' + fields.carouselImageNum + '.png';
		fs.rename(files.upload.path, './public/modules/core/img/brand/' + imageName, function(err){
			if(err){
				console.log(errorHandler.getErrorMessage(err));
				fs.unlink('./public/modules/core/img/brand/logo.png');
				fs.rename(files.upload.path, './public/modules/core/img/brand/' + imageName);
			}
			var capName = 'Carousel-caption' + fields.carouselImageNum;
			Config.update({name: capName}, {value: fields.crouselImageCaption}, function(err, numAffected){
				if(err) return res.status(400).send({message: 'Caption not set'});
				if(numAffected < 1){
					var config = new Config();
					config.name = capName;
					config.value = fields.crouselImageCaption;
					config.save(function(err){
						if(err) return res.status(400).send({message: 'Caption not set'});
						res.redirect('/');
					});
				}
				else
					return res.redirect('/');
			});
			var dat = 'The main image has been changed';
			audit('Branding settings change', dat);
		});
	});
};


exports.deleteImage = function(req, res){
	console.log(req.body.image);
	var cap = 'Carousel-caption' + req.body.imageNum;
	var imagePath = 'public/modules/core/img/brand/carousel-' + req.body.imageNum; + '.png';
	var defaultImage = 'public/modules/core/img/brand/default-' + req.body.imageNum + '.png';
	var capChanged = 0;
	
	Config.update({name: cap}, {value: ''}, function(err, numAffected){
		if(err || numAffected < 1) capChanged = 1;
		fse.copy(defaultImage,imagePath, function(err){
			if(err) return res.status(200).send({message: 'Image not deleted.'});
		});
	});
	res.status(200).send({message: 'Image deleted'});
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
};

/**
 * Get the theme
 * Last edited by {Semaka Malapane and Antonia Michael}
 */
exports.getTheme = function(req,res){
    console.log('get css assets!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(req);
    Config.findOne({name: 'Theme name'}, function (err, row) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            return  res.status(200).send({message: row.value});
        }
    });
};
