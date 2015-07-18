'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	MenuItem = mongoose.model('MenuItem'),
	OrderItem = mongoose.model('Order'),
	InventoryItem = mongoose.model('Inventory'),

	_ = require('lodash');

exports.inventoryItems = function(req, res) {
	var menuItem = req.body;
	//console.log('****** in the server ready to check inventory ' + req.body.ingredientName);
	InventoryItem.find({productName: req.body.ingredientName}, function(err, items) {

	//	console.log('************** ' + items);
		items.amount = req.body.ingredientQuantity;
	//	var temp = Object;
	//	temp.items = items;
		//temp.amount = req.body.ingredientQuantity;
		var items2 = new Array();
		items2[0] = items;
		//console.log('quantiy = ' + items2[0]);
		items2[1] = items.amount;
	//	console.log(items);
	if(err || !items) return res.status(400).send({message: 'Menu Items not found' });
	else {
			res.status(200).send({message: items2});
		}
	});
};



/**
* Display menu items - function getting menu items from database
*/
exports.loadMenuItems = function(req, res) {

MenuItem.find({}, function(err, items) {
	console.log(items);
	 var itemMap = {};

	 items.forEach(function(item) {
		 itemMap[item._id] = item;
	 });
	// console.log(itemMap); // testing
	// res.send(itemMap);
	if(err || !itemMap) return res.status(400).send({message: 'Menu Items not found' });
	else {
		res.status(200).send({message: items});
	}
 });

};



/**
 * Create a Menu item
 */
exports.createMenuItem = function(req, res) {
	var menuitem = new MenuItem(req.body);
	menuitem.user = req.user;

	menuitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};

/**
 * Show the current menuitem
 */
exports.read = function(req, res) {
	res.jsonp(req.menuitem);
};


/* Update menu item*/
exports.updateMenuItem = function(req,res){
	console.log('updateMenuItem here!!!');
		console.log(req.body.itemName);
		console.log(req.body.category);
		
		MenuItem.update({itemName: req.body.itemName}, {itemName: req.body.updateItemName, prie:req.body.price, description: req.body.description, category:req.body.category, ingredients: req.body.ingredients},  function(err, numAffected){
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

/**
 * Update a menuitem
 */
exports.update = function(req, res) {
	var menuitem = req.menuitem;

	menuitem = _.extend(menuitem , req.body);

	menuitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};


	
	
	/*
	Delete a menu item
	*/
	exports.deleteMenuItem=function(req,res)
	{
		console.log('Delete:'+req.body.itemName);
		MenuItem.remove({itemName: req.body.itemName}, function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error deleting the menu item.'});
        }
        else{
            res.status(200).send({message: 'Menu item successfully deleted.'});
        }
    });
	};

/**
 * Delete an menuitem
 */
exports.delete = function(req, res) {
	var menuitem = req.menuitem ;

	menuitem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};

/**
 * Create a Menu item
 */
exports.createMenuItem = function(req, res) {
	var menuitem = new MenuItem(req.body);
	menuitem.user = req.user;

	menuitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};

/**
 * List of Menu items
 */
exports.list = function(req, res) {
	MenuItem.find().sort('-created').populate('user', 'displayName').exec(function(err, menuitems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitems);
		}
	});
};

/**
 * Menuitem middleware
 */
exports.orderByID = function(req, res, next, id) {
	MenuItem.findById(id).populate('user', 'displayName').exec(function(err, menuitem) {
		if (err) return next(err);
		if (! menuitem) return next(new Error('Failed to load menuitem ' + id));
		req.menuitem = menuitem ;
		next();
	});
};

/**
 * MenuItem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.menuitem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
/*
 * search menu item
 */

exports.searchMenu=function(req,res){
    console.log('searchMenu'+ req.body.itemName );
    if (req.body.itemName) {
        MenuItem.findOne({
            itemName: req.body.itemName
        }, function (err,menuitem ) {			
            if (!menuitem) {
               // console.log('notttt searchMenu'+ req.body.itemName);
                return res.status(400).send({
                    message: 'Menu item not found'
                });
            }   else if(menuitem){
				console.log('menuitemSEARCHED JUST NOW:'+menuitem);
               // console.log('yesssss searchMenu'+ req.body.itemName);
                return res.status(200).send({
					 message: 'This menu item has been found',
					 menuItem: menuitem
                });
            }
        });
    }
    /*else {
        return res.status(400).send({
            message: 'The menu item field must not be blank'
        });
    }*/
};
