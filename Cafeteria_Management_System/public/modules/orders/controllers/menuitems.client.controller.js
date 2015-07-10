'use strict';

// MenuItem controller
angular.module('menuItems').controller('MenuItemsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $http, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;

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
				return (angular.lowercase(row.category).indexOf('Extra) !== -1);
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

		$scope.addCategories = function()
		{
			console.log('here');
			$scope.categories = {'Snacks','Lunch'};
		};

		// Create new Menu Item
		$scope.createMenuItem = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var reqObj = {itemName: $scope.menuItem.itemNameAdd, description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice, category:$scope.menuItem.itemCategory};

        $http.post('/orders/createMenuItem', reqObj).success(function(response) {
          // If successful show success message and clear form
        $scope.success = true;//response.message;
        }).error(function(response) {
          $scope.error = response.message;
        });
        }
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
