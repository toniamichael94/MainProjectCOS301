'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	MenuItem = mongoose.model('MenuItem'),
	OrderItem = mongoose.model('Order'),
	InventoryItem = mongoose.model('Inventory'),
	MenuCategory = mongoose.model('MenuCatagory'),
	Order = mongoose.model('Order'),
	path = require('path'),
	formidable = require('formidable'),
	fs = require('fs'),
	jsreport = require('jsreport'),
	Audit = mongoose.model('Audit'),
	_ = require('lodash');

function audit(type, data){
	var _audit = {
		event: type,
		details: JSON.stringify(data)
	};
	Audit.create(_audit, function(err){
		if(err){ 
			console.log('Audit not created for ' + _type);
			console.log(errorHandler.getErrorMessage(err));
		}
	});
}
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
console.log('---------------------------------HERE');
MenuCategory.find({active: 'true'}, function(err, items) {

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
	MenuCategory.find({name : req.body.category}, function(error, model) {

	var v = model;
	//console.log(v);
	if(model.length < 1){ // then no such category exists we can create one
		var category = new MenuCategory({
			name : req.body.category
		});


		category.save(function(err, category) {
			if (err){
				return console.error(err);
			}
				console.dir(category);
			});
			//Audit functionality
			var data = req.body.category + ' has been added to menu categories';
			audit('Menu update', data);
			//*********************
			return res.status(200).send({message: "sucess" });
		}else {
		return res.status(400).send({message: "The category already exists" });
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
		MenuItem.update({itemName: req.body.itemName}, {itemName: req.body.updateItemName, price:req.body.price, description: req.body.description, category:req.body.category, ingredients: req.body.ingredients/*, imagePath: req.body.iPath*/},
			function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error updating the menu item!'});
        }
        else{
			if(req.body.itemName.length > 1)
				var item = req.body.itemName.charAt(0).toUpperCase() + req.body.itemName.slice(1);
            //Audit ffunctionality
			var data = req.body.itemName + ' has been updated to: ' + JSON.stringify({
					name: req.body.updateItemName,
					price: req.body.price,
					description: req.body.description,
					category: req.body.category,
					ingredients: req.body.ingredients
				});
			audit('Menu update', data);
			//***********************
			res.status(200).send({message: 'Menu item successfully updated.'});

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
		MenuItem.remove({itemName: req.body.itemName}, function(err, numAffected){
        if(err) return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
        else if (numAffected < 1){
            res.status(400).send({message: 'Error deleting the menu item.'});
        }
        else{
			if(req.body.itemName.length > 1)
				var item = req.body.itemName.charAt(0).toUpperCase() + req.body.itemName.slice(1);
			//Audit functionality
			var data = req.body.itemName + ' has been deleted from Menu';
			audit('Menu update', data);
            //********************
			res.status(200).send({message: item + ' successfully deleted.'});
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
 * Search menu category
 */

 exports.searchMenuCategory = function(req, res){
	 if (req.body.categoryName) {
			 MenuCategory.findOne({
					 name: req.body.categoryName
			 }, function (err, category) {
					 if (!category) {
							 return res.status(400).send({
									 message: 'Category not found.'
							 });
					 }   else if(category){
							 return res.status(200).send({
									 message: 'Found category',
				foundcategory: category
							 });
					 }
			 });
	 }
	 else {
			 return res.status(400).send({
					 message: 'The category name field must not be blank.'
			 });
	 }
 };

 exports.updateMenuCategory = function(req, res){
	 MenuCategory.update({name: req.body.oldCategoryName}, {name: req.body.newCategoryName, active: req.body.active},
		function(err, numAffected){
			if(err) return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
			});
			else if (numAffected < 1){
					res.status(400).send({message: 'Error updating category.'});
			}
			else{
						//if(req.body.newCategoryName.length > 1)
							//var item = req.body.newCategoryName.charAt(0).toUpperCase() + req.body.newCategoryName.slice(1);
					//Audit functionality
					var data = req.body.oldCategoryName + ' has been updated to ' + req.body.newCategoryName + '. active: ' + req.body.active;
					audit('Menu update', data);
					//*******************
					res.status(200).send({message: 'Successfully updated.'});
					var categoryNames = {oldCategoryName: req.body.oldCategoryName, newCategoryName: req.body.newCategoryName};
			}
	});
 };

/*Update the category name for all the menu items*/
 exports.updateCategoryMenuItems = function (req, res){
	 MenuItem.update({category: req.body.oldCategoryName}, {category: req.body.newCategoryName}, {multi:true},
		 function(err, numAffected){
			 if(err) return res.status(400).send({
					 message: errorHandler.getErrorMessage(err)
			 });
			 else if (numAffected < 1 && (req.body.oldCategoryName !== req.body.newCategoryName)){
					 res.status(400).send({message: 'Menu items were not affected.'});
			 }
			 else{
					//Audit functionality
					var data = numAffected + ' menu items\' categories have been updated to ' + req.body.newCategoryName;
					audit('Menu update', data);
					//*******************
					res.status(200).send({message: 'Sucessfully updated the category.'});
			 }
	 });
 };

/*Delete a menu category*/
exports.deleteMenuCategory = function (req,res){
	MenuCategory.remove({name: req.body.categoryName}, function(err, numAffected){
	if(err) return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	});
	else if (numAffected < 1){
		/*Display name with a capital letter*/
		if(req.body.categoryName.length > 1)
		{
			var cat = req.body.categoryName.charAt(0).toUpperCase() + req.body.categoryName.slice(1);
			res.status(400).send({message: cat + ' was successfully delted. No menu items were deleted.'});
		}
		else	res.status(400).send({message: req.body.categoryName + ' was successfully delted. No menu items were deleted.'});
	}
	else{
				MenuItem.remove({category: req.body.categoryName}, function(err, numAffected){
				if(err) return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
				else if (numAffected < 1){
					res.status(200).send({message: 'Category ' + req.body.categoryName + ' successfully deleted. No menu items were affected.'});
				}

				else{
					//Audit functionality
					var data = req.body.categoryName + ' has been removed';
					audit('Menu update', data);
					//********************
					res.status(200).send({message: 'Successfully deleted category.'});
			}
		});


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
			var data = JSON.stringify(menuitem) + ' has been added';
			audit('Menu update', data);
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

/***
 * Upload image
 */

exports.uploadImage = function(req, res){
	var form = new formidable.IncomingForm();
	console.log('About to parse image');
	console.log(req);
	form.parse(req, function(error, fields, files){
		var newPath = './public/modules/core/img/' + files.upload.name;
		console.log('image parsed');
		if(error){
			return res.status(400).send({message: errorHandler.getErrorMessage(error)});
		}
		fs.rename(files.upload.path, newPath , function(err){
			if(err){
				console.log(errorHandler.getErrorMessage(err));
				fs.unlink(newPath);
				fs.rename(files.upload.path, newPath);
				//return res.status(400).send({message: 'Error with the image path!'});
			}
			MenuItem.update({itemName: req.body.itemName}, {imagePath: newPath},  function(erro, numAffected){
        		if(erro) return res.status(400).send({
            			message: errorHandler.getErrorMessage(erro)
        		});
        		else if (numAffected < 1){
            			return res.status(400).send({message: 'Image not uploaded! Error!'});
        		}
    });
			res.redirect('/');
		});
	});
};

/*
Reporting for menu items
*/

exports.generateSoldReport = function(req,res){
		Order.find({created: {$gt: req.body.start, $lt: req.body.end}}, function(err, orders){
			console.log("Before splice:"+orders.length);
			if(orders.length > 0)
			{
					var found = false;
					var counter =0;
				
					for(order in orders)
					{
							found = false;
							for(var j = 0; j != req.body.items.length; j++)
							{
								if(order.itemName === req.body.items[j])
								{
									found = true;
									break;
								}
							}

							if(!found)
								orders.splice(counter,1);
							counter++;
						}

					console.log("After splice:"+orders.length);
					//Display orders as a report
				}
				else{
					//output on report that no orders for this time
				}



	});
};

exports.generatePopularReport = function(req,res)
{
	Order.find({created: {$gt: req.body.start, $lt: req.body.end}}, function(err, orders){
		if(err) return res.status(400).send({message: 'Could not generate report!'});

		var items = new Array();
		var itemNames = new Array();
		var itemQuantity = new Array();

		for(var i = 0; i < orders.length; i++)
		{
			items[orders[i].itemName] = 0;
		}

		//Store the item name and quantity in a parallel array
		for(var i = 0; i < orders.length; i++)
		{
			items[orders[i].itemName] = items[orders[i].itemName] + orders[i].quantity;
		}

		var j = 0;
		for (var key in items)
		{
			itemNames[j] = key;
			itemQuantity[j] = items[key];
			j++;
		}

		var max = itemQuantity[0];
		for(var i = 0; i < itemNames.length-1; i++)
		{
			for(var j = i+1; j < itemNames.length; j++)
			{
				if(itemQuantity[j] > itemQuantity[i])
				{
					var numTemp = itemQuantity[i];
					var nameTemp = itemNames[i];

					itemQuantity[i] = itemQuantity[j];
					itemNames[i] = itemNames[j];

					itemQuantity[j] = numTemp;
					itemNames[j] = nameTemp;
				}
			}
		}


		if(itemNames.length > req.body.numItems)
		{
			if(itemQuantity[req.body.numItems-1]==itemQuantity[req.body.numItems])
			{
				console.log('here');
				console.log(itemNames[req.body.numItems]);

				var i = req.body.numItems+1;
				while(i < itemQuantity.length && itemQuantity[i-1] == itemQuantity[i])
					i++;
				itemNames.splice(i, itemNames.length-i);
				itemQuantity.splice(i, itemQuantity.length-i);
			}
			else
			 {
				 itemNames.splice(req.body.numItems, itemNames.length-req.body.numItems);
				 itemQuantity.splice(req.body.numItems, itemQuantity.length-req.body.numItems);
			}
		}

		console.log('Arrays after splice');
		console.log(itemNames);
		console.log(itemQuantity);

		var itemData = new Array();

		for(var i = 0; i != itemNames.length; i++)
		{
			itemData.push({id: itemNames[i], data: itemQuantity[i]});
		}

		var sample = fs.readFileSync(path.resolve(__dirname, '../reportTemplates/popular_Items_Template.html'), 'utf8');
		jsreport.render({
			template:{ content: sample,
			//	helpers: 'function mult(a,b){ return a*b; }',//'function total(order){return 10;}'],
				engine: 'handlebars'},
			data: {
				title: 'Popular items',
				items:itemData

			}
		}).then(function(out) {
			//if(err) return res.status(400).send({message: 'Could not render report!'})
			console.log('in render function');
			out.stream.pipe(res);
		});
	});
};
/*
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
};*/
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
