'use strict';

(function() {
    // settings/profile controller Spec
    describe('SettingsController', function() {

        // Initialize global variables
        var SettingsController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

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
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the SettingsController controller
            SettingsController = $controller('SettingsController', {
                $scope: scope
            });
        }));

/* Commented out for now - will need to check it
      it('$scope.updateUserProfile() should update profile if valid info entered', function() {
            // Test expected GET request
            //$httpBackend.when('POST',	'/').respond();

            scope.updateUserProfile();
           // $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });

        it('$scope.viewUserProfile() should allow user to view profile', function() {
            // Test expected GET request
          //  $httpBackend.when('POST',	'/settings/profileView').respond();

            scope.viewUserProfile();
            // $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });
*/
        it('$scope.changeUserPassword() should let user change their password if a valid one was entered', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(200,'password');

            scope.changeUserPassword();
             $httpBackend.flush();

            // Test scope value
            expect(scope.passwordDetails).toEqual(null);
            expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });

        it('$scope.changeUserPassword() should send an error message if new password is too short', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Password should be at least 7 characters long.'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            expect(scope.error).toEqual('Password should be at least 7 characters long.');
        });

        it('$scope.changeUserPassword() should send an error message if the current password is incorrect', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Current password is incorrect'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            expect(scope.error).toEqual('Current password is incorrect');
        });

        it('$scope.changeUserPassword() should send an error message if the passwords do not match', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Passwords do not match'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            expect(scope.error).toEqual('Passwords do not match');
        });

        it('$scope.searchEmployee() should send an error message if the employee does not exist in the database', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/search').respond(400, {
                'message': 'No account with that username has been found'
            });

            scope.searchEmployee(true);
            $httpBackend.flush();

            expect(scope.error).toEqual('No account with that username has been found');
        });

        it('$scope.searchEmployee() should find the employee if an existing employeeID was typed in', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/search').respond(200,{
                'message': 'This user has been found'
            });

            scope.searchEmployee(true);
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual('This user has been found');
        });
		
		
		/* Last edited by {Rendani Dau}
		 * To be revisited
		it('$scope.getSystemLimit() retrieve the system limit', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/search').respond(200,{
                'message': 'This user has been found'
            });

            scope.searchEmployee(true);
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual('This user has been found');
        });
		
		it('$scope.getSystemLimit() retrieve the system limit', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/search').respond(200,{
                'message': 'This user has been found'
            });

            scope.searchEmployee(true);
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual('This user has been found');
        });
		*/
    });
}());
