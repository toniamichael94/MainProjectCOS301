'use strict';

angular.module('users').controller('superuserController', ['$scope', '$http', '$location', '$window', 'Users', 'Authentication',
	function($scope, $http, $location, $window, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
	//	if (!$scope.user) $location.path('/');

		// Assign a role to user - as the super user
		$scope.assignRoles = function(isValid) {
		  if (isValid) {

			BootstrapDialog.confirm({
            title: 'WARNING',
            message: 'Changin a role will change the users acces to certain features of the system. Are you sure you want to continue? ',
            type: BootstrapDialog.TYPE_DANGER,
            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            btnCancelLabel: 'Cancel', // <-- Default value is 'Cancel',
            btnOKLabel: 'Continue', // <-- Default value is 'OK',
						callback: function(result) {
                // result will be true if button was click, while it will be false if users close the dialog directly.
                if(result) {
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
                }else {
                      $scope.emp_id = $scope.role = null;
                }
            }
        });

			$scope.success = $scope.error = null;
			var reqObj = {userID: $scope.emp_id, role: $scope.role};

			}
	};

			//assign Roles - as an admin user role
			$scope.assignRolesAdminRole = function(isValid) {
				if (isValid) {
				$scope.success = $scope.error = null;
				var reqObj = {userID: $scope.emp_id, role: $scope.role};
                $scope.r = $window.confirm('Are you sure?');

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
		//$scope.currentEmp_id;
        $scope.changeEmployeeID = function(isValid) {
            if (isValid) {
				console.log($scope.currentEmp_id);
                $scope.successOne = $scope.errorOne = null;
                var reqObj = {currentUserID: $scope.currentEmp_id, newUserID: $scope.newEmp_id};
                $scope.r = $window.confirm('Are you sure?');

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
                $scope.r = $window.confirm('Are you sure?');

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
                //$scope.r = $window.confirm("Are you sure?");

                //bootbox.alert('Hello world!');
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
            /*if(isValid){
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
			}*/
		};

		//Set canteen name
		$scope.setCanteenName = function(isValid){
            console.log('Name CLIENT');
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

        //Set contact information
        $scope.setContactInfo = function(isValid){
            console.log('SETTTTTTTT CONTACT INFOOOOOOOOOOOOO CLIENT'+$scope.contactName+$scope.contactNumber+$scope.contactEmail);
            if(isValid){
                $scope.success = $scope.error = null;

                var reqObj =   {name:'Contact Name',value: $scope.contactName};
                $http.post('users/superuserSetContactInfo1', reqObj).success(function (response) {
                    $scope.successSeven = response.message;
                }).error(function (response) {
                    $scope.errorSeven= response.message;
                });

                var reqObj2 = {name:'Contact Number',value: $scope.contactNumber};
                $http.post('users/superuserSetContactInfo2', reqObj2).success(function (response) {
                    $scope.successSeven = response.message;
                }).error(function (response) {
                    $scope.errorSeven= response.message;
                });

                var reqObj3 = {name:'Contact Email',value: $scope.contactEmail};
                $http.post('users/superuserSetContactInfo3', reqObj3).success(function (response) {
                    $scope.successSeven = response.message;
                }).error(function (response) {
                    $scope.errorSeven= response.message;
                });
                //var req2 ={name:'Contact Number',value: $scope.contactNumber};
                //$http.post('users/superuserSetContactInfo', reqObj);
                //var req3 ={name:'Contact Email',value: $scope.contactEmail};
                //$http.post('users/superuserSetContactInfo', reqObj);
            }
        };

        //Set theme name
        $scope.setThemeName = function(){
                $scope.successFive = $scope.errorFive = null;

                var reqObj = {name: 'Theme name', value: $scope.themeName};
                console.log($scope.themeName);var p= $scope.themeName;
                $http.post('/users/superuserSetThemeName', reqObj).success(function (response) {
                    $scope.successFive = 'Colour scheme changed successfully';

                }).error(function (response) {
                    $scope.r = $window.alert('Invalid theme! Choose between red, orange, green, blue and default');
                    $scope.errorFive = response.message;
                    console.log('error ' + response.message);
                });
        };
        /**
         * Created by tonia on 2015/10/16.
         */
            //getContactInfo
        $scope.getContactInfo = function(){
            $http.get('users/superuserGetContactInfo').success(function(response){
                console.log("response.val"+response.val);
                $scope.success = response.val;
            }).error(function(response){
                console.log(response.message);
            });

        };
//getContactInfo
        $scope.getContactInfo2 = function(){
            $http.get('users/superuserGetContactInfo2').success(function(response){
                console.log("response.val"+response.val);
                $scope.success2 = response.val;
            }).error(function(response){
                console.log(response.message);
            });

        };
//getContactInfo
        $scope.getContactInfo3 = function(){
            $http.get('users/superuserGetContactInfo3').success(function(response){
                console.log("response.val"+response.val);
                $scope.success3 = response.val;
            }).error(function(response){
                console.log(response.message);
            });

        };

		//Delete Carousel Image
		$scope.deleteCarouselImage = function(isValid){
			console.log('deleteing image');
			$http.post('/users/superuserDeleteImage', {image: $scope.imageToDelete}).success(function(response){
				$scope.success = response.messge;
			}).error(function(response){
				$scope.error = response.message;
			})
		}

        $scope.checkUser = function(){
            if((!$scope.user) || ($scope.user && (Authentication.user.roles[0] !== 'superuser' || Authentication.user.roles[0] !== 'superuser')))
                $location.path('/');
        };

        $scope.checkAUser = function(){
            if(($scope.user && Authentication.user.roles[0] !== 'admin') || ($scope.user && Authentication.user.roles[0] !== 'admin') || (!$scope.user))
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
                    console.log('Superuser: '+ empID);
                }
                $scope.employees = empArr;
            }).error(function(response) {
                $scope.employees = 'Error loading employees';
            });
        };
		//Load audit type
		$scope.auditTypes = [];
		$scope.getAuditTypes = function(){
			$http.get('/users/superuserGetAuditTypes').success(function(response){
				$scope.auditTypes.push('all');
				$scope.auditTypes = $scope.auditTypes.concat(response.message);
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		//Load audits
		$scope.audits = [];
		$scope.current_auditType;
		$scope.curent_toDate;
		$scope.curent_fromDate;
		$scope.noResults = false;

		//Arrays for dates
		var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var months = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];

		$scope.getAudits = function(isValid){
			if(isValid){
				var toDate = new Date($scope.current_toDate);
				toDate.setHours(23,59,59);

				$http.post('/users/superuserGetAudits', {type: $scope.current_auditType, from:$scope.current_fromDate, to: toDate}).success(function(response){
                    $scope.audits = response.message;
                    $scope.noResults = false;
                    if($scope.audits.length === 0){
                        $scope.noResults = true;
                    }
					//Set Readable Date for table
					for(var audit in $scope.audits){
					var temp = new Date($scope.audits[audit].date);
					$scope.audits[audit].date = days[temp.getDay()] + ' ' + months[temp.getMonth()] + ' ' + temp.getDay() + ', ' + temp.getFullYear() + ' ' +
															temp.getHours() + ':' + temp.getMinutes() + ':' + temp.getSeconds();
					}
				}).error(function(response){
					$scope.error = response.message;
				});
			}
		};
    }
]);
