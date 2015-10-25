/**
 * Created by tonia on 2015/07/08.
 */
'use strict';

(function() {
    // settings/profile controller Spec
    describe('superuserController', function() {

        // Initialize global variables
        var superuserController,
            scope,
            $httpBackend,
            $stateParams,
            $location,
			$window;

        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$window_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
			$window = _$window_;
            // Initialize the SettingsController controller
            superuserController = $controller('superuserController', {
                $scope: scope
            });
        }));


		//****************************Assign Roles
    /*    it('$scope.assignRoles() should let superuser assign roles', function() {
            // Test expected GET request
             $httpBackend.expectPOST('/users/superuserAssignRoles').respond(200, {'message': 'Role has been successfully assigned'});
             scope.r=true;
            scope.assignRoles(true);
           $httpBackend.flush();

            expect(scope.success).toEqual('Role has been successfully assigned');
        });

        it('$scope.assignRoles() should not let superuser assign roles', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserAssignRoles').respond(400, {'message': 'No such user'});
            scope.assignRoles(true);
            $httpBackend.flush();

            expect(scope.error).toEqual('No such user');
        });
		
		it('$scope.assignRoles() should redirect if superuser role is assigned', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserAssignRoles').respond(200, {'message': 'SU changed'});
            scope.assignRoles(true);
            $httpBackend.flush();

            expect($location.url()).toBe('/');
        });*/
		
		//**********************************change system limit
   /*     it('$scope.setSystemWideLimit() should let superuser set limit', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'users/superuserSetSystemWideLimit').respond(200, {'message': 'Limit has been successfully changed.'});

            scope.setSystemWideLimit(true);
           $httpBackend.flush();

            expect(scope.successTwo).toEqual('Limit has been successfully changed.');
        });*/
		
		//********************************change employee ID
        it('$scope.changeEmployeeID() should show error if the user is not in the database', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserChangeEmployeeID').respond(400, {'message': 'No such user'});
          
			$window.confirm = function(mess){return true;};
			scope.currentEmp_id = '12345';
			scope.newEmp_id = '0000';
			scope.changeEmployeeID(true);
			
            $httpBackend.flush();

            expect(scope.errorOne).toEqual('No such user');
        });

        it('$scope.changeEmployeeID() should change employee ID', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserChangeEmployeeID').respond(200, {'message': 'Employee ID has been successfully changed.'});
            
			$window.confirm = function(mess){return true;};
			scope.currentEmp_id = '12345';
			scope.newEmp_id = '0000';
			scope.changeEmployeeID(true);
			
            $httpBackend.flush();

            expect(scope.successOne).toEqual('Employee ID has been successfully changed.');
        });
		
		//*********************************change Canteen Name
		it('$scope.setCanteenName() should let superuser set canteen name', function() {
            // Test expected GET request
            $httpBackend.expectPOST('users/superuserSetCanteenName').respond(200, {'message': 'Canteen name changed.'});

			
			scope.canteenName = 'My Cafe';
            scope.setCanteenName(true);
            $httpBackend.flush();

            expect(scope.successThree).toEqual('Canteen name changed.');
        });
		
		it('$scope.setCanteenName() should show error if canteen name not changed', function() {
            // Test expected GET request
            $httpBackend.expectPOST('users/superuserSetCanteenName').respond(400, {'message': 'Canteen name not changed.'});

			
			scope.canteenName = 'My Cafe';
            scope.setCanteenName(true);
            $httpBackend.flush();

            expect(scope.errorThree).toEqual('Canteen name not changed.');
        });

		//************************************search employee
		it('$scope.searchEmployee() should search for employee by ID', function() {
            // Test expected GET request
            $httpBackend.when('POST', '/users/search').respond(200, {'message': 'This user has been found'}
             );
			scope.currentEmp_id = '1234';
            scope.searchEmployee(true);
            $httpBackend.flush();

              expect(scope.success).toEqual('This user has been found');
        });
		
		it('$scope.searchEmployee() should not search for employee by ID', function() {
            // Test expected GET request
            $httpBackend.when('POST', '/users/search').respond(400, {'message': 'No account with that username has been found'}
             );
			scope.currentEmp_id = 'non existent acc';
            scope.searchEmployee(true);
            $httpBackend.flush();

              expect(scope.error).toEqual('No account with that username has been found');
        });
		
		it('$scope.searchEmployee() should NOT search for employee if emp_id blank', function() {
            // Test expected GET request
            $httpBackend.when('POST', '/users/search').respond(400, {'message': 'Username field must not be blank'}
             );
			scope.currentEmp_id = null;
            scope.searchEmployee(true);
            $httpBackend.flush();

              expect(scope.error).toEqual('Username field must not be blank');
        });
		
		//*****************************************Remove Employee
		it('$scope.remvoveEmployee() should show success if employee removed', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserRemoveEmployee').respond(200, {'message': 'Employee removed.'});

			$window.confirm = function(mess){return true;};
			scope.empId = '12345';
            scope.removeEmployee(true);
			
            $httpBackend.flush();

            expect(scope.successFour).toEqual('Employee removed.');
        });
		
		it('$scope.remvoveEmployee() should show error if employee not removed', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserRemoveEmployee').respond(400, {'message': 'Employee not removed.'});

			$window.confirm = function(mess){return true;};
			scope.empId = '12345';
            scope.removeEmployee(true);
			
            $httpBackend.flush();

            expect(scope.errorFour).toEqual('Employee not removed.');
        });

    });
}());
