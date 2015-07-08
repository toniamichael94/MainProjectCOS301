'use strict';

// MenuItems controller
angular.module('menuitems').controller('MenuItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;

		// Create new Menu Item
		$scope.create = function() {
			// Create new Menu object
			var menuitem = new MenuItems ({
				name: this.name
			});

			// Redirect after save
			menuitem.$save(function(response) {
				$location.path('menuitems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing menu item
		$scope.remove = function(menuitem) {
			if ( menuitem ) { 
				menuitem.$remove();

				for (var i in $scope.menuitems) {
					if ($scope.menuitems [i] === menuitem) {
						$scope.menuitems.splice(i, 1);
					}
				}
			} else {
				$scope.menuitem.$remove(function() {
					$location.path('menuitems');
				});
			}
		};

		// Update existing menu item
		$scope.update = function() {
			var menuitem = $scope.menuitem;

			menuitem.$update(function() {
				$location.path('menuitems/' + menuitem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of menu items
		$scope.find = function() {
			$scope.menuitems = MenuItems.query();
		};

		// Find existing Menu item
		$scope.findOne = function() {
			$scope.menuitem = MenuItems.get({ 
				menuitemId: $stateParams.menuitemId
			});
		};
	}
]);