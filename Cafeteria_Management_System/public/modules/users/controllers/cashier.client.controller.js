'use strict';

// Cashier controller
angular.module('users').controller('cashierController', ['$scope', '$http', '$stateParams', '$location', 'Authentication',
	function($scope, $http, $stateParams, $location, Authentication) {
		$scope.authentication = Authentication;
	
		$scope.getOrders = function(){
			console.log('hi');
			
			$http.post('/orders/getOrderList').success(function(response){
				console.log('success' + response);
				$scope.orders = response.message;
			}).error(function(response){
				console.log('error' + response.message);
			});
		};
		
		$scope.markAsReady = function(username, itemName){
			console.log(username + ' ' + itemName);
			
			$http.post('orders/markAsReady',{uname : username, item : itemName}).success(function(response){
				
			}).error(function(response){
				
			});
		};

        $scope.checkUser = function(){
            if((($scope.user && Authentication.user.roles[0] !== 'cashier') || (!$scope.user)) && $location.path('/#!/cashier'))
                $location.path('/');
        }
	
	
	}
]);
