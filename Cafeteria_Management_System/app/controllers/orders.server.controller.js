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
	_ = require('lodash');

/********************************************
 *Added by {Rendani Dau}
 */
 
 exports.placeOrder = function(req, res){
	//console.log(req);
	if(req.body.length > 0){
		var order = req.body;
		var total = 0;
		var availBalance = req.user.limit - req.user.currentBalance;
		for(var j = 0; j < order.length; j++)
			total += order[j].price * order[j].quantity;
		
		if(total > availBalance)
			return res.status(400).send({message: 'You have insufficient credit to make purchase. Available balance: R' + availBalance});
		
		Order.find({}, function(err, result){
			var orderNum = 1;
			if(result.length !== 0){
				orderNum = result[result.length-1].orderNumber + 1;
			}
			
			for(var i = 0; i < order.length; i++)
				order[i].orderNumber = orderNum;
			
			Order.create(order, function(err){
				if(err) return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
					User.update({username: req.user.username}, {$inc: { currentBalance : total}}, function(err, numAffected){
						if(err){
							//Temporary - Measures to take will be discussed
							console.log(errorHandler.getErrorMessage(err));
						}
						if(numAffected < 0){
							//Temporary - MEasures to take will be discussed
							console.log('No user charged');
						}
						
						res.status(200).send({message: 'Order has been made'});

					});
				});
		});	
	}
 };
 
 exports.markAsReady = function(req, res){
	//console.log(req.body);
	
	res.status(200).send({message: 'order marked as ready'});
 };
 
 //Get orders with a POST request
 exports.getOrderList = function(req, res){
	Order.find({status: 'open'}, function(err, items){
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
            console.log('items: ' + items);
            console.log('err: ' + err);
            if (items === '') {
                return res.status(400).send({
                    message: 'That user has no orders placed.'
                });
            }
            else{
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
