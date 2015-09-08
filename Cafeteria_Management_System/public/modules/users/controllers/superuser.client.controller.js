'use strict';

angular.module('users').controller('superuserController', ['$scope', '$http', '$location', '$window', 'Users', 'Authentication',
	function($scope, $http, $location, $window, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Assign a role to user - as the super user
		$scope.assignRoles = function(isValid) {
		  if (isValid) {
			//	BootstrapDialog.confirm('Hi Apple, are you sure?');
			$scope.success = $scope.error = null;
			var reqObj = {userID: $scope.emp_id, role: $scope.role};
              $scope.r = $window.confirm("Are you sure?");

              if($scope.r === true) {
                  $http.post('/users/superuserAssignRoles', reqObj).success(function (response) {
                      if (response.message === 'SU Changed') {
                          $window.location.href = '/';
                      }

                      // If successful show success message and clear form
                      $scope.success = response.message;
                      $scope.emp_id = $scope.role = null;


                  }).error(function (response) {
                      $scope.error = response.message;
                  });
              }
              else{
                  $scope.emp_id = $scope.role = null;
              }
			}
		  };

			//assign Roles - as an admin user role
			$scope.assignRolesAdminRole = function(isValid) {
				if (isValid) {
				$scope.success = $scope.error = null;
				var reqObj = {userID: $scope.emp_id, role: $scope.role};
                $scope.r = $window.confirm("Are you sure?");

                if($scope.r === true) {
                    $http.post('/users/adminUserAssignRoles', reqObj).success(function (response) {
                        if (response.message === 'Admin Changed') {
                            $window.location.href = '/';
                        }
                        else {
                            // If successful show success message and clear form
                            $scope.success = response.message;
                            $scope.emp_id = $scope.role = null;
                        }
                    }).error(function (response) {
                        $scope.error = response.message;
                    });
                }
                else{
                    $scope.emp_id = $scope.role = null;
                }
				}
				};

        //Change user's employee ID
        $scope.changeEmployeeID = function(isValid) {
            if (isValid) {
                $scope.successOne = $scope.errorOne = null;
                var reqObj = {currentUserID: $scope.currentEmp_id, newUserID: $scope.newEmp_id};
                $scope.r = $window.confirm("Are you sure?");

                if($scope.r === true) {
                    $http.post('/users/superuserChangeEmployeeID', reqObj).success(function (response) {
                        // If successful show success message and clear form
                        $scope.successOne = response.message;
                        $scope.currentEmp_id = $scope.newEmp_id = null;
                    }).error(function (response) {
                        $scope.errorOne = response.message;
                    });
                }
                else{
                    $scope.currentEmp_id = $scope.newEmp_id = null;
                }
            }
        };

        //Remove user from the database
        $scope.removeEmployee = function(isValid) {
            if (isValid) {
                $scope.successFour = $scope.errorFour = null;
                var reqObj = {userID: $scope.empId};
                $scope.r = $window.confirm("Are you sure?");

                if($scope.r === true) {
                    $http.post('/users/superuserRemoveEmployee', reqObj).success(function (response) {
                        // If successful show success message and clear form
                        $scope.successFour = response.message;
                        $scope.empId = null;
                    }).error(function (response) {
                        $scope.errorFour = response.message;
                    });
                }
                else{
                    $scope.empId = null;
                }
            }
        };

            // Search a user profile
        $scope.searchEmployee = function(isValid) {
            if(isValid){
                $scope.success = $scope.error = null;

                var reqObj = {username: $scope.currentEmp_id};
                $http.post('/users/search', reqObj).success(function(response){
                    $scope.success = response.message;
                }).error(function(response){
                    $scope.error = response.message;
                });
            }
        };

        //filter employee ID
        $scope.searchEmployeeID = function(row) {
            //Filter Menu items for search bar
                var empID = $scope.currentEmp_id.toLowerCase();
                if ((angular.lowercase(row.username)).contains(empID)) {
                    return (angular.lowercase(row.username));
                }
        };

        //Set system limit
		$scope.setSystemWideLimit = function(isValid){
			if(isValid){
				$scope.success = $scope.error = null;
				$scope.successTwo = $scope.errorTwo = null;

				var reqObj = {name: 'System wide limit', value: $scope.limit};
                $scope.r = $window.confirm("Are you sure?");

                if($scope.r === true) {
                    //console.log($scope.limit);
                    $http.post('users/superuserSetSystemWideLimit', reqObj).success(function (response) {
                        $scope.successTwo = response.message;
                    }).error(function (response) {
                        $scope.errorTwo = response.message;
                    });
                }
                else{
                    $scope.limit = null;
                }
			}
		};

		//Set canteen name
		$scope.setCanteenName = function(isValid){
			if(isValid){
				$scope.success = $scope.error = null;
				$scope.successTwo = $scope.errorTwo = null;

				var reqObj = {name: 'Canteen name', value: $scope.canteenName};
                    //console.log($scope.canteenName);
                    $http.post('users/superuserSetCanteenName', reqObj).success(function (response) {
                        $scope.successThree = response.message;
                    }).error(function (response) {
                        $scope.errorThree = response.message;
                    });
                }
		};

        $scope.checkUser = function(){
            if(($scope.user && Authentication.user.roles[0] !== 'superuser') || ($scope.user && Authentication.user.roles[0] !== 'superuser') || (!$scope.user))
                $location.path('/');
        };

        // Loading the items from the inventory to display in the add ingredients of the menu items being added
        $scope.loadEmployees = function(){
            $http.get('/loadEmployees').success(function(response) {
                $scope.employees = response.message;
                var empArr = [];
                var counter = 0;

                for(var empID in response.message){
                    empArr[counter] = response.message[empID];
                    counter++;
                    console.log("Superuser: "+ empID);
                }
                $scope.employees = empArr;
            }).error(function(response) {
                $scope.employees = 'Error loading employees';
            });
        };
    }
]);
