'use strict';

// MenuItem controller
var menuItemsModule = angular.module('menuItems').controller('MenuItemsController', ['$scope', '$rootScope','$http', '$stateParams', '$location', '$cookies', 'Authentication', 'MenuItems',
	function($scope, $rootScope, $http, $stateParams, $location, $cookies, Authentication, MenuItems) {
		$scope.authentication = Authentication;
		
		$scope.menuCategories = [];

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
		console.log('REMOVE:'+index + ' ' + $scope.loadedIngredients.ingredients[index]);
		$scope.removedIngredients[index] = 0;		
		console.log('Removed ingredients:'+$scope.removedIngredients);
		
	};

	/*Undo the remove ingredient function*/
	$scope.undoRemoveIngredient = function(index)
	{
		console.log('UNDOREMOVE:'+index + ' ' + $scope.loadedIngredients.ingredients[index]);
		delete $scope.removedIngredients[index];
		
		console.log('Removed ingredients:'+$scope.removedIngredients);
		//console.log('Removed ingredients:'+ $scope.removedIngredients);
		//var found = false;
		//for(var ingredient in $scope.removedIngredients)
		//{
			//if($scope.removedIngredients[ingredient] === index)
			//{
				//$scope.removedIngredients[ingredient] = '';
				//found = true;
			//}
		//}

		//console.log('Removed ingredients:'+ $scope.removedIngredients);

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
				//$scope.removedIngredients.ingredients.splice(index, 1);
				
				//$scope.loadedIngredients.ingredients.splice(removedIngredient,1);
				//$scope.loadedIngredients.quantities.splice(removedIngredient,1);
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
			console.log('After removed:'+$scope.loadedIngredients.ingredients);
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
			console.log('error:'+errorIngredient);
			console.log('here');
			
			/*Perform check for duplicate ingredients in loaded ingredients and the extra added ingredients*/
			if(!errorIngredient)
			{
				for(var k = 0; k < ($scope.addedUpdateIngredients.ingredients.length); k++)
				{console.log('here2');
					for(var g = 0; g < ($scope.loadedIngredients.ingredients.length); g++)
					{
						console.log('addedIngredient:'+$scope.addedUpdateIngredients.ingredients[k]+' loaded:'+$scope.loadedIngredients.ingredients[g]);
						if($scope.addedUpdateIngredients.ingredients[k].localeCompare($scope.loadedIngredients.ingredients[g])===0)
						{
							errorIngredient = true;
							$scope.errorMessage = 'Duplicate ingredients are not allowed.';
						}
					}
				}
			}
			/*Perform check to see if the menu item has at least one ingredient*/
			console.log($scope.loadedIngredients.ingredients);
			console.log($scope.addedUpdateIngredients.ingredients);
		
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
			console.log('item'+itemName);
		};


//search for item
        $scope.searchMenu = function(isValid) {
            if(isValid){
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

		/*Removing add ingredients option*/
		$scope.removeIngredientOption = function(index)
		{
			$scope.ingredients.ingredients.splice(index, 1);
			$scope.ingredients.quantities.splice(index, 1);					
		}
/*End of functions for creating a new menu item*/
		
        //Filter Menu items - Special Of The Day
        $scope.special = function (row) {
            return (angular.lowercase(row.category).indexOf('Special Of The Day') !== -1);
        };

		//Filter Menu items - Toasted Sandwiches
		$scope.toastedSandwiches = function (row) {
			return (angular.lowercase(row.category).indexOf('Toasted Sandwiches') !== -1);
		};

		//Filter Menu items for Tramezzinis
		$scope.tramezzinis = function (row) {
			return (angular.lowercase(row.category).indexOf('Tramezzinis') !== -1);
		};

		//Filter Menu items for Burger Bar
		$scope.burgerBar = function (row) {
			return (angular.lowercase(row.category).indexOf('Burger Bar') !== -1);
		};

		//Filter Menu items for Daily Lunches
		$scope.dailyLunch = function (row) {
			return (angular.lowercase(row.category).indexOf('Daily Lunches') !== -1);
		};

        //Filter Menu items for Drinks
        $scope.drinks = function (row) {
            return (angular.lowercase(row.category).indexOf('Drinks') !== -1);
        };
		//Filter Menu items for Salad Bar
		$scope.saladBar = function (row) {
				return (angular.lowercase(row.category).indexOf('Salad Bar') !== -1);
		};

		//Filter Menu items for Sweet Treats
		$scope.sweetTreat = function (row) {
			return (angular.lowercase(row.category).indexOf('Sweet Treats') !== -1);
		};

		//Filter Menu items for Resale Items
		$scope.resaleItem = function (row) {
				return (angular.lowercase(row.category).indexOf('Resale Items') !== -1);
		};

		//Filter Menu items for On The Side
		$scope.onSide = function (row) {
			return (angular.lowercase(row.category).indexOf('On The Side') !== -1);
		};


		//Filter Menu items for Extra's
		$scope.extra = function (row) {
			return (angular.lowercase(row.category).indexOf('Extra') !== -1);
		};

        //Filter Menu items for search bar
        $scope.searchBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            if ((angular.lowercase(row.itemName)).contains(itemN)) {
                return (angular.lowercase(row.itemName));
            }
        };

        //Filter Menu items for burger bar search bar
        $scope.searchBurgerBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
           // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Burger Bar') !== -1)) {
               // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };

        //Filter Menu items for daily lunch search bar
        $scope.searchDailyBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Daily Lunches') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };


        //Filter Menu items for drinks search bar
        $scope.searchDrinks = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Drinks') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };
        //Filter Menu items for extra's search bar
        $scope.searchExtraBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Extra') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };
        //Filter Menu items for side search bar
        $scope.searchSideBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('On The Side') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };
        //Filter Menu items for resale search bar
        $scope.searchResaleBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Resale Items') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };
        //Filter Menu items for salad bar search bar
        $scope.searchSaladBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Salad Bar') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };
        //Filter Menu items for sweet treats search bar
        $scope.searchSweetBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Sweet Treats') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };
        //Filter Menu items for toasted sandwiches search bar
        $scope.searchToastBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Toasted Sandwiches') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };

        //Filter Menu items for tramezzini search bar
        $scope.searchTramBar = function (row) {
            var itemN = $scope.menuNameSearch.toLowerCase();
            console.log('row');
            // console.log('item'+ row.itemName);
            if ((angular.lowercase(row.itemName)).contains(itemN) && (angular.lowercase(row.category).indexOf('Tramezzinis') !== -1)) {
                // console.log('IFFFFFFFFFFFFFFFF');
                return (angular.lowercase(row.itemName));
            }
        };


		//get menu items from database on the server side
		$scope.loadMenuItems = function(){
			$http.get('/loadMenuItems').success(function(response) {

		  //console.log(response.message); // testing
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
		$scope.deleteMenuItemName = '';

		$scope.deleteMenuItem = function(menuItemName)
		{
			$scope.successFind = null;
			$scope.menuNameSearch=$scope.menuNameSearch.toLowerCase();
			console.log('Delete:'+$scope.menuNameSearch);
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
		
		$scope.addToPlate = function(itemName){
			var _price;
			for(var j = 0; j < $scope.menuItems.length; j++){
				if(itemName === $scope.menuItems[j].itemName){
					_price = $scope.menuItems[j].price;
					break;
				}
			}
			var y = {
				itemName: itemName,
				price: _price,
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
