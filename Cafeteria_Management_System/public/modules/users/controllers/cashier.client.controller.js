'use strict';

// Cashier controller
angular.module('users').controller('cashierController', ['$scope', '$http', '$stateParams', '$location', '$window', 'Authentication',
	function($scope, $http, $stateParams, $location, $window, Authentication) {
		$scope.authentication = Authentication;
	
		$scope.getOrders = function(){
			
			$http.post('/orders/getOrderList').success(function(response){
				$scope.orders = response.message;
				for(var i = 0; i < $scope.orders.length; i++){
					$scope.orders[i].paymentMethod = "cash";
				}
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

            $http.post('orders/markAsCollected',{uname : username, orderNum: orderNumber,item : itemName}).success(function(response){

            }).error(function(response){

            }); location.reload(true);
        };

        $scope.markAsPaid = function(username, itemName, orderNumber){
            //console.log(username + ' ' + itemName +orderNumber);
			
			var pMethod;
			if(document.getElementsByName(orderNumber + '-paymentMethod')[0].checked)
				pMethod = document.getElementsByName(orderNumber + '-paymentMethod')[0].value;
			else if(document.getElementsByName(orderNumber + '-paymentMethod')[1].checked)
				pMethod = document.getElementsByName(orderNumber + '-paymentMethod')[1].value;
			else{
				alert('Please select a payment method');
				return;
			}
			
			
			$http.post('orders/markAsPaid',{uname : username, orderNum:orderNumber, method: pMethod }).success(function(response){

            }).error(function(response){

            });location.reload(true);
        };
        $scope.checkUser = function(){
            if((($scope.user && Authentication.user.roles[0] !== 'cashier') || (!$scope.user)) && $location.path('/#!/cashier'))
                $location.path('/');
        }
	
	
	}
]);
