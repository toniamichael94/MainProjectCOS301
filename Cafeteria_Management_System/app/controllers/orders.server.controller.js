/*
'use strict';

*/
/**
 * Module dependencies.
 */

'use strict';
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Order = mongoose.model('Order'),
	Notifications = mongoose.model('Notifications'),
	User = mongoose.model('User'),
	Audit = mongoose.model('Audit'),
	_ = require('lodash'),
	configs = require('../../config/config'),
	nodemailer = require('nodemailer');

function audit(_type, data){
	console.log(data);
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

 exports.placeOrder = function(req, res){
	if(req.body.plate.length > 0){
		var order = req.body.plate;
		var total = 0;
		var availBalance = req.user.limit - req.user.currentBalance;
		for(var j = 0; j < order.length; j++)
			total += order[j].price * order[j].quantity;

		if(total > availBalance && req.body.paymentMethod === 'credit')
			return res.status(400).send({message: 'You have insufficient credit to make purchase. Available balance: R' + availBalance});

		Order.find({}, function(err, result){
			var orderNum = 1;
			if(result.length !== 0)
			{
				//Reset the order numbers if it is the next day
				if(result.length > 1)
				{
					var today = new Date();
					var lastOrderDay = result[result.length-1].created;
					console.log("Today:"+today);
					console.log("LOR__:"+lastOrderDay);
					console.log("");
					console.log("Today's date:"+today.getDate());
					console.log("LOrder  Date:"+lastOrderDay.getDate());

					if(today.getDate() > lastOrderDay.getDate())
					{
						orderNum = 1;
						console.log("New start date");
					}
					else orderNum = result[result.length-1].orderNumber + 1;//Previous order number +1
				}
				else orderNum = result[result.length-1].orderNumber + 1;//Previous order number +1
			}

			for(var i = 0; i < order.length; i++)
				order[i].orderNumber = orderNum;
				console.log("order:"+order);
			Order.create(order, function(err){
				if(err) return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
				audit('Create order', order);
				sendCreateMessage(req.user.username, order.orderNumber);
				res.status(200).send({message: 'Order has been made'});
			});
		});
	}
 };

/*
  * Helper function to send user a notification that their order has been placed
  * Last Edited by: Semaka Malapane
  */
 function sendCreateMessage(uname, orderNum){
    User.findOne({username: uname}, function(err, user){
        if(err){
                console.log(err);
                return;
        }		
        var mailOptions = {
                subject: 'Your Order Has Been Placed'
        };
        mailOptions.to = user.username;
        mailOptions.text = 'Dear ' + user.displayName + ',\n\n' +
                                                        'Your order with order number ' + orderNum +  ' has been placed.\n'+
                                                        'You will be notified when your order is ready.\n\n'+
                                                        'The CMS Team';
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
 }
 
/*
  * Helper function to email user about order
  * Last Edited by: Semaka Malapane
  */
 function sendMessage(uname, orderNum){
    User.findOne({username: uname}, function(err, user){
        if(err){
                console.log(err);
                return;
        }		
        var mailOptions = {
                subject: 'Your Order Is Ready'
        };
        mailOptions.to = user.username;
        mailOptions.text = 'Dear ' + user.displayName + ',\n\n' +
                                                        'Your order with order number ' + orderNum +  ' is ready for collection.\n'+
                                                        'You can collect your order at the cafeteria.\n\n'+
                                                        'The CMS Team';
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
 }

 /*
  * Helper function to email user about order
  * Last Edited by: Rendani Dau
  */
 function sendEmail(uname, orderNum){
	User.findOne({username: uname}, function(err, user){
		if(err){
			console.log(err);
			return;
		}
		var smtpTransport = nodemailer.createTransport(configs.mailer.options);

		var mailOptions = {
			from: configs.mailer.from,
			subject: 'Your Order Is Ready'
		};
		mailOptions.to = user.email;
		mailOptions.text = 'Dear ' + user.displayName + ',\n\n' +
								'Your order with order number ' + orderNum +  ' is ready for collection.\n'+
								'You can collect your order at the cafeteria.\n\n'+
								'The CMS Team';
		smtpTransport.sendMail(mailOptions, function(err){
			if(err) console.log('Email not sent' + err);
		});
	});
 }

 exports.markAsReady = function(req, res){
	Order.update({orderNumber: req.body.orderNumber, created: req.body.created, username: req.body.username}, {status: 'ready'}, { multi: true }, function(err, numAffected){
		if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		console.log('Num Affected ' + numAffected);
		sendEmail(req.body.username, req.body.orderNumber);
                /*pusher.trigger('notifications', 'new_notification', {
                    message: "hello world"
                });*/
		sendMessage(req.body.username, req.body.orderNumber);
		//Audit functionality
		var data = 'Order ' + req.body.orderNumber + ' has been marked as ready';
		audit('Cashier action', data);
		//********************
		res.status(200).send({message: 'Order marked as ready'});
	});

 };

exports.markAsPaid = function(req, res){
	console.log(req.body);
	if(req.body.method === 'credit'){
		Order.find({orderNumber: req.body.orderNumber, created: req.body.created, username: req.body.username}, function(err, orders) {
			if(err){ console.log('Error1' + err); return res.status(400).send({message: 'Order not marked as paid'});}
			console.log('helo2');
			var total = 0;
			console.log('length' + orders.length);
			for(var order in orders){
				total+= orders[order].price * orders[order].quantity;
			}
			console.log('total' + total);
			
			User.findOne({username: req.body.username}, function(err, user){
				if(err){
					console.log('Error2' + err);
					return res.status(400).send({message: 'Order not marked as Paid'});
				}

				if(user.limit - user.currentBalance < total)
					return res.status(400).send({message: 'User has insufficient credit'});

				var currBalance = user.currentBalance + total;
				console.log('new currBalance ' + currBalance);
				User.update({username: req.body.username},{$set: {currentBalance: currBalance}},function(err, numAffected){
					console.log('NumAffected: ' + numAffected);
					if(err){ console.log('Error3' + err); return res.status(400).send({message: 'Order not marked as paid'});}
					Order.update({orderNumber: req.body.orderNumber}, {status: 'closed'}, { multi: true }, function(err, numAffected){
						if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
						//console.log(numAffected);
						//Audit functionality
						var data = 'Order ' + req.body.orderNumber + ' has been marked as paid. ' + user.username + ' has been debited R' + total;
						audit('Cashier action', data);
						//********************
						res.status(200).send({message: 'order marked as paid/closed'});
					});
				});
			});
		});
	}
	else{
		Order.update({orderNumber: req.body.orderNumber, created: req.body.created, username: req.body.username}, {status: 'closed'}, { multi: true }, function(err, numAffected){
			if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			console.log(numAffected);
			//Audit functionality
			var data = 'Order ' + req.body.orderNumber + ' has been marked as paid.';
			audit('Cashier action', data);
			//********************
			res.status(200).send({message: 'order marked as paid/closed'});
		});
	}
};

exports.markAsCollected = function(req, res){
    console.log('dgefrgwergtwe'); //console.log(req.body);
	res.status(200).send();
};

 //Get orders with a POST request
 exports.getOrderList = function(req, res){
//	Order.find({$and: [{active: true}, {$or: [{status: 'open'}, {status:'ready'}]}]}, function(err, items){
    Order.find({$or: [{status: 'open'}, {status:'ready'}]}, function(err, items){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        res.status(200).send({message: items});
    });
 };

/*
* Last edited by {Semaka Malapane}
*/
 //Get orders with a POST request
 exports.getUserNotifications = function(req, res){
    console.log('current user ' + req.user.username);
    Notifications.find( {username: req.user.username}, function(err, notifications){
        if(err) return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
        });
        Notifications.update({username: req.user.username}, {status: 'read'}, { multi: true }, function(err, numAffected){
            if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
            console.log('mark as read ' + numAffected);
            //res.status(200).send({message: 'order marked as paid/closed'});
        });
        res.status(200).send({message: notifications});
    });
 };

/*
* Last edited by {Semaka Malapane}
*/
 exports.getNrNotifications = function(req, res){
	console.log('current user ' + req.user.username);
	Notifications.count({$and: [{username: req.user.username}, {status: 'unread'}]}, function(err, num){
		if(err){
                    console.log('errrrroorrrr ');
                    return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
                    });
                }
                console.log('num' + num);
                
		res.status(200).send({message: num});
	});
 };
 
/*
    Last edited by {Rendani Dau}
 */
exports.getUserOrders = function(req, res){
    if (req.user.username !== '') {
        Order.find({username: req.user.username, created: {$gt: req.body.startDate, $lt: req.body.endDate}}, function (err, items) {
            if(err){ 
			console.log(err);
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			}
			res.status(200).send({message: items});
        });
    }
    else {
        return res.status(400).send({
            message: 'No user signed in'
        });
    }
};

 //Get orders with a GET request
 exports.getOrders = function(req, res){
	Order.find({status: 'open'}, function(err, items){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});

		res.status(200).send({message: items});
	});
 };

/**
 * Create a Order
 *

exports.create = function(req, res) {
	/*var order = new Order(req.body);
	order.user = req.user;

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Show the current Order
 *

exports.read = function(req, res) {
	res.jsonp(req.order);
};

/**
 * Update a Order
 *

exports.update = function(req, res) {
	/*var order = req.order ;

	order = _.extend(order , req.body);

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};


/**
 * Delete an Order
 *
exports.delete = function(req, res) {
	/*var order = req.order ;

	order.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};


/**
 * List of Orders
 *

exports.list = function(req, res) {
	/*Order.find().sort('-created').populate('user', 'displayName').exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};


/**
 * Order middleware
 *

exports.orderByID = function(req, res, next, id) {
	/*Order.findById(id).populate('user', 'displayName').exec(function(err, order) {
		if (err) return next(err);
		if (! order) return next(new Error('Failed to load Order ' + id));
		req.order = order ;
		next();
	});
};


/**
 * Order authorization middleware
 *

exports.hasAuthorization = function(req, res, next) {
	if (req.order.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
*/
