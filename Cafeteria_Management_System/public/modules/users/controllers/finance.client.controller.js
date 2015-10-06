'use strict';

angular.module('users').controller('FinanceController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
    function($scope, $http, $location, $stateParams, Authentication) {
        //$scope.user = Authentication.user;
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication) $location.path('/');


        // Search a user profile
        /*$scope.searchEmployee = function(isValid) {
            if(isValid){
                $scope.success = $scope.error = null;

                var reqObj = {username: $scope.username};
                    $http.post('/orders/getUserOrders', reqObj).success(function(response){
                        $scope.orders = response.message;
                    }).error(function(response){
                        $scope.error = response.message;
                    });
            }
        };*/
	
      /*
        $scope.getUserOrders = function(){
            var reqObj = {username: $scope.username};
            var orders = new Array();
            $http.post('/orders/getUserOrders', reqObj).success(function(response){
                console.log(response.message);
                if(response.message.length < 1){
                    $scope.success = false;
                    $scope.error = true;//response.message;
                    $scope.error = "That user has no orders";//response.message;
                }
                else{
                    $scope.error = false;
                    $scope.success = true;
                    for(var i = 0; i < response.message.length; i++){
                        orders[i] = response.message[i];
                    }
                    $scope.success = orders;
                    console.log(orders);


                }
                //console.log('success2' + response.message);

                //$scope.success = response.message;
            }).error(function(response){
                //console.log('error' + response.message);
                $scope.success = false;
                $scope.error = true;//response.message;
                $scope.error = "could not get orders";//response.message;
            });
        };*/
		
		$scope.generateReport = function(){
			$scope.error = $scope.success = null;
			if($scope.username === '' || $scope.startDate === '' || $scope.endDate === '')
			{
				$scope.error = 'Please fill in all fields'
				return;
			}
			var toDate = new Date($scope.current_toDate);
			toDate.setHours(23,59,59);
			
			$http.post('users/finance/generateReportUser',{username: $scope.username, start: $scope.startDate, end: $scope.endDate},{responseType:'arraybuffer'}).success(function(response){
				
				var file = new Blob([response], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);
				
				var fileName = 'test.pdf';
				var a = document.createElement('a');
				document.body.appendChild(a);
				a.setAttribute('style', 'display: none');

				a.href =  fileURL;
                a.download = fileName;
                a.click();
				$scope.success = 'Report generated';
			}).error(function(response){
				$scope.success = '';
				$scope.error = 'Could not generate report';
			});
		};
		
		$scope.generateReportAll = function(){
			$http.post('users/finance/generateReportAll').success(function(response){
				console.log(response);
			}).error(function(response){
				
				console.log(response);
			})
		};

        $scope.checkUser = function(){
            if((!Authentication.user) || (Authentication.user && Authentication.user.roles[0] !== 'finance')){
                $location.path('/');
            }
        };
    }
]);
