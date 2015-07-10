'use strict';

// MenuItem controller
angular.module('menuItems').controller('MenuItemsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'MenuItems',
	function($scope, $http, $stateParams, $location, Authentication, MenuItems) {
		$scope.authentication = Authentication;

		//display menu item
		$scope.loadMenuItems = function(){
			console.log('in load menu items ...');
			$http.get('/loadMenuItems').success(function(response) {
				// If successful show success message and clear form
			//	var itemNames = responce.message['category'];
				//console.log('itemNames: ' + itemNames);
				console.log('responce = ' + response.message);
			$scope.menuItems = response.message;
			var itemsArray    = new Array();
			var counter = 0;

			for(var itemName in response.message){
				console.log(itemName + " = " + response.message[itemName].itemName);
				itemsArray[counter].itemName = response.message[itemName].itemName
			  counter++;
			}
			$scope.menuItems = itemsArray;//itemsArray; "order.created | date:'medium'"
		  	console.log('array size = ' + itemsArray.length);
			 for (var i=0; i<itemsArray.length; i++) {
			//  document.write("<tr><td>" + i + " is:</td>");
			//  document.write("<td>" + itemsArray[i] + "</td></tr>");
			}

				}).error(function(response) {
				$scope.menuItems = 'Error loading menu Items';
			});
			//console.log($scope.menuItems);
		};

		// Create new Menu Item
		$scope.createMenuItem = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var reqObj = {itemName: $scope.menuItem.itemNameAdd, description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice, category:$scope.menuItem.itemCategory};

        $http.post('/orders/createMenuItem', reqObj).success(function(response) {
          // If successful show success message and clear form
        $scope.success = response.message;
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
