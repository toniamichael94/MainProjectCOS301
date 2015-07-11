'use strict';

// MenuItem controller
var menuItemsModule = angular.module('menuItems').controller('MenuItemsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $http, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;

		 // Create new Menu Item
		$scope.createMenuItem = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
		var ingredients1 = [{'ingredient':$scope.menuItem.ingredient,'quantity':$scope.menuItem.quantity}, {'ingredient':$scope.menuItem.ingredient,'quantity':$scope.menuItem.quantity}];
		console.log(ingredients1.ingredient);
        var reqObj = {itemName: $scope.menuItem.itemNameAdd, description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice, 
		category:$scope.menuItem.itemCategory, ingredients:ingredients1};
        $http.post('/orders/createMenuItem', reqObj).success(function(response) {
          // If successful show success message and clear form
        $scope.success = true;//response.message;
		$scope.menuItem = null;

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
				// If successful show success message and clear form
		  //console.log('responce = ' + response.message); // testing
			$scope.menuItems = response.message;
			var itemsArray    = new Array();
			var counter = 0;

			for(var itemName in response.message){
				//console.log(itemName + " = " + response.message[itemName].itemName);// testing
				itemsArray[counter] = response.message[itemName];
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
menuItemsModule.directive("addbuttonsbutton", function(){
	return {
		restrict: "E",
		template: "<button addbuttons class='btn btn-large btn-primary'>Add more ingredients</button>"
	}
});

//Directive for adding input boxes on click
menuItemsModule.directive("addbuttons", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			scope.count++;
			angular.element(document.getElementById('space-for-more-ingredients')).append($compile("<label>Ingredient</label><input type='text' id='itemIngredient' name='itemIngredient' class='form-control' placeholder='Ingredient'><br><label>Quantity</label><input type ='number' class = 'form-control' min = 0 id='itemQuantity' placeholder = 'quantity' name ='itemQuantity'><br></div>")(scope));
		});
	};
});

