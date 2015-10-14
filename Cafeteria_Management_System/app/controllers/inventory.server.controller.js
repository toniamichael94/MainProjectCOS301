'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inventory = mongoose.model('Inventory'),
	MenuItem = mongoose.model('MenuItem'),
	Order = mongoose.model('Order'),
	_ = require('lodash'),
	Audit = mongoose.model('Audit');

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
			var data = JSON.stringify(inventoryItem) + 'has been added';
			audit('Inventory update', data);
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
			var data = req.body.productName + ' decreased by ' + req.body.quantity;
			audit('Inventory update', data);
        }
    });
};

	/*
	Reporting
	*/

	exports.monthlyReport = function(req,res){
		console.log('monthlyReport');
		//Calcualte the start and end date
		var endDate = new Date();
		var startDate = new Date(new Date().setDate(new Date().getDate()-30));
		startDate = new Date(startDate);

		//Find all the orders for the specified month
		Order.find({created: {$gte: startDate, $lte: endDate}}, function(err, orders){
			if(err) return res.status(400).send({message: 'Could not generate report!'});

			

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
			var data = req.body.oldProdName + 'updated. New values: ' + req.body.newProdName + ' ' + req.body.quantity + ' ' + req.body.unit;
			audit('Inventory update', data);
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
			var data = req.body.productName + ' Quantity updated to ' + req.body.quantity;
			audit('Inventory update', data);
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
				var data = req.body.productName + ' has been deleted';
				audit('Inventory update', data);
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
