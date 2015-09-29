'use strict';

// MenuItem controller
var menuItemsModule = angular.module('menuItems').controller('MenuItemsController', ['$scope', '$rootScope','$http', '$stateParams', '$location', '$cookies', 'Authentication', 'MenuItems',
	function($scope, $rootScope, $http, $stateParams, $location, $cookies, Authentication, MenuItems) {
		$scope.authentication = Authentication;
		$scope.alertUser = false; // used for user alerts - help page...
		$scope.viewImage = true;
		$scope.menuItems = [];
		$scope.selectedCategory = [];
		$scope.selectedCategory = JSON.stringify('all');
		$scope.navClicked = false;
		$scope.menuNameSearch = "";

//filter the catagories
//filter the categories
		$scope.filterCat = function(catName){
					$cookies.selectedCategory = JSON.stringify(catName);
					$scope.selectedCategory = JSON.parse($cookies.selectedCategory);

						if(!$scope.selectedCategory){
						//	$location.path('/menu');
						}else if($scope.selectedCategory.localeCompare('all') === 0){
								$http.get('/loadMenuItems').success(function(response){
								var displayItems = response.message;

								for(var item in displayItems){
									if(displayItems[item].itemName.length >1)
										displayItems[item].itemName = displayItems[item].itemName.charAt(0).toUpperCase() + displayItems[item].itemName.slice(1);
								}

								$scope.menuItems = response.message;
								var inStock = true;

								for(var itemName in response.message){
									$scope.menuItems[itemName].stock = true;
									// now check if the inventory items are indeed available
									if(response.message[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
												$scope.menuItems[itemName].stock = false;
									}else{ // check the inventory if all items are available
												$scope.menuItems[itemName].stock= $scope.checkStock(response.message[itemName]);
									}
								}
							}).error(function(response) {
								$scope.menuItems = 'Error loading menu Items';
							});

							if($location.url().localeCompare('/menu-item') === 0){
								$location.path('/menu');
							}

						}else{
							$http.get('/loadMenuItems').success(function(response) {
							var count = 0;
							var newArray = [];
							for(var cat in response.message){
									if(response.message[cat].category[0].localeCompare($scope.selectedCategory) === 0) {
										newArray[count] = response.message[cat];
										count = count+1;
									}
							}
							$scope.menuItems = newArray;

							if($location.url().localeCompare('/menu-item') === 0){
								// then you are already in this directory...
							}else{
								if($scope.navClicked === false)
									$location.path('/menu-item'); // else change directories....
						}
							var inStock = true;

							for(var itemName in newArray){
								$scope.menuItems[itemName].stock = true;
								// now check if the inventory items are indeed available
								if(newArray[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
											$scope.menuItems[itemName].stock = false;
								}else{ // check the inventory if all items are available
											$scope.menuItems[itemName].stock= $scope.checkStock(newArray[itemName]);
								}
							}
						}).error(function(response) {
							$scope.menuCatagory = 'Error loading menu Categories';
						});
					}

				};

	if($cookies.selectedCategory){
		$scope.selectedCategory = JSON.parse($cookies.selectedCategory);
		$scope.filterCat($scope.selectedCategory);
	}

	if($cookies.navClicked){
		$scope.navClicked = JSON.parse($cookies.navClicked);
	};

$scope.NavClicked = function(){
	$cookies.navClicked = JSON.stringify(true);
	$scope.navClicked = JSON.parse($cookies.navClicked);
};


//Help alert function when user wants help variable set to true
$scope.helpAlert = function(){
			$scope.alertUser = true;
};

$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
};

	/*Alert Messages for help page*/
	$scope.alert1 = {type: 'warning', msg: 'Page help: To order a menu item click the add to plate botton and then click the on my plate button to confirm your order. To navigate between menu categories - use the navigation bar and click on the appropriate button (Menu contains all the menu catagories)'};
	$scope.alert2 = {type: 'warning', msg: 'Page help: This page contains all the settings to add menu items and menu catagories to the menu page.'};
	$scope.alert3 = {type: 'warning', msg: 'Page help: Type in a menu catagory to add to your menu. (a menu catagory will appear in the menu navigation bar on the menu page and menu items can be placed under a menu catagory)' };
	$scope.alert4 = {type: 'warning', msg: 'Page help: This section will add a menu item to the menu page. NOTE - you need to have ingredients (wich is stored as inventory) - this can be added by clicking on your name in the navigation bar and choosing the manage inventory setting which will take you to a page to add inventory' };
	$scope.alert5 =	{type: 'warning', msg: 'Page help: To search for a menu item, simply type in the name and click search' };
	$scope.alert6 = {type: 'warning', msg: 'Page help: Manage inventory page will allow you to add inventory, remove and update inventory' };
	$scope.alert7 = {type: 'warning', msg: 'Page help: Add the name of the ingredient you want to add, together with the amount of the ingredient you are adding and the unit the ingredient is messured in the respective boxes below' };
	$scope.alert8 = {type: 'warning', msg: 'Page help: To search for an inventory item, type in the name of the item and the option to edit will appear' };
	$scope.alert9 =	{type: 'warning', msg: 'Page help: First click on display inventory and then edit the inventory as needed.' };
	$scope.alert10 = {type: 'warning', msg: 'Page help: This page shows the orders you clicked, to remove a order click remove to increase the quantity of your order use the arrows in the textbox, to add more items to your order, go to the menu page and click add toplate on the appropriate button associated with the menu item you want.Preferences can be gives for example no tamato or extra sause.' };
	$scope.alert11 = {type: 'warning', msg: 'Page help: To edit your profile click on your name in the top navigation bar and then click on edit profile which will direct you to a page to edit your profile settings'};
	$scope.alert12 = {type: 'warning', msg: 'Page help: To edit your profile simply edit the text boxes and or check boxes end then click save profile'};
	$scope.alert13 = {type: 'warning', msg: 'Page help: This page is only accesable by the Super User and Admin User, here you can set user roles, change an employee id, remove an employee and set the system wide spending limit.'};
	$scope.alert14 = {type: 'warning', msg: 'Page help: You can only assign a role to an existing user, thus the user must have already registered. If a user is regestered you can change the role of the user, by tying the user name in the respective textbox and select the appropriate role and click set role - a success mesage will indicate a sucessfull role set.'};
	$scope.alert15 = {type: 'warning', msg: 'Page help: An employee id can be changed by typing in the current employee id and then typing the new employee id in the respective text boxes and then click on change employee id button.'};
	$scope.alert16 = {type: 'warning', msg: 'Page help: To remove an employee type the employee id in the respective textbox and click on the remove employee button .'};
	$scope.alert17 = {type: 'warning', msg: 'Page help: To set the system wide limit enter the new limit in the respective textbox and click on the set system wide limit button .'};
	$scope.alert18 = {type: 'warning', msg: 'Page help: This page contains the braniding settings needed to brand the canteen, it includes: setting the canteen name and setting the canteen logo image for the home page.'};
	$scope.alert19 = {type: 'warning', msg: 'Page help: To set the canteen name type the desired nam in the respective text box and then click on the set canteen name button, the page will refresh and the new canteen name will be visible in the browser tab, the home navigation bar and the home page .'};
	$scope.alert20 = {type: 'warning', msg: 'Page help: To upload an image for branding, click on the browse button and then select the desired image and then click on open, thereafter click on the upload image button - the image will now be visable on the canteen home page .'};
	$scope.alert21 = {type: 'warning', msg: 'Page help: Tis is the login page - you need to be registered to log in, if you are not registered navigate to the sighnup button on the navigation bar on the right and click on it and follow the regestration instructions. If you have forgotten your password click on forgot password link and an e-mail with your password will be send to you.'};
	$scope.alert22 = {type: 'warning', msg: 'Page help: Tis This is the sign up page, if you are not yet registered then you need to fill in your details below and then click the sighn up button. If youare registered navigate to the sighn in button that can be found on the navigation bar and log into your account'};
	$scope.alert23 = {type: 'warning', msg: 'Page help: This page will help you reset your password, type in your username and an e-mail will be sent to the e-mail account that is associated with your username'};
	$scope.alert24 = {type: 'warning', msg: 'Page help: '};
	$scope.alert25 = {type: 'warning', msg: 'Page help: WELCOME! these buttons will help you navigate through this website, whenever you do not know what to do click on the button that looks like this one you just clicked and help will be right there! To start have a look at our menu page that can be found by clicking on the button that says Menu in the top navigation bar ;-)'};

	/*End of Alert messages */

//close alert will take alert box away
$scope.closeAlert = function(index) {
			$scope.alertUser = false;
};



		/*
			Dynamically add fields to the menu items page to add ingredients for a menu item.
		*/
		$scope.ingredients = {ingredients:[],quantities:[]};

		$scope.addFormField = function() {
			$scope.ingredients.ingredients.push('');
			$scope.ingredients.quantities.push('');
		};

  /*==Update functions ==*/

  /*
	Load all the ingredients of the searched menu item into loadedIngredients
	@founditem: the menu item that was searched and found.
  */
	$scope.loadedIngredients = {ingredients:[],quantities:[]};
	$scope.displayedMenuItems = false;

	$scope.loadIngredients = function() {
		for(var ingredient in $scope.foundItem.ingredients.ingredients)
		{
			$scope.loadedIngredients.ingredients.push($scope.foundItem.ingredients.ingredients[ingredient]);
			$scope.loadedIngredients.quantities.push($scope.foundItem.ingredients.quantities[ingredient]);
		}
  };

  /*
  Add more ingredients to the menu item being updated.
  Dynamically add fields to add more ingredients.
  Store the new ingredients that are added in addedUpdateIngredients.
  */
   $scope.addedUpdateIngredients = {ingredients:[],quantities:[]};

	$scope.addMoreIngredientsUpdate = function()
	{
			$scope.addedUpdateIngredients.ingredients.push('');
			$scope.addedUpdateIngredients.quantities.push('');
	};

	/*Remove an ingredient from the item being updated*/
	$scope.removedIngredients =[];
	$scope.removeIngredient = function(index)
	{
		//console.log('REMOVE:'+index + ' ' + $scope.loadedIngredients.ingredients[index]);
		$scope.removedIngredients[index] = 0;
		//console.log('Removed ingredients:'+$scope.removedIngredients);

	};

	/*Undo the remove ingredient function*/
	$scope.undoRemoveIngredient = function(index)
	{
		delete $scope.removedIngredients[index];
	};


		/*Update the menu item*/
		$scope.updateMenuItem = function()
		{

		for(var removedIngredient in $scope.removedIngredients)
		{
			if($scope.removedIngredients[removedIngredient] === 0)
			{
				delete $scope.loadedIngredients.ingredients[removedIngredient];
				delete $scope.loadedIngredients.quantities[removedIngredient];
			}

		}


			for(var removedIngredient in $scope.removedIngredients)
			{
				if($scope.removedIngredients[removedIngredient] !== '')
				{
					$scope.loadedIngredients.ingredients[removedIngredient] = '';
					$scope.loadedIngredients.quantities[removedIngredient] = '';
				}
			}
			//console.log('After removed:'+$scope.loadedIngredients.ingredients);
			var errorIngredient = false;

			/*Perform check to see if any of the ingredient or quantity fields are empty.*/
			for(var ingredient in $scope.loadedIngredients.quantities)
			{
				if($scope.loadedIngredients.quantities[ingredient] === null)
				{
					errorIngredient = true;
					$scope.errorMessage = 'Please fill in all the quantity fields.';
				}
			}

			if(!errorIngredient)
			{
				for (var i = 0; i < $scope.addedUpdateIngredients.ingredients.length; i++)
				{
					if($scope.addedUpdateIngredients.ingredients[i] == '' || $scope.addedUpdateIngredients.quantities[i] == '' || $scope.addedUpdateIngredients.quantities[i] == null)
					{
						errorIngredient = true;
						$scope.errorMessage = 'Please fill in all the ingredients and quantities fields.';
					}
				}

			}

			/*Perform check for duplicate ingredients in the extra added ingredients*/
			if(!errorIngredient)
			{
				for(var i = 0; i < ($scope.addedUpdateIngredients.ingredients.length-1); i++)
				{
					for(var j = i+1; j < ($scope.addedUpdateIngredients.ingredients.length); j++)
					{

						if($scope.addedUpdateIngredients.ingredients[i].localeCompare($scope.addedUpdateIngredients.ingredients[j])===0)
						{
							errorIngredient = true;
							$scope.errorMessage = 'Duplicate ingredients are not allowed.';
						}
					}
				}
			}
		//	console.log('error:'+errorIngredient);
		//	console.log('here');

			/*Perform check for duplicate ingredients in loaded ingredients and the extra added ingredients*/
			if(!errorIngredient)
			{
				for(var k = 0; k < ($scope.addedUpdateIngredients.ingredients.length); k++)
				{//console.log('here2');
					for(var g = 0; g < ($scope.loadedIngredients.ingredients.length); g++)
					{
					//	console.log('addedIngredient:'+$scope.addedUpdateIngredients.ingredients[k]+' loaded:'+$scope.loadedIngredients.ingredients[g]);
						if($scope.addedUpdateIngredients.ingredients[k].localeCompare($scope.loadedIngredients.ingredients[g])===0)
						{
							errorIngredient = true;
							$scope.errorMessage = 'Duplicate ingredients are not allowed.';
						}
					}
				}
			}
			/*Perform check to see if the menu item has at least one ingredient*/
			//console.log($scope.loadedIngredients.ingredients);
			//console.log($scope.addedUpdateIngredients.ingredients);

		/*Perform check to see if the menu item has at least one ingredient*/
		/*if(!errorIngredient)
		{
			if($scope.addedUpdateIngredients.ingredients.length == 0 && $scope.ingredients.ingredients.length == 0)
			{
				errorIngredient = true;
				$scope.errorMessage = 'The menu item must have at least one ingredient.';
			}
		}*/


		if(!errorIngredient)
		{
			for (var ingredient in $scope.loadedIngredients.ingredients)
			{
				if($scope.loadedIngredients.ingredients[ingredient] !== '')
				{
					$scope.addedUpdateIngredients.ingredients.push($scope.loadedIngredients.ingredients[ingredient]);
					$scope.addedUpdateIngredients.quantities.push($scope.loadedIngredients.quantities[ingredient]);
				}
			}
		}

		/*Perform check to see if the menu item has at least one ingredient*/
		var count = 0;
		var i = 0;
		while(count == 0 && i < $scope.addedUpdateIngredients.ingredients.length)
		{
			if($scope.addedUpdateIngredients.ingredients[i] != null && $scope.addedUpdateIngredients.ingredients[i] !='')
				count = 1;
			i++;
		}

		if(count == 0)
		{
			errorIngredient = true;
			$scope.errorMessage = 'The menu item must have at least one ingredient.';
		}

		if(errorIngredient)
		{
			$scope.loadedIngredients = {ingredients:[],quantities:[]};
			$scope.loadIngredients();
		}


			if(!errorIngredient)
			{
				$scope.errorMessage = null;
				$scope.updateItemName = $scope.updateItemName.toLowerCase();
				$scope.successFind = null;
				var reqObj = {itemName:$scope.foundItem.itemName.toLowerCase(), updateItemName: $scope.updateItemName, price:$scope.updateItemPrice, description:$scope.updateItemDescription, category : $scope.updateItemCategory, ingredients:$scope.addedUpdateIngredients};
				$http.post('/orders/updateMenuItem',reqObj).success(function(response){
				$scope.successMessage = response.message;
				$scope.itemNameSearch = $scope.updateItemName = $scope.updateItemPrice = $scope.updateItemCategory = $scope.updateItemDescription = null;
			    $scope.addedUpdateIngredients = {ingredients:[],quantities:[]};
				$scope.removedIngredients =[];
				$scope.loadedIngredients = {ingredients:[],quantities:[]};
				$scope.showme = false;
				}).error(function(response){
					$scope.errorMessage = response.message;
					$scope.addedUpdateIngredients = {ingredients:[],quantities:[]};
					$scope.removedIngredients =[];
					$scope.loadedIngredients = {ingredients:[],quantities:[]};

					/*Reload all of the ingredients*/
					$scope.loadIngredients();

				});
			}
		};

		/*Removing add ingredients option*/
		$scope.removeIngredientOptionUpdate = function(index)
		{
			$scope.addedUpdateIngredients.ingredients.splice(index, 1);
			$scope.addedUpdateIngredients.quantities.splice(index, 1);
		}


/*==== end of update functions ===*/

        /**
		Add product to favourites
		*/
		$scope.favourite = function(itemName)
		{
			//console.log('item'+itemName);
		};


//search for item
        $scope.searchMenu = function(isValid) {
        if(isValid){
					console.log('hello');
					$scope.showme = false;
					$scope.successFind = $scope.errorFind = null;
					$scope.successMessage = $scope.errorMessage = null;


	                var reqObj = {itemName: $scope.menuNameSearch.toLowerCase()};
	                $http.post('/menu/search', reqObj).success(function(response){

						//$scope.showme = true;
						 $scope.successFind = response.message;
						//Set the values for the item being updated.
						$scope.foundItem = response.menuItem;
						$scope.updateItemName = $scope.foundItem.itemName;
						$scope.updateItemCategory = $scope.foundItem.category;
						$scope.updateItemPrice = $scope.foundItem.price;
						$scope.updateItemDescription = $scope.foundItem.description;

					//console.log('Item found:'+$scope.foundItem.ingredients.ingredients);
                }).error(function(response){
					$scope.errorFind = response.message;
					$scope.errorMessage=response.message;
					//console.log('here');
                });
            }
						console.log('nope...');
        };

		/*Functions for creating a new menu item*/

		 /* Create new Menu Item*/
		$scope.createMenuItem = function(isValid) {
			$scope.success = $scope.error = null;


		//Check if any of the ingredient name or ingredient quantity fields are empty
		var errorIngredient = false;

		for (var i = 0; i < $scope.ingredients.ingredients.length; i++)
		{
			if($scope.ingredients.ingredients[i] == '' || $scope.ingredients.quantities[i] == '' || $scope.ingredients.quantities[i] == null)
			{
				errorIngredient = true;
				$scope.error = 'Please fill in all the ingredients fields.';
			}
		}

		if(!errorIngredient)
		{
			for(var i = 0; i < ($scope.ingredients.ingredients.length-1); i++)
			{
				for(var j = i+1; j < ($scope.ingredients.ingredients.length); j++)
				{

					if($scope.ingredients.ingredients[i].localeCompare($scope.ingredients.ingredients[j])===0)
					{
						errorIngredient = true;
						$scope.error = 'Duplicate ingredients are not allowed.';
					}
				}
			}
		}

		/*Perform check to see if the menu item has at least one ingredient*/
		if(!errorIngredient)
		{
			if($scope.ingredients.ingredients.length == 0)
			{
				errorIngredient = true;
				$scope.error = 'The menu item must have at least one ingredient.';
			}
		}

		if(!errorIngredient)
		{
				if (isValid) {
				var reqObj = {itemName: $scope.menuItem.itemNameAdd.toLowerCase(), description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice,
				category:$scope.menuItem.itemCategory, ingredients:$scope.ingredients};
				$http.post('/orders/createMenuItem', reqObj).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;//response.message;
				$scope.sucess = 'Item added to the menu.';
				$scope.menuItem = null;
				$scope.ingredients = null;
				$scope.ingredients = {ingredients:[''],quantities:['']};
				}).error(function(response) {
					$scope.error = response.message;
				});
				}
			}
		};

		/*CreateMenuCategory */
	 $scope.createMenuCatagory = function(isValid) {
		 $scope.success=false;
		 if (isValid){

			 //console.log('You have validated!');
			 if($scope.categoryName == null){
				// console.log('invalid')
				 $scope.error = true;
				 $scope.error = 'No category added, Please fill in the textbox to add a category';
			 }else{
				 var name = {
					 catagory:  $scope.categoryName
				 };
				 //console.log($scope.categoryName);
				 $http.post('/orders/createMenuCategory', name).success(function(response) {
				 // If successful show success message and clear form
				 if(response.message.localeCompare('The category already exists') == 0){
					 $scope.success = null;

					 $scope.error = true;//response.message;
					 $scope.error = 'The category already exists';
					 //console.log("already exist");
				 }else{
					 //console.log('responce : ' + response.message);

					// $scope.error.clear;//
					 $scope.error = null;
					 $scope.success = true;//response.message;
					 $scope.success = 'Category added to the menu.';
			 	 }
				 }).error(function(response) {
					 //console.log("error");
					 $scope.error ="The category already exists ";
				 });
				 }
			 }
		 };
		//  console.log($scope.menuCatagory);
		 // first we need to check that the field has data


		/*Removing add ingredients option*/
		$scope.removeIngredientOption = function(index)
		{
			$scope.ingredients.ingredients.splice(index, 1);
			$scope.ingredients.quantities.splice(index, 1);
		};
/*End of functions for creating a new menu item*/



  //Filter Menu items for search bar
  $scope.searchBar = function (row){
     var itemN = $scope.menuNameSearch.toLowerCase();
     if ((angular.lowercase(row.itemName)).contains(itemN)) {
          return (angular.lowercase(row.itemName));
    }
};

// filter Menu items according to the selected category
$scope.searchBarDynamic = function(row){
	var itemN = $scope.selectedCategory.toLowerCase();
	if ((angular.lowercase(row.itemName)).contains(itemN)) {
			 return (angular.lowercase(row.itemName));
 }
}






		//get menu items from database on the server side
		$scope.loadMenuItems = function(){
			$scope.navClicked = false;
			$cookies.selectedCategory = JSON.stringify('all');
			$scope.selectedCategory = JSON.parse($cookies.selectedCategory);
			$http.get('/loadMenuItems').success(function(response) {

		  //console.log(response.message); // testing
			var displayItems = response.message;

			for(var item in displayItems)
			{
				if(displayItems[item].itemName.length >1)
					displayItems[item].itemName = displayItems[item].itemName.charAt(0).toUpperCase() + displayItems[item].itemName.slice(1);
		//		console.log(displayItems[item].itemName);
			}


			$scope.menuItems = response.message;

			var inStock = true;
			//var notInStock = 'Not in stock';

			for(var itemName in response.message){
				$scope.menuItems[itemName].stock = true;
				// now check if the inventory items are indeed available
				if(response.message[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
							$scope.menuItems[itemName].stock = false;
				}else{ // check the inventory if all items are available
							$scope.menuItems[itemName].stock= $scope.checkStock(response.message[itemName]);
				}
			}
		}).error(function(response) {
			$scope.menuItems = 'Error loading menu Items';
		});
	};

	/*loadMenuCategories
	*/
	$scope.loadMenuCategories = function(){
		//console.log('loading menu Categories');
		$http.get('/loadMenuCategories').success(function(response) {
		$scope.menuCatagory = response.message;
		$scope.cat = response.message;

	}).error(function(response) {
		$scope.menuItems = 'Error loading menu Items';
	});
	};



        /*
         * Check if an ingredient is in stock or not
        */
        $scope.checkStock = function(menuItemName){
					for(var inventoryItem in menuItemName.ingredients.ingredients) {
						var name = menuItemName.ingredients.ingredients[inventoryItem]; // name of ingredient
						var quantity = menuItemName.ingredients.quantities[inventoryItem];
						// now check that the amount in the inventory is more than the amount needed for this menu item
							var ingredient = {
								ingredientName: name,
								ingredientQuantity: quantity
							};

							$http.post('/inventoryItems', ingredient).success(function(response2) {
								if(response2.message[0].length === 0){
										menuItemName.stock = false;
								}else{
								if(response2.message[0][0].quantity >= response2.message[1]){
										if(menuItemName.stock !== false){
												menuItemName.stock = true;
												}
											}else {
													menuItemName.stock = false;
											}
								}
							}).error(function(response2) {
										$scope.error = response2.message;
								});
					}
					return menuItemName.stock;
        };

		/*
		Delete a menu item
		*/
		//$scope.deleteMenuItemName = '';
		//$scope.successMessage = $scope.errorMessage = '';
		$scope.deleteMenuItem = function()
		{
			$scope.successFind = null;
			$scope.menuNameSearch=$scope.menuNameSearch.toLowerCase();
		//	console.log('Delete:'+$scope.menuNameSearch);
			var reqObj = {itemName:$scope.menuNameSearch};
			$http.post('/orders/deleteMenuItem',reqObj).success(function(response){
				$scope.successMessage = response.message;
				$scope.itemNameSearch = null;
			}).error(function(response){
				$scope.errorMessage = response.message;
			});
		};


		/*
	// Remove existing menu item
		$scope.remove = function(menuItem) {
			if ( menuItem ) {
				menuItem.$remove();

				for (var i in $scope.menuitems) {
					if ($scope.menuitems [i] === menuItem) {
						$scope.menuitems.splice(i, 1);
					}
				}
			} else {
				$scope.menuItem.$remove(function() {
					$location.path('menuitmes');
				});
			}
		};*/

		// Update existing menu item
		$scope.update = function() {
			var menuItem = $scope.menuItem;

			menuItem.$update(function() {
				$location.path('menuitems/' + menuItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of menu items
		$scope.find = function() {
			$scope.menuItem = MenuItems.query();
		};

		// Find existing menu item
		$scope.findOne = function() {
			$scope.menuItem.itemNameSearch = MenuItems.get({
				menuItemId: $stateParams.menuItemId
			});
		};



		/*
		 * Add to plate. Last edited by {Rendani Dau}
		 */
		//Helper function to determine if item is in array(i.e. item is in plate)
		var indexOfItem = function(arr, item){
			for(var i = 0; i < arr.length; i++){
				if(arr[i].itemName === item.itemName)
					return i;
			}
			return -1;
		};

		/*
			Reporting for menuItems
		*/

		/*This function stores all the names of the menu items in an array so that
			it can be displayed in an HTML page*/

		$scope.loadAllMenuItems = function(){
						$http.get('/loadMenuItems').success(function(response) {

								$scope.menuItems = response.message;
								var itemsArray = new Array();
								var counter = 0;

								for(var itemName in response.message){
									itemsArray[counter] = response.message[itemName];
									counter++;
								}

								$scope.menuItems = itemsArray;

						}).error(function(response) {
						$scope.inventoryItems = 'Error loading menu Items';
					});
		};

		/*This function generates a report that shows the amount of the selected
			items sold over time.*/
		$scope.generateSoldReport = function(){
				$http.post('orders/generateSoldReport',{numItems: $scope.numMenuItems, start: $scope.startDate, end: $scope.endDate},{responseType:'arraybuffer'}).success(function(response){


				 var file = new Blob([response], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var fileName = 'test.pdf';
					var a = document.createElement('a');
					document.body.appendChild(a);
					a.setAttribute('style', 'display: none');

					a.href =  fileURL;
									a.download = fileName;
									a.click();

				}).error(function(response){
					console.log(response);
				});
		};

		/*This function adds the selected item to be displayed in the soldReport*/
		$scope.addSoldItem = function()
		{
				console.log("in sold item");
				console.log("HERE:"+$scope.soldItem);
		};

		/*This funtion generates a report that shows the most popular menu itmes over
			a period of time*/
		$scope.generatePopularReport = function(){
			$http.post('orders/generatePopularReport',{numItems: $scope.numMenuItems, start: $scope.startDate, end: $scope.endDate},{responseType:'arraybuffer'}).success(function(response){


			 var file = new Blob([response], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);

				var fileName = 'test.pdf';
				var a = document.createElement('a');
				document.body.appendChild(a);
				a.setAttribute('style', 'display: none');

				a.href =  fileURL;
								a.download = fileName;
								a.click();

			}).error(function(response){
				console.log(response);
			});
		};

		$scope.addToPlate = function(itemName){
			var _price;
			var _ingredients = [];
			var _quantities = [];
			for(var j = 0; j < $scope.menuItems.length; j++){
				if(itemName === $scope.menuItems[j].itemName){
					_price = $scope.menuItems[j].price;
					_ingredients = $scope.menuItems[j].ingredients.ingredients;
					_quantities = $scope.menuItems[j].ingredients.quantities;
					break;
				}
			}
			var y = {
				itemName: itemName,
				price: _price,
				ingredients: _ingredients,
				quantities: _quantities,
				quantity: 1
			};

			if($cookies.plate){
					var existing = JSON.parse($cookies.plate);

					if(indexOfItem(existing, y) === -1)
						existing[existing.length] = y;

					$cookies.plate = JSON.stringify(existing);
			}
			else
			{
				var plt = [];
				plt[0] = y;
				$cookies.plate = JSON.stringify(plt);
			}
			$rootScope.$broadcast('plateUpdated');
		};


	$scope.view = true;
        $scope.viewImage = function(itemName) {
            if(itemName)
                $scope.view = $scope.view === false ? true: false;

/* merge conflict - not sure which one to keep
        $scope.viewImage = function() {

            $scope.viewImage = $scope.viewImage === false ? true: false;
*/
        };

        $scope.checkCMUser = function(){
            if(!Authentication.user) {
                $location.path('/');
            }
            else if(Authentication.user.roles[0] !== 'cafeteriaManager') {
                $location.path('/');
            }
        };
	}
]);



/*Add ingredients button*/

//Directive that returns an element which adds input boxes
menuItemsModule.directive('addmoreingredients', function(){
	return {
		restrict: 'E',
		template: '<button addbuttons class="btn btn-large btn-primary">Add more ingredients</button>'
	};
});

//Directive for adding input boxes on click
menuItemsModule.directive('addbuttons', function($compile){
	return function(scope, element, attrs){
		element.bind('click', function(){
			scope.count++;

			angular.element(document.getElementById('space-for-more-ingredients')).append($compile('<div ng-init="loadInventoryItems()" data-ng-controller="InventoryController"><label>Ingredient</label><select id ="itemCategory" name ="itemCategory" class = "form-control" data-ng-model ="menuItem.itemCategory"><option  ng-repeat="item in inventoryItems" value = "Toasted Sandwiches">{{item.productName}} {{item.unit[0]}}</option></select><br><label>Quantity</label><input type ="number" class = "form-control" min = 0 id="addedQuantity" placeholder = "quantity" name ="addedQuantity"></div></div>')(scope));

		});
	};
});
