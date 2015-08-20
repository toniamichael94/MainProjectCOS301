'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	MenuItem = mongoose.model('MenuItem'),
	OrderItem = mongoose.model('Order'),
	InventoryItem = mongoose.model('Inventory'),
	MenuCatagory = mongoose.model('MenuCatagory'),

	_ = require('lodash');

exports.inventoryItems = function(req, res) {
	var menuItem = req.body;
	//console.log('****** in the server ready to check inventory ' + req.body.ingredientName);
	var index = req.body.ingredientName.indexOf('(');
	var inventoryProductName = req.body.ingredientName.slice(0, index);
	inventoryProductName = inventoryProductName.trim();

	InventoryItem.find({productName: inventoryProductName}, function(err, items) {
	items.amount = req.body.ingredientQuantity;

	var items2 = new Array();
	items2[0] = items;
	items2[1] = items.amount;

	if(err || !items) return res.status(400).send({message: 'Inventory Item not found' });
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
	//console.log(items);
	 //var itemMap = {};

	 //items.forEach(function(item) {
	//	 itemMap[item._id] = item;
	// });
	// console.log(itemMap); // testing
	// res.send(itemMap);

	if(err ) {
		console.log('Error = ' + err);
		return res.status(400).send({message: err });}
	else {
		//console.log(items[0].ingredients.ingredients);	
		res.status(200).send({message: items});
	}
 });

};


exports.loadMenuCategories = function(req, res) {
console.log('---------------------------------');
MenuCatagory.find({}, function(err, items) {
	//console.log(items);
	 //var itemMap = {};

	 //items.forEach(function(item) {
	//	 itemMap[item._id] = item;
	// });
	// console.log(itemMap); // testing
	// res.send(itemMap);

	if(err ) {
		console.log('Error = ' + err);
		return res.status(400).send({message: err });}
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

exports.createMenuCategory = function(req, res) {
	//console.log('YOU ARE HERE-------------');

	MenuCatagory.find({name : req.body.catagory}, function(error, model) {

	var v = model;
	//console.log(v);
	if(model.length < 1){ // then no such category exists we can create one
		var catagory = new MenuCatagory({
			name : req.body.catagory
		});


		catagory.save(function(err, catagory) {
			if (err){
				return console.error(err);
			}
				console.dir(catagory);
			});

			return res.status(200).send({message: "sucess" });
		}else {
		return res.status(400).send({message: "The category already exist" }); // menu  catagory already exixts
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
		MenuItem.update({itemName: req.body.itemName}, {itemName: req.body.updateItemName, price:req.body.price, description: req.body.description, category:req.body.category, ingredients: req.body.ingredients},  function(err, numAffected){
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




	/**
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
