'use strict';

// MenuItem controller
var menuItemsModule = angular.module('menuItems').controller('MenuItemsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $http, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;


		/*
			Dynamically add fields to the menu items page to add ingredients for a menu item.
		*/
		$scope.ingredients = {ingredients:[],quantities:[]};

		$scope.addFormField = function() {
			$scope.ingredients.ingredients.push('');
			$scope.ingredients.quantities.push('');
		}
  
  /*==Update functions ==*/
  
  /*
	Load all the ingredients of the searched menu item into loadedIngredients
	@founditem: the menu item that was searched and found.
  */
	$scope.loadedIngredients = {ingredients:[],quantities:[]};
	$scope.displayedMenuItems = false;
	
	$scope.loadIngredients = function() {
	if(!$scope.displayedMenuItems)
	{
		$scope.displayedMenuItems = true;

		for(var ingredient in $scope.foundItem.ingredients.ingredients)
		{
			$scope.loadedIngredients.ingredients.push($scope.foundItem.ingredients.ingredients[ingredient]);
			$scope.loadedIngredients.quantities.push($scope.foundItem.ingredients.quantities[ingredient]);
		}
			
			//console.log('Loaded ingredients:'+$scope.loadedIngredients.ingredients);
			//console.log('A loaded ingredient:'+$scope.loadedIngredients.ingredients[0]);
			//console.log('A loaded ingredient quantity:'+$scope.loadedIngredients.quantities[0]);
			//console.log('A loaded ingredient:'+$scope.loadedIngredients.ingredients[1]);
			//console.log('A loaded ingredient quantity:'+$scope.loadedIngredients.quantities[1]);
			//console.log('End load ingredients');					

				
	}
  };
  
  /*
  Add more ingredients to the menu item being updated.
  Dynamically add fields to add more ingredients.
  Store the new ingredients that are added in addedUpdateIngredients.
  */
   $scope.addedUpdateIngredients = {ingredients:[],quantities:[]};
   
	$scope.addMoreIngredientsUpadte = function()
	{
			$scope.addedUpdateIngredients.ingredients.push('');
			$scope.addedUpdateIngredients.quantities.push('');
	};
		
	/*Remove an ingredient from the item being updated*/
	$scope.removedIngredients =[];
	$scope.removeIngredient = function(index)
		{
			//console.log('REMOVE:'+index + ' ' + $scope.loadedIngredients.ingredients[index]);			
			$scope.removedIngredients.push(index);
		};
		
	/*Undo the remove ingredient function*/
	$scope.undoRemoveIngredient = function(index)
		{
			//console.log('UNDOREMOVE:'+index + ' ' + $scope.loadedIngredients.ingredients[index]);
			//console.log('Removed ingredients:'+ $scope.removedIngredients);
			var found = false;
			for(var ingredient in $scope.removedIngredients)
			{
				if($scope.removedIngredients[ingredient] == index)
				{
					$scope.removedIngredients[ingredient] = '';
					found = true;
				}
			}
			
			//console.log('Removed ingredients:'+ $scope.removedIngredients);
			
		};
		
		
		/*Update the menu item*/
		$scope.updateMenuItem = function()
		{

		//console.log('Update - Loaded ingredients.ingredients:'+$scope.loadedIngredients.ingredients);
		//console.log('Update - Removed ingredients:'+$scope.removedIngredients);
		//console.log('Update - addedUpdateIngreients.ingredients:'+$scope.addedUpdateIngredients.ingredients);
		
			for(var removedIngredient in $scope.removedIngredients)
			{
				if($scope.removedIngredients[removedIngredient] != '')
				{
					$scope.loadedIngredients.ingredients[removedIngredient] = '';
					$scope.loadedIngredients.quantities[removedIngredient] = '';
				}
			}
			
			for (var ingredient in $scope.loadedIngredients.ingredients)
			{
				if($scope.loadedIngredients.ingredients[ingredient] != '')
				{
					$scope.addedUpdateIngredients.ingredients.push($scope.loadedIngredients.ingredients[ingredient]);
					$scope.addedUpdateIngredients.quantities.push($scope.loadedIngredients.quantities[ingredient]);
				}
			}
			
			//console.log('Ingredients updated:'+$scope.addedUpdateIngredients.ingredients);
		    //console.log('Quantities updated:'+$scope.addedUpdateIngredients.quantities);
			
			$scope.updateItemName = $scope.updateItemName.toLowerCase();
			var reqObj = {itemName:$scope.foundItem.itemName.toLowerCase(), updateItemName: $scope.updateItemName, price:$scope.updateItemPrice, description:$scope.updateItemDescription, category : $scope.updateItemCategory, ingredients:$scope.addedUpdateIngredients};
			$http.post('/orders/updateMenuItem',reqObj);				
		};
		
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
                $scope.successOne = $scope.errorOne = null;
                //console.log("Menu item searched for issssss: "+$scope.menuNameSearch.toLowerCase());

                var reqObj = {itemName: $scope.menuNameSearch.toLowerCase()};
                $http.post('/menu/search', reqObj).success(function(response){
                    $scope.successOne = response.message;
					
					//Set the values for the item being updated.
					$scope.foundItem = response.menuItem;
					$scope.updateItemName = $scope.foundItem.itemName;
					$scope.updateItemCategory = $scope.foundItem.category;
					$scope.updateItemPrice = $scope.foundItem.price;
					$scope.updateItemDescription = $scope.foundItem.description;
					
					console.log('Item found:'+$scope.foundItem.ingredients.ingredients);
                }).error(function(response){
                    $scope.errorOne = response.message;
                });
            }
        };

		 // Create new Menu Item
		$scope.createMenuItem = function(isValid) {
      if (isValid) {


        $scope.success = $scope.error = null;
        var reqObj = {itemName: $scope.menuItem.itemNameAdd.toLowerCase(), description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice,
	  	  category:$scope.menuItem.itemCategory, ingredients:$scope.ingredients};


		$http.post('/orders/createMenuItem', reqObj).success(function(response) {
          // If successful show success message and clear form
        $scope.success = true;//response.message;
		$scope.menuItem = null;
		$scope.ingredients = null;
		$scope.ingredients = {ingredients:[],quantities:[]};

        }).error(function(response) {
          $scope.error = response.message;
        });
        }
      };

	  /*Adding buttons*/
	  $scope.count = 0;

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

		  console.log(response.message); // testing
			$scope.menuItems = response.message;

			var inStock = true;
			//var notInStock = 'Not in stock';

			for(var itemName in response.message){
				$scope.menuItems[itemName].stock = true;
				// now check if the inventory items are indeed available
				if(response.message[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
							$scope.menuItems[itemName].stock = false;
				}else{ // check the inventory if all items are available

						for(var inventoryItem in response.message[itemName].ingredients.ingredients){
							var name = response.message[itemName].ingredients.ingredients[inventoryItem]; // name of ingredient
							var quantity = response.message[itemName].ingredients.quantities[inventoryItem];
							// now check that the amount in the inventory is more than the amount needed for this menu item
								console.log('name = ' +name + ' amount = ' + quantity);
								var ingredient = {
									ingredientName: name,
									ingredientQuantity: quantity
								}

								$http.post('/inventoryItems', ingredient).success(function(response2) {
							if(response2.message[0][0].quantity >= response2.message[1]){
									if($scope.menuItems[itemName].stock != false){
												$scope.menuItems[itemName].stock = true;
											}
										}else {
												$scope.menuItems[itemName].stock = false;
										}
									}).error(function(response2) {
						          $scope.error = response2.message;
						      });



						}


				}
				//itemsArray[counter].stock = stockVariable1;
			}

		//	$scope.menuItems = itemsArray;
		  //	console.log('array size = ' + itemsArray.length);// testing

				}).error(function(response) {
				$scope.menuItems = 'Error loading menu Items';
			});
			//console.log($scope.menuItems);
		};

		/*
		Delete a menu item
		*/
		$scope.deleteMenuItemName = '';
		
		$scope.deleteMenuItem = function(menuItemName)
		{
			$scope.menuNameSearch=$scope.menuNameSearch.toLowerCase();
			console.log('Delete:'+$scope.menuNameSearch);
			var reqObj = {itemName:$scope.menuNameSearch};
			$http.post('/orders/deleteMenuItem',reqObj);	
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
	}
]);

/*Add ingredients button*/

//Directive that returns an element which adds input boxes
menuItemsModule.directive('addmoreingredients', function(){
	return {
		restrict: 'E',
		template: '<button addbuttons class="btn btn-large btn-primary">Add more ingredients</button>'
	}
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
