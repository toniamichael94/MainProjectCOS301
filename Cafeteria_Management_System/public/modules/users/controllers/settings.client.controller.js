'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');


		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// view user profile
		$scope.viewUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

        //Get system wide limit
        $scope.getSystemLimit = function(){
            $http.get('/users/getSystemLimit').success(function(response){
                angular.element(document.querySelector('#limit')).attr('max', parseInt(response.val));
            }).error(function(response){
                console.log(response.message);
            });
        };
		
		// Search a user profile
        $scope.searchEmployee = function(isValid) {
            if(isValid){
                $scope.success = $scope.error = null;

                var reqObj = {username: $scope.username};
                $http.post('/users/search', reqObj).success(function(response){
                    $scope.success = response.message;
                }).error(function(response){
                    $scope.error = response.message;
                });
            }
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
                }
                $scope.employees = empArr;
            }).error(function(response) {
                $scope.employees = 'Error loading employees';
            });
        };

        /*exports.loadEmployees = function(req, res){
            User.find({}, function(err, employees) {
                var itemMap = {};

                employees.forEach(function(employees) {
                    itemMap[employees._id] = employees;
                    console.log(employees.username);
                    //console.log(employees.username);
                });
                if(err || !itemMap) return res.status(400).send({message: 'Employees not found' });
                else {
                    console.log('LOAD');
                    //console.log(employees);
                    res.status(200).send({message: itemMap});
                }
            });
        };*/

        $scope.checkUser = function(){
            if(!$scope.user)// && ($location.path === '/#!/settings/password'))
            {
                $location.path('/');
                /*if($location.path === '/#!/settings/password')
                    $location.path('/');
                else if($location.path === '/#!/settings/profileView')
                    $location.path('/');
                else if($location.path === '/#!/settings/profile')
                    $location.path('/');
                else if($location.path === '/#!/manageCafeteria')
                    $location.path('/');
                else if($location.path === '/#!/manageInventory')
                    $location.path('/');
                else if($location.path === '/#!/finance')
                    $location.path('/');*/
            }
            else if(Authentication.user.roles[0] !== 'cafeteriaManager')
            {
                if($location.path ==='/#!/manageCafeteria')
                    $location.path('/');
                else if($location.path === '/#!/manageInventory')
                    $location.path('/');
            }
            else if(((Authentication.user.roles[0] !== 'finance')) && $location.path('/#!/finance'))
                $location.path('/');
        }

        $scope.checkCMUser = function(){
             if(((Authentication.user.roles[0] !== 'cafeteriaManager') || (!$scope.user)))
                $location.path('/');
            /* if(((Authentication.user.roles[0] !== 'cafeteriaManager') || (!$scope.user)))
                $location.path('/');*/
             /*if(((Authentication.user.roles[0] !== 'finance') || (!$scope.user)) && $location.path('/#!/finance'))
                $location.path('/');*/
            /*if(!$scope.user && ($location.path === '/#!/settings/password'))
                $location.path('/');
            if(!$scope.user && ($location.path === '/#!/settings/profileView'))
                $location.path('/');
            if(!$scope.user && ($location.path === '/#!/settings/profile'))
                $location.path('/');
            /*
             <li data-ng-show="">
             <a href="/#!/settings/profileView">View Profile</a>
             </li>
             <li>
             <a href="/#!/settings/profile"> Edit Profile</a>
             </li>
             /*
             <li data-ng-show="authentication.user.roles[0] === 'cashier'">
             <a href="/#!/cashier"> Process Orders </a>
             </li>
             <li data-ng-show="authentication.user.provider === 'local'">
             <a href="/#!/settings/password"> Change Password</a>
             </li>*/
        }
	}
]);
