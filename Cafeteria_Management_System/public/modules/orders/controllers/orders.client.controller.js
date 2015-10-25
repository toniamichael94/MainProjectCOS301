'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$rootScope','$http', '$stateParams', '$location', '$cookies', '$window', 'Authentication', 'Orders',
	function($scope, $rootScope, $http, $stateParams, $location, $cookies, $window, Authentication, Orders) {
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
				if($scope.authentication.user){
					if(($scope.authentication.user.limit - $scope.authentication.user.currentBalance) < $scope.orderTotal){
						var avail = $scope.authentication.user.limit - $scope.authentication.user.currentBalance;
						var choice = $window.confirm('You do not have enough credit to make purchase. Available credit: R' + avail + '. Place order with cash payment instead?');

						if(choice === false)
							return;
					}
					for(var i = 0; i < $scope.plate.length; i++){
						$scope.plate[i].username = $scope.authentication.user.username;
					}
					$scope.success = $scope.error = null;
					var order = {
						plate: $scope.plate,
						paymentMeth: $scope.paymentMethod
					};
					$http.post('/orders/placeOrder', order).success(function(response) {
						$scope.plate = [];
						$cookies.plate = JSON.stringify([]);

						var ingredients = [];
						var quantities = [];
						var i;

						for(i = 0; i != order.plate.length; i++)
						{
							for(var j = 0; j != order.plate[i].ingredients.length; j++)
							{
								var ingredient = order.plate[i].ingredients[j].substring(0, order.plate[i].ingredients[j].indexOf("(")-1);
								var quantity = order.plate[i].quantities[j];
								quantity = quantity*order.plate[i].quantity*-1;

								var found = false;
									for(var k = 0; k !== ingredients.length; k++)
									{
										if(ingredients[k] === ingredient)
										{
											quantities[k] = quantities[k] + quantity;
											found = true;
											break;
										}
									}

									if(!found || ingredients.length <= 0)
									{
										ingredients.push(ingredient);
										quantities.push(quantity);
									}
							}
						}

						for(var j = 0; j !== ingredients.length; j++)
						{
							var reqObj = {productName:ingredients[j], quantity:quantities[j]};
							$http.post('/orders/decreaseInventory',reqObj).success(function(response){
							//if(!error)
							//{
								console.log('Decreased inventory item.');
							//}
							}).error(function(response){
								console.log('Error.'+response.message);
								//error = true;
							});
						}//end for

						$scope.subTotal();
						$rootScope.$broadcast('plateUpdated');
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
			itemName = itemName.toLowerCase();
			if($cookies.plate){
				var plate = JSON.parse($cookies.plate);

				for(var i = 0; i < plate.length; i++){
					if(plate[i].itemName === itemName.toLowerCase()){
						plate.splice(i,1);
						$cookies.plate = JSON.stringify(plate);
						break;
					}
				}
				$window.location.reload(true);
				//$scope.subTotal();
				//$rootScope.$broadcast('plateUpdated');
			}
		};
 
		$scope.newMessage = function(){
	            $rootScope.$broadcast('newMess');
	        };

	        $scope.pOrder = function(){
	            $scope.placeOrder();
	            $scope.newMessage();
	        };

	        /*$scope.readMessage = function(){
	            $rootScope.$broadcast('messRead');
	        };*/
		/*
		$scope.showRadio = function(){
			return $scope.plate.length > 0
		};

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
