'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
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

		$scope.signin = function() {
			//console.log('checking for superUser role');
			$http.post('/auth/checkSuperUser');
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model

				$scope.authentication.user = response;

				// And redirect to the index page
               /// if(roles[0]==='user') {
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
