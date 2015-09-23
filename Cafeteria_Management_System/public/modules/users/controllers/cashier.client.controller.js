'use strict';

// Cashier controller
angular.module('users').controller('cashierController', ['$scope', '$http', '$stateParams', '$location', '$window', 'Authentication',
	function($scope, $http, $stateParams, $location, $window, Authentication) {
		$scope.authentication = Authentication;
		
		$scope.orderNums = new Array();
		
		$scope.getOrders = function(){
			$http.post('/orders/getOrderList').success(function(response){
				$scope.orders = response.message;
				for(var i = 0; i < $scope.orders.length; i++){
					$scope.orders[i].paymentMethod = "cash";
				}
				console.log('aaaa');
				var currOrder = -1, currentCount = -1;
				
				var j = 0;
				while(j < $scope.orders.length){
					currOrder = $scope.orders[j].orderNumber;
					$scope.orderNums.push();
					currentCount++;
					var arrObj = {orderNum: 0, username: '', items: [], status: '', paymentMethod: ''};
					arrObj.orderNum = $scope.orders[j].orderNumber;
					arrObj.username = $scope.orders[j].username;
					arrObj.status = $scope.orders[j].status;
					$scope.orderNums[currentCount] = arrObj;
					console.log($scope.orderNums[j]);
					while(j < $scope.orders.length && currOrder == $scope.orders[j].orderNumber){
						$scope.orderNums[currentCount].items.push($scope.orders[j]);
						j++;
					}
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
			}); location.reload(true);
		};

        $scope.markAsCollected = function(username, itemName,orderNumber){
            console.log(username  + ' ' +itemName + orderNumber);

            $http.post('orders/markAsCollected',{uname : username, orderNum: orderNumber,item : itemName}).success(function(response){

            }).error(function(response){

            }); location.reload(true);
        };

        $scope.markAsPaid = function(order){
			if(order.paymentMethod === ''){
				alert('Please select a payment method');
				return;
			}
			
			
			$http.post('orders/markAsPaid',{username : order.username, orderNum: order.orderNum, method: order.paymentMethod }).success(function(response){
				location.reload(true);
            }).error(function(response){
				alert(response.message);
            });
        };

        $scope.checkUser = function(){
            if((Authentication.user && Authentication.user.roles[0] !== 'cashier') || (!Authentication.user))
                $location.path('/');
        };
	}
]);
