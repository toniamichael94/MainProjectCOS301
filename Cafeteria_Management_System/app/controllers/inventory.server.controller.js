'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inventory = mongoose.model('Inventory'),
	_ = require('lodash');


/*
* Loading the inventory items from the database
*/
exports.loadInventoryItems = function(req, res){

	Inventory.find({}, function(err, items) {
		 var itemMap = {};

		 items.forEach(function(item) {
			 itemMap[item._id] = item;
		 });
		if(err || !itemMap) return res.status(400).send({message: 'Menu Items not found' });
		else {
			res.status(200).send({message: itemMap});
		}
	 });

};
/**
 * Create an inventory item
 */
exports.create = function(req, res) {
	console.log('here');
	var inventoryItem = new Inventory(req.body);
	inventoryItem.user = req.user;

	inventoryItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventoryItem);
		}
	});
};

/**
 * Show the current inventory item
 */
exports.read = function(req, res) {
	res.jsonp(req.inventoryItem);
};

/**
 * Update an inventory item
 */
exports.update = function(req, res) {
	var inventoryItem = req.inventoryItem ;

	inventoryItem = _.extend(inventoryItem , req.body);

	inventoryItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventoryItem);
		}
	});
};

/**
 * Delete an inventory Item
 */
exports.delete = function(req, res) {
	var inventoryItem = req.inventoryItem ;

	inventoryItem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventoryItem);
		}
	});
};

/**
 * List of inventoryItems
 */
exports.list = function(req, res) {
	Inventory.find().sort('-created').populate('user', 'displayName').exec(function(err, inventory) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inventory);
		}
	});
};

/**
 * Inventory middleware
 */
exports.orderByID = function(req, res, next, id) {
	Inventory.findById(id).populate('user', 'displayName').exec(function(err, inventoryItem) {
		if (err) return next(err);
		if (! inventoryItem) return next(new Error('Failed to load Order ' + id));
		req.inventoryItem = inventoryItem ;
		next();
	});
};

/**
 * Inventory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.inventoryItem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.searchInventory=function(req,res){
    if (req.body.productName) {
        Inventory.findOne({
            productName: req.body.productName
        }, function (err, inventory) {
            if (!inventory) {
                return res.status(400).send({
                    message: 'Inventory item not found'
                });
            }   else if(inventory){
                return res.status(200).send({
                    message: 'This inventory item has been found'
                });
            }
        });
    }
    else {
        return res.status(400).send({
            message: 'The inventory item field must not be blank'
        });
    }
};

/*
update
*/
exports.updateInventory=function(req,res){
    console.log('updateInventory'+ req.body.prodName);
    if (req.body.prodName) {
        Inventory.findOne({
            productName: req.body.prodName
        }, function (err, inventory) {
            if (!inventory) {
                return res.status(400).send({
                    message: 'Inventory item not found'
                });
            }   else if(inventory){
                return res.status(200).send({
                    message: 'This inventory item has been found'
                });
            }
        });
    }
    else {
        return res.status(400).send({
            message: 'The inventory item field must not be blank'
        });
    }
};

/*
updateInventoryQuantity
*/

	exports.updateInventoryQuantity=function(req,res){
		console.log('updateInventoryQuantity');
		console.log(req.body.productName);
		console.log(req.body.quantity);
		
		if(req.body.productName)
		{
			Inventory.findOne({
				productName:req.body.productName
			}, function (err, inventory){
				if(!inventory) {
					return res.status(400).send({
						message: 'Inventory item '+ productName +'could not be updated.'
					});
				} else if(inventory){
					return res.status(200).send({
						message: 'Inventory updated'						
					});
				}
			});
		}
		
		/*if (req.body.prodName) {
			Inventory.findOne({
				productName: req.body.prodName
			}, function (err, inventory) {
				if (!inventory) {
					return res.status(400).send({
						message: 'Inventory item not found'
					});
				}   else if(inventory){
					return res.status(200).send({
						message: 'This inventory item has been found'
					});
				}
			});
		}
		else {
			return res.status(400).send({
				message: 'The inventory item field must not be blank'
			});
		}*/
	};