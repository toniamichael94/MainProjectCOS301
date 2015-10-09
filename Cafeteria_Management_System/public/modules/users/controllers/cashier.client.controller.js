'use strict';

// Cashier controller
angular.module('users').controller('cashierController', ['$scope', '$http', '$stateParams', '$location', '$window', 'Authentication',
	function($scope, $http, $stateParams, $location, $window, Authentication) {
		$scope.authentication = Authentication;
		
		$scope.orderNums = new Array();
        	$scope.notifications = new Array();
		
		$scope.getOrders = function(){
			$http.post('/orders/getOrderList').success(function(response){
				console.log(response.message);
				$scope.orders = response.message;
				for(var i = 0; i < $scope.orders.length; i++){
					$scope.orders[i].paymentMethod = "cash";
				}
				
				var currOrder = -1, currentCount = -1;
				
				var j = 0;
				while(j < $scope.orders.length){
					currOrder = $scope.orders[j].orderNumber;
					$scope.orderNums.push();
					currentCount++;
					var arrObj = {orderNum: 0, username: '', items: [], status: '', paymentMethod: '', created: ''};
					arrObj.orderNumber = $scope.orders[j].orderNumber;
					arrObj.created = $scope.orders[j].created;
					arrObj.username = $scope.orders[j].username;
					arrObj.status = $scope.orders[j].status;
					$scope.orderNums[currentCount] = arrObj;
					console.log('status ' + arrObj.status);
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
		
		$scope.markAsReady = function(_username, _orderNumber, _created){
			$scope.success = $scope.error = null;
			
			if(_username === '' || _orderNumber === '' || _orderNumber === null || _username === null || _orderNumber === undefined || _username === undefined)
			{
				alert('Invalid parameters');
				return;
			}
			console.log(_username + ' ' + _orderNumber + ' ' + _created);
			$http.post('orders/markAsReady',{username : _username, orderNumber: _orderNumber, created: _created}).success(function(response){
				$scope.success = response.message;
				$window.location.reload();
			}).error(function(response){
				$scope.error = response.message;
			}); 
		};

     /*   $scope.markAsCollected = function(username, itemName,orderNumber){
            console.log(username  + ' ' +itemName + orderNumber);

            $http.post('orders/markAsCollected',{uname : username, orderNum: orderNumber,item : itemName}).success(function(response){

                var currOrder = -1, currentCount = -1;

                var j = 0;
                while(j < $scope.orders.length){
                        currOrder = $scope.orders[j].orderNumber;
                        $scope.orderNums.push();
                        currentCount++;
                        var arrObj = {orderNum: 0, username: '', items: [], status: '', paymentMethod: ''};
                        arrObj.orderNumber = $scope.orders[j].orderNumber;
                        arrObj.username = $scope.orders[j].username;
                        arrObj.status = $scope.orders[j].status;
                        $scope.orderNums[currentCount] = arrObj;
                        console.log('status ' + arrObj.status);
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
*/
        $scope.markAsReady = function(_username, _orderNumber){
            $scope.success = $scope.error = null;

            if(_username === '' || _orderNumber === '' || _orderNumber === null || _username === null || _orderNumber === undefined || _username === undefined)
            {
                alert('Invalid parameters');
                return;
            }	
            $http.post('orders/markAsReady',{username : _username, orderNumber: _orderNumber}).success(function(response){
                //console.log("Ready " + response.message);
                //$('div.notification').text(response.message);
                $scope.success = response.message;
                $scope.newMessage();
                //newMessage();
                //$rootScope.$broadcast('newMess');
                $window.location.reload();
            }).error(function(response){
                $scope.error = response.message;
            }); 
        };

        $scope.getUserNotifications = function() {
            $scope.success = $scope.error = null;

            $http.post('/orders/getUserNotifications').success(function (response) {
                console.log("Notification " + response.message);
                //$('div.notification').text(response.message);
                $scope.userNotification = response.message;

                //var currNotification = -1;
                var currentCount = -1;

                var j = 0;
                while (j < $scope.userNotification.length) {
                    //currNotification = $scope.userNotification[j].orderNumber;
                    $scope.notifications.push();
                    currentCount++;
                    var arrObj = {username: '', subject: '', message: '', date: Date.now()};
                    arrObj.username = $scope.userNotification[j].username;
                    arrObj.subject = $scope.userNotification[j].subject;
                    arrObj.message = $scope.userNotification[j].message;
                    arrObj.date = $scope.userNotification[j].date;
                    $scope.userNotification[currentCount] = arrObj;
                    //console.log('status ' + arrObj.status);
                    console.log(currentCount);
                    while (j < $scope.userNotification.length) {// && currNotification === $scope.userNotification[j].orderNumber){
                        console.log(currentCount);
                        $scope.notifications.push($scope.userNotification[j]);
                        j++;
                    }
                }
                $scope.success = null;//response.message;
            }).error(function (response) {
                console.log('Error getting notifications');
                $scope.error = response.message;
            });
        }

        $scope.markAsPaid = function(order){
			$scope.success = $scope.error = null;
			if(order.paymentMethod === ''){
				alert('Please select a payment method');
				return;
			}
			
			$http.post('orders/markAsPaid',{username : order.username, orderNumber: order.orderNumber, method: order.paymentMethod, created: order.created }).success(function(response){
				$scope.success = response.message;
				$window.location.reload(true);
			}).error(function(response){
				alert(response.message);
            });
        };

        $scope.newMessage = function(){
            /*$http.post('/orders/getNrNotifications').success(function(response){
                console.log("Number notification " + response.message);
            }).error(function(response){
                console.log('Error getting number of notifications');
                console.log(response.message);
                //$scope.error = response.message;
            });*/
                            
            $rootScope.$broadcast('newMess');
        };
        
        $scope.ready = function(_username, _orderNumber){
            $scope.markAsReady(_username, _orderNumber);
            //$scope.newMessage(); 
        };
        
        $scope.readMessage = function(){
            $rootScope.$broadcast('messRead');
        };

    /*   $scope.markAsCollected = function(username, itemName,orderNumber){
           console.log(username  + ' ' +itemName + orderNumber);

           $http.post('orders/markAsCollected',{uname : username, orderNum: orderNumber,item : itemName}).success(function(response){

           }).error(function(response){

           }); location.reload(true);
       };
   */
       $scope.markAsPaid = function(order){
            $scope.success = $scope.error = null;
            if(order.paymentMethod === ''){
                alert('Please select a payment method');
                return;
            }

            $http.post('orders/markAsPaid',{username : order.username, orderNumber: order.orderNumber, method: order.paymentMethod }).success(function(response){
                $scope.success = response.message;
                $window.location.reload(true);
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
