'use strict';

// Inventory controller
angular.module('menuitems').controller('MenuItemsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $http, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;

		// Create new Inventory Item
		/*$scope.create = function() {
			// Create new InventoryItem object
			var inventoryItem = new Inventory ({
				name: this.name
			});

			// Redirect after save
			inventoryItem.$save(function(response) {
				$location.path('inventory/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/
		
		//create new inventory item
		$scope.create = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var reqObj = {menuItemName: $scope.menuitem.itemName, description: $scope.menuitem.description, price:$scope.menuitem.price};
//        reqObj.userID = $scope.userID;
//        reqObj.role = $scope.role;

        $http.post('/orders/create', reqObj).success(function(response) {
          // If successful show success message and clear form
        $scope.success = response.message;
        }).error(function(response) {
          $scope.error = response.message;
        });
        }
      };

		// Remove existing inventory item
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

		// Update existing Inventory item
		$scope.update = function() {
			var menuItem = $scope.menuItem;

			menuItem.$update(function() {
				$location.path('menuitems/' + menuItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Inventory items
		$scope.find = function() {
			$scope.menuItem = MenuItems.query();
		};

		// Find existing Inventory item
		$scope.findOne = function() {
			$scope.menuItem = MenuItems.get({
				menuItemId: $stateParams.menuItemId
			});
		};
	}
]);
