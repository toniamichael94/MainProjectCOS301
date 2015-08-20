'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$rootScope','$http', '$stateParams', '$location', '$cookies', 'Authentication', 'Orders',
	function($scope, $rootScope, $http, $stateParams, $location, $cookies, Authentication, Orders) {
		$scope.authentication = Authentication;
		
		$scope.plate = [];
		if($cookies.plate)
			$scope.plate = JSON.parse($cookies.plate);
		$scope.paymentMethod = 'credit';
		
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
		
		$scope.prefChange = function(){
			$cookies.plate = JSON.stringify($scope.plate);
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
			$scope.error = $scope.success = '';
			if($scope.plate){
				if(Authentication.user){
					if((Authentication.user.limit - Authentication.user.currentBalance) < $scope.orderTotal && $scope.paymentMethod == 'credit'){
						var avail = Authentication.user.limit - Authentication.user.currentBalance;
						$scope.error = 'You do not have enough credit to make purchase. Available credit: R' + avail + '. You can place order with cash payment instead';
						return;
					}
					for(var i = 0; i < $scope.plate.length; i++){
						$scope.plate[i].username = Authentication.user.username;
					}
					$scope.success = $scope.error = null;
					var order = {
						plate: $scope.plate,
						paymentMeth: $scope.paymentMethod
					};
					$http.post('/orders/placeOrder', order).success(function(response) {
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
			}
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
		
		$scope.showRadio = function(){
			return $scope.plate.length > 0
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
