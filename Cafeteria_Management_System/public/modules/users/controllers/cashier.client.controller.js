'use strict';

// Cashier controller
angular.module('users').controller('cashierController', ['$scope', '$http', '$stateParams', '$location', 'Authentication',
	function($scope, $http, $stateParams, $location, Authentication) {
		$scope.authentication = Authentication;
	
		$scope.getOrders = function(){
			console.log('hi');
			
			$http.get('/orders/getOrders').success(function(response){
				console.log('success' + response.message);
				$scope.orders = response.message;
			}).error(function(response){
				console.log('error' + response.message);
			});
		};
	
	
	
	}
]);