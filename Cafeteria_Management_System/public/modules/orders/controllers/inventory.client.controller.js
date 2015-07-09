'use strict';

// Inventory controller
angular.module('inventory').controller('InventoryController', ['$scope', '$stateParams', '$location', 'Authentication', 'Inventory',
	function($scope, $stateParams, $location, Authentication, Inventory) {
		$scope.authentication = Authentication;

		// Create new Inventory Item
		$scope.create = function() {
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
		};

		// Remove existing inventory item
		$scope.remove = function(inventoryItem) {
			if ( inventoryItem ) {
				inventoryItem.$remove();

				for (var i in $scope.inventory) {
					if ($scope.inventory [i] === inventoryItem) {
						$scope.inventory.splice(i, 1);
					}
				}
			} else {
				$scope.inventoryItem.$remove(function() {
					$location.path('inventory');
				});
			}
		};

		// Update existing Inventory item
		$scope.update = function() {
			var inventoryItem = $scope.inventoryItem;

			inventoryItem.$update(function() {
				$location.path('inventory/' + inventoryItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Inventory items
		$scope.find = function() {
			$scope.inventory = Inventory.query();
		};

		// Find existing Inventory item
		$scope.findOne = function() {
			$scope.inventoryItem = Inventory.get({
				inventoryItemId: $stateParams.inventoryItemId
			});
		};
	}
]);