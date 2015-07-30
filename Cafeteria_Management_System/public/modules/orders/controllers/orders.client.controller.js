'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$rootScope','$http', '$stateParams', '$location', '$cookies', 'Authentication', 'Orders',
	function($scope, $rootScope, $http, $stateParams, $location, $cookies, Authentication, Orders) {
		$scope.authentication = Authentication;
		
		$scope.plate = [];
		if($cookies.plate)
			$scope.plate = JSON.parse($cookies.plate);
		
		//Helper function to determine if item is in array(i.e. item is in plate)
		var indexOfItem = function(arr, _itemName){
			for(var i = 0; i < arr.length; i++){
				if(arr[i].itemName === _itemName)
					return i;
			}
			return -1;
		};
		
		$scope.quantityChange = function(itemName){
			$cookies.plate = JSON.stringify($scope.plate);
			$scope.subTotal();
		};
		
		$scope.subTotal = function(){
			var total = 0;
			if($scope.plate.length > 0){
				for(var i = 0; i < $scope.plate.length; i++){
					total += $scope.plate[i].price * $scope.plate[i].quantity;
				}
			}
			$scope.orderTotal = total;
		};
		
		$scope.orderTotal = 0;
		$scope.subTotal();
		//place the order
		$scope.placeOrder = function(){
			/*if($scope.plate){
				if(Authentication.user){
					console.log('User is: ' + Authentication.user.username);
					
					for(var i = 0; i < $scope.plate.length; i++){
						$scope.plate[i].username = Authentication.user.username;
						var itemName = $scope.plate[i].itemName;
						var _quantity = angular.element(document.querySelector('input[name="' + itemName + '"]'))[0].value;
						
						$scope.plate[i].quantity = _quantity;
					}
					$http.post('/orders/placeOrder', $scope.plate).success(function(response) {
						$scope.plate = [];
						$cookies.plate = JSON.stringify([]);
						$scope.success = response.message;
					}).error(function(response) {
						console.log('error' + response.message);
						$scope.error = response.message;
					});
				}
				else{
					$location.path('/signin');
				}
			}*/
		};
		
		//Remove from plate
		$scope.removeFromPlate = function(itemName){
			if($cookies.plate){
				var plate = JSON.parse($cookies.plate);
				
				for(var i = 0; i < plate.length; i++){
					if(plate[i].itemName === itemName){
						plate.splice(i,1);
						$cookies.plate = JSON.stringify(plate);
						break;
					}
				}
				location.reload(true);
				//$rootScope.$broadcast('plateUpdated');
			}
		};
		/*
		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				name: this.name
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) {
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({
				orderId: $stateParams.orderId
			});
		};*/
	}
]);
