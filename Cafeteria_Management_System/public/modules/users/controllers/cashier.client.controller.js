'use strict';

// Cashier controller
angular.module('users').controller('cashierController', ['$scope', '$http', '$stateParams', '$location', 'Authentication',
	function($scope, $http, $stateParams, $location, Authentication) {
		$scope.authentication = Authentication;
	
		$scope.getOrders = function(){
			
			$http.post('/orders/getOrderList').success(function(response){
				console.log('hahahahahahhahahahhahaha'+response.message);
				$scope.orders = response.message;
			}).error(function(response){
				console.log('error' + response.message);
                $scope.error=response.message;
			});
		};
		
		$scope.markAsReady = function(username, orderNumber){
			
			$http.post('orders/markAsReady',{uname : username, orderNum : orderNumber}).success(function(response){
				$scope.success = response.message;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

        $scope.markAsCollected = function(username, itemName,orderNumber){
            console.log(username  + ' ' +itemName + orderNumber);

            $http.post('orders/markAsCollected',{uname : username, orderNumber: orderNumber,item : itemName}).success(function(response){

            }).error(function(response){

            }); location.reload(true);
        };

        $scope.markAsPaid = function(username, itemName, orderNumber){
            console.log(username + ' ' + itemName +orderNumber);

            $http.post('orders/markAsPaid',{uname : username, orderNumber:orderNumber, item : itemName }).success(function(response){

            }).error(function(response){

            });location.reload(true);
        };
        $scope.checkUser = function(){
            if((($scope.user && Authentication.user.roles[0] !== 'cashier') || (!$scope.user)) && $location.path('/#!/cashier'))
                $location.path('/');
        }
	
	
	}
]);
