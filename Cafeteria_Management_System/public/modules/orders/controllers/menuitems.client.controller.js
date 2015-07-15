'use strict';

// MenuItem controller
var menuItemsModule = angular.module('menuItems').controller('MenuItemsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $http, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;


		/*
			Dynamically add fields to the menu itmes page to add ingredients for a menu item.
		*/
		$scope.ingredients = {ingredients:[],quantities:[]};

  $scope.addFormField = function() {
    //$scope.ingredients.fields.push('');
    //$scope.quantities.fields.push('');

	 $scope.ingredients.ingredients.push('');
	 $scope.ingredients.quantities.push('');


  }

        /**
		Add product to favourites
		*/
		$scope.favourite = function(itemName)
		{
			console.log('item'+itemName);


		};



		 // Create new Menu Item
		$scope.createMenuItem = function(isValid) {
      if (isValid) {


        $scope.success = $scope.error = null;
        var reqObj = {itemName: $scope.menuItem.itemNameAdd, description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice,
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
		$scope.tramizini = function (row) {
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
		$scope.salidBar = function (row) {
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




		//get menu items from database on the server side
		$scope.loadMenuItems = function(){
			$http.get('/loadMenuItems').success(function(response) {

		  //console.log('responce = ' + response.message); // testing
			$scope.menuItems = response.message;
			var itemsArray    = new Array();
			var counter = 0;
			var inStockArray = new Array();
			var stockVariable1 = 'In stock';
			var stockVariable2 = 'Not in stock';

			for(var itemName in response.message){
				//console.log(itemName + " = " + response.message[itemName].itemName);// testing
				itemsArray[counter] = response.message[itemName];

				console.log('******** ' + response.message[itemName].itemInStock);
				// now check if items are indeed available in the inventory
				if(response.message[itemName].itemInStock == false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
						itemsArray[counter].stock = stockVariable2;
				}else{ // check the inventory if all items are available
						var enoughInventory = true;
						var countAvailableInventory = 0;
						var countIngredients = 0;
						for(var inventoryItem in response.message[itemName].ingredients.ingredients){
							var name = response.message[itemName].ingredients.ingredients[inventoryItem]; // name of ingredient
							var quantity = response.message[itemName].ingredients.quantities[inventoryItem];
							countIngredients++;
							// now check that the amount in the inventory is more than the amount needed for this menu item

								console.log('name = ' +name + ' amount = ' + quantity);
								var ingredient = {
									ingredientName: name,
									ingredientQuantity: quantity
								}
								var a = quantity;
								console.log(quantity + ' pppppppp');
								$http.post('/inventoryItems', ingredient).success(function(response2) {
									console.log(quantity);
									console.log('******1 '+response2.message[0].quantity );
									console.log('******2 '+ a );
									console.log(response2.message[0].quantity >= a);
										if(response2.message[0].quantity >= quantity){
											console.log('++++++++++++');
											countAvailableInventory++; // since enough of an item item is indeed available to use
										}else {
											enoughInventory = false;
										}
									}).error(function(response2) {
						          $scope.error = response2.message;
						      });
									console.log(enoughInventory + '......') ;
									if(countIngredients === countAvailableInventory){
										itemsArray[counter].stock = stockVariable1;
									}else{
										itemsArray[counter].stock = stockVariable2;
									}
								/*	if(enoughInventory === false){
										itemsArray[counter].stock = stockVariable2;
									}
									if(enoughInventory === true){
										itemsArray[counter].stock = stockVariable1;
									}*/
						}
						console.log('ingrediants = ' + countAvailableInventory);


				}
				//itemsArray[counter].stock = stockVariable1;
			  counter++;
			}

			$scope.menuItems = itemsArray;
		  //	console.log('array size = ' + itemsArray.length);// testing

				}).error(function(response) {
				$scope.menuItems = 'Error loading menu Items';
			});
			//console.log($scope.menuItems);
		};



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
		};

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
