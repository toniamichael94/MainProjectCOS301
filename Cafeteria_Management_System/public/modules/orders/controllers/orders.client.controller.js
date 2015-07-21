'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$http', '$stateParams', '$location', '$cookies', 'Authentication', 'Orders',
	function($scope, $http, $stateParams, $location, $cookies, Authentication, Orders) {
		$scope.authentication = Authentication;
		
		$scope.plate = null;
		if($cookies.plate)
			$scope.plate = JSON.parse($cookies.plate);

		//place the order
		$scope.placeOrder = function(){
			if($scope.plate){
				
				console.log('User is: ' + Authentication.user.username);
				
				for(var i = 0; i < $scope.plate.length; i++){
					$scope.plate[i].username = Authentication.user.username;
				}
				$http.post('/orders/placeOrder', $scope.plate).success(function(response) {
					console.log('success');
				}).error(function(response) {
					console.log('error');
				});
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
