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
	User = mongoose.model('User'),
	_ = require('lodash'),
	configs = require('../../config/config'),
	nodemailer = require('nodemailer');

/********************************************
 *Added by {Rendani Dau}
 */
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
			
			Order.create(order, function(err){
				if(err) return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
					res.status(200).send({message: 'Order has been made'});
				
					//Code to update balance when order has been placed
					/*User.update({username: req.user.username}, {$inc: { currentBalance : total}}, function(err, numAffected){
						if(err){
							//Temporary - Measures to take will be discussed
							console.log(errorHandler.getErrorMessage(err));
						}
						if(numAffected < 0){
							//Temporary - MEasures to take will be discussed
							console.log('No user charged');
						}
						
						res.status(200).send({message: 'Order has been made'});

					});*/
				});
		});	
	}
 };
 
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
 };
 
 exports.markAsReady = function(req, res){
	Order.update({orderNumber: req.body.orderNum}, {status: 'ready'}, { multi: true }, function(err, numAffected){
		if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		console.log(numAffected);
		sendEmail(req.body.uname, req.body.orderNum);
		res.status(200).send({message: 'order marked as ready'});
	});

 };
 
//,itemName:req.body.itemName

exports.markAsPaid = function(req, res){
	console.log(req.body);
	if(req.body.method === 'credit'){
		console.log('hello');
		Order.find({orderNumber: req.body.orderNum}, function(err, orders) {
			if(err){ console.log('Error1' + err); return;}
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
					return;
				}
				
				if(user.limit - user.currentBalance < total)
					return res.status(400).send({message: 'User has insufficient credit'});
				
				user.currentBalance = user.currentBalance + total;
				user.save(function(err, user){
				if(err){ console.log('Error3' + err); return;}
						Order.update({orderNumber: req.body.orderNum}, {status: 'closed'}, { multi: true }, function(err, numAffected){
							if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
								console.log(numAffected);
							res.status(200).send({message: 'order marked as paid/closed'});
						});
				});
			});	
		});
	}
	else{
		Order.update({orderNumber: req.body.orderNum}, {status: 'closed'}, { multi: true }, function(err, numAffected){
			if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
			console.log(numAffected);
			res.status(200).send({message: 'order marked as paid/closed'});
		});
	}
	/*
    console.log('dgefrgwergtwe'); //console.log(req.body);
    Order.find({orderNumber: req.body.orderNumber },function(err, numAffected2) {
        console.log(numAffected2);
        console.log(numAffected2.length);
        for(var item in numAffected2){
            console.log(numAffected2[item].orderNumber);
            Order.update({orderNumber: numAffected2[item].orderNumber, itemName: numAffected2[item].itemName }, {status: 'closed'},  function(err2, numAffected) {
                console.log('hhhh');
            });
        }

    });

*/
};

exports.markAsCollected = function(req, res){
    console.log('dgefrgwergtwe'); //console.log(req.body);
	res.status(200).send();
  /* Order.find({orderNumber: req.body.orderNumber },function(err, numAffected2) {
        console.log(numAffected2);
        console.log(numAffected2.length);
        for(var item in numAffected2){
            console.log(numAffected2[item].orderNumber);
            Order.update({orderNumber: numAffected2[item].orderNumber, itemName: numAffected2[item].itemName }, {status: 'closed'},  function(err2, numAffected) {
                console.log('hhhh');
            });
        }

    });
*/

};

 //Get orders with a POST request
 exports.getOrderList = function(req, res){
	Order.find({$or: [{status: 'open'}, {status:'ready'}]}, function(err, items){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		
		res.status(200).send({message: items});
	});
 };

/*
    Last edited by {Semaka Malapane}
 */
exports.getUserOrders = function(req, res){
    console.log('server req' + req);
    console.log('username' + req.body.username);
    if (req.body.username) {
        Order.find({
            username: req.body.username
        }, function (err, items) {
            console.log('err: ' + err);
            if (items === '') {
                return res.status(400).send({
                    message: 'That user has no orders placed.'
                });
            }
            else{ console.log('items: ' + items);
                console.log('server res' + res);
                res.status(200).send({message: items});
            }
        });
    }
    else {
        return res.status(400).send({
            message: 'Username field must not be blank'
        });
    }
    /*Order.find({status: 'open'}, function(err, items){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    });*/
};

 //Get orders with a GET request
 exports.getOrders = function(req, res){
	//res.status(400).send({message: 'hello'});
	console.log('heeeeelloooooooooooooooooooooo');
	Order.find({status: 'open'}, function(err, items){
		if(err) return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		
		res.status(200).send({message: items});
	});
 };
/**
 *END {Rendani Dau}
 */ 
 
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
