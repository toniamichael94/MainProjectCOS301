'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inventory = mongoose.model('Inventory'),
	MenuItem = mongoose.model('MenuItem'),
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

/*Search the inventory*/

exports.searchInventory=function(req,res){
    console.log('searchInventory'+ req.body.productName);
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
                    message: 'This inventory item has been found',
					foundInventoryItem: inventory
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
Decrease the inventory
*/
exports.decreaseInventory = function(req,res)
{
	 Inventory.update({productName: req.body.productName}, {$inc: { quantity: req.body.quantity }}, function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error updating the product!'});
        }
        else{
            res.status(200).send({message: 'Product information successfully updated.'});
        }
    });
};

 /* Update inventory
 * Last Edited by {Semaka Malapane and Tonia Michael}
 */
exports.updateInventory = function(req, res) {

    Inventory.update({productName: req.body.oldProdName}, {productName: req.body.newProdName, quantity: req.body.quantity, unit: req.body.unit}, function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error updating the product!'});
        }
        else{
            res.status(200).send({message: 'Product information successfully updated.'});
        }
    });
};

/*
updateInventoryQuantity
*/
	exports.updateInventoryQuantity=function(req,res){
		console.log('Product:'+req.body.productName);
		console.log('Quantity:'+req.body.quantity);

		Inventory.update({productName: req.body.productName}, {quantity: req.body.quantity}, function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error updating the item.'});
        }
        else{
            res.status(200).send({message: 'Item successfully updated.'});
        }
    });
	};

	/*
	Delete an inventory item
	*/
	exports.deleteInventoryItem = function(req, res) {

	MenuItem.find({}, function(err, items) {
	if(err ) {
		console.log('Error = ' + err);
		return res.status(400).send({message: err });}
	else {
		console.log('Delete:'+req.body.productName);
		var found = 0; //false
		for(var j = 0; j != items.length && found === 0; j++)
		{
			for(var i = 0; i != items[j].ingredients.ingredients.length && found === 0; i++)
			{
				var ingredientName = items[j].ingredients.ingredients[i];
				ingredientName = ingredientName.substring(0,ingredientName.indexOf("(")-1);
				if(req.body.productName === ingredientName)
					found = 1;
			}
		}
		if(found === 0)
		{
			Inventory.remove({productName: req.body.productName}, function(err, numAffected){
			if(err) return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			else if (numAffected < 1){
				res.status(400).send({message: 'Error deleting the item ' + req.body.productName});
			}
			else{

				res.status(200).send({message: req.body.productName + ' successfully deleted.'});
				}
			});

		}//end delete
		if(found === 1)
		{
			res.status(400).send({message: 'Error deleting the item ' + req.body.productName+'. The item is used in a menu item.'});
		}

	}//end else
 });

};
	/*
	Delete an inventory item
	*/
	/*exports.deleteInventoryItem=function(req,res)
	{
		Inventory.remove({productName: req.body.productName}, function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error deleting the item ' + req.body.productName});
        }
        else{

            res.status(200).send({message: req.body.productName + ' successfully deleted.'});
        }
    });
	};*/
