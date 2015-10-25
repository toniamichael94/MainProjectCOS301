'use strict';
/*
 Controller: Authentication client controller
 */
angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$cookies', 'Authentication',
	function($scope, $http, $location, $cookies, Authentication) {
		$scope.authentication = Authentication;
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

        /*
         Function name: Sign up
         @params: n/a
         @return: n/a
         */
		$scope.signup = function() {

				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;
					// And redirect to the index page
					$location.path('/');
				}).error(function(response) {
					$scope.error = response.message;
				});
		};

        /*
         Function name: Get System Limit
         @params: n/a
         @return: n/a
         */
        $scope.getSystemLimit = function(){
            $http.get('/users/getSystemLimit').success(function(response){
                angular.element(document.querySelector('#limit')).attr('max', parseInt(response.val));
                $scope.success = response.val;
            }).error(function(response){
                console.log(response.message);
            });
        };

		$scope.signin = function() {
			$http.post('/auth/checkSuperUser');
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model

				$scope.authentication.user = response;
				//Redirect to the view order page if orders pending
                if($cookies.plate) {
					if(JSON.parse($cookies.plate).length > 0){
						$location.path('/placeOrder/viewOrders');
					}
					else
						$location.path('/');
				}
				else
					$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
