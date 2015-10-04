'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$cookies', 'Authentication',
	function($scope, $http, $location, $cookies, Authentication) {
		$scope.authentication = Authentication;
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

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

        //Get system wide limit
        $scope.getSystemLimit = function(){
            $http.get('/users/getSystemLimit').success(function(response){
                angular.element(document.querySelector('#limit')).attr('max', parseInt(response.val));
                $scope.success = response.val;
            }).error(function(response){
                console.log(response.message);
            });
        };
/*
        $scope.loadSystemLimit = function(){
            $http.get('/users/getSystemLimit').success(function(response) {
                // If successful show success message and clear form
                $scope.limit = response.message.value;

            }).error(function(response) {
                $scope.limit = 'error';
            });
        };
*/
		$scope.signin = function() {
			//console.log('checking for superUser role');
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
              /*  }
                else if(roles[0]==='superuser'){
                    $location.path('/superuser');
                }
                else if(roles[0]==='cafeteriaManager'){
                    $location.path('/cafeteriaManager');
                }
                else if(roles[0]==='cashier'){
                    $location.path('/cashier');
                }
                else if(roles[0]==='finance'){
                    $location.path('/finance');
                }*/
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
