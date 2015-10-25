'use strict';
/*
    Controller: Cashier client controller
 */
angular.module('users').controller('cashierController', ['$scope','$rootScope', '$http', '$stateParams', '$location', '$window', 'Authentication',
	function($scope, $rootScope,$http, $stateParams, $location, $window, Authentication) {
		$scope.authentication = Authentication;
		
		$scope.orderNums = [];
        	$scope.notifications = [];

        /*
         Function name: Get Orders
         @params: n/a
         @return: n/a
         */
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
					console.log('status ' + arrObj.created);
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

        /*
         Function name: Mark as Ready
         @params: JSONObject _username, JSONObject _orderNumber, JSONObject _created
         @return: n/a
         */
        $scope.markAsReady = function(_username, _orderNumber, _created){
            $scope.success = $scope.error = null;
			//console.log(_username + ' ' + _orderNumber + ' ' + _created);
            if(_username === undefined || _orderNumber === undefined || _created === undefined)
            {
                alert('Invalid parameters');
                return;
            }	
            $http.post('orders/markAsReady',{username : _username, orderNumber: _orderNumber, created: _created}).success(function(response){
                //console.log("Ready " + response.message);
                $scope.success = response.message;
                $scope.newMessage();
                //$rootScope.$broadcast('newMess');
                $window.location.reload();
            }).error(function(response){
                $scope.error = response.message;
            }); 
        };

        /*
         Function name: Get User notifications
         @params: n/a
         @return: n/a
         */
        $scope.getUserNotifications = function() {
            $scope.success = $scope.error = null;

            $http.post('/orders/getUserNotifications').success(function (response) {
                console.log("Notification " + response.message);
                $scope.notifications = response.message;

                //var currNotification = -1;
                var currentCount = -1;
				
				//Arrays for dates
				var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
				var months = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
				for(var j = 0; j < $scope.notifications.length; j++){
					//Set Date to readable format
					var temp = new Date($scope.notifications[j].date);
					$scope.notifications[j].date = days[temp.getDay()] + ' ' + months[temp.getMonth()] + ' ' + temp.getDate() + ', ' + temp.getFullYear() + ' ' +
															temp.getHours() + ':' + temp.getMinutes() + ':' + temp.getSeconds();
				}
				
				/*
                var j = 0;
                while (j < $scope.userNotification.length) {
                    //currNotification = $scope.userNotification[j].orderNumber;
                    $scope.notifications.push();
                    currentCount++;
                    var arrObj = {username: '', subject: '', message: '', date: Date.now()};
                    arrObj.username = $scope.userNotification[j].username;
                    arrObj.subject = $scope.userNotification[j].subject;
                    arrObj.message = $scope.userNotification[j].message;
                    
					//arrObj.date = $scope.userNotification[j].date;
					//Set Date to readable format
					var temp = new Date($scope.userNotification[j].date);
					arrObj.date = days[temp.getDay()] + ' ' + months[temp.getMonth()] + ' ' + temp.getDay() + ', ' + temp.getFullYear() + ' ' +
															temp.getHours() + ':' + temp.getMinutes() + ':' + temp.getSeconds();
					
					
                    $scope.userNotification[currentCount] = arrObj;
                    //console.log('status ' + arrObj.status);
                    console.log(currentCount);
                    while (j < $scope.userNotification.length) {// && currNotification === $scope.userNotification[j].orderNumber){
                        console.log(currentCount);
                        $scope.notifications.push($scope.userNotification[j]);
                        j++;
                    }
                }
                $scope.success = null;//response.message;*/
            }).error(function (response) {
                console.log('Error getting notifications');
                $scope.error = response.message;
            });
        }

        /*
         Function name: Mark as Paid
         @params: JSONObject order
         @return: null
         */
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

        /*
         Function name: New message
         @params: n/a
         @return: n/a
         */
        $scope.newMessage = function(){
            $rootScope.$broadcast('newMess');
        };

        /*
         Function name: Ready
         @params: JSONObject _username, JSONObject _orderNumber
         @return: n/a
         */
        $scope.ready = function(_username, _orderNumber){
            $scope.markAsReady(_username, _orderNumber);
        };

        /*
         Function name: read Message
         @params: n/a
         @return: n/a
         */
        $scope.readMessage = function(){
            $rootScope.$broadcast('messRead');
        };

        /*
         Function name: Check User
         @params: n/a
         @return: n/a
         */
         $scope.checkUser = function(){
            if((Authentication.user && Authentication.user.roles[0] !== 'cashier') || (!Authentication.user))
                $location.path('/');
       };
    }
]);
