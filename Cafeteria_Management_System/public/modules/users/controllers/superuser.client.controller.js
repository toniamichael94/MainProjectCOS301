'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

    // If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

    // Update a user profile
    $scope.assignRoles = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var reqObj = {userID: $scope.emp_id, role: $scope.role};
//        reqObj.userID = $scope.userID;
//        reqObj.role = $scope.role;

        $http.post('/users/superuserAssignRoles', reqObj).success(function(response) {
          // If successful show success message and clear form
        //  alert('hello' + response.data.message);
				//console.log(response.message);
        $scope.success = response.message;
        }).error(function(response) {
          $scope.error = response.message;
        });
        }
      };
    }
]);
