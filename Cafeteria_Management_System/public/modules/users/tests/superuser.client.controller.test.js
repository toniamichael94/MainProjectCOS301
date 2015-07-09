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
            superuserController = $controller('superuserController', {
                $scope: scope
            });
        }));

        /*  ******
         it('$scope.updateUserProfile() should update profile if valid info entered', function() {
         // Test expected GET request
         //$httpBackend.when('POST',	'/').respond();

         scope.updateUserProfile();
         $httpBackend.flush();

         // Test scope value
         expect(scope.success).toEqual(true);
         //expect($location.url()).toEqual('/');
         });

         it('$scope.updateUserProfile() should allow user to view profile', function() {
         // Test expected GET request
         //  $httpBackend.when('POST',	'/settings/profileView').respond();

         scope.viewUserProfile();
         // $httpBackend.flush();

         // Test scope value
         expect(scope.success).toEqual(true);
         //expect($location.url()).toEqual('/');
         });*/

        it('$scope.assignRoles() should let superuser assign roles', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/superuserAssignRoles').respond(200,'password');

            scope.assignRoles();
            $httpBackend.flush();

            // Test scope value
            //expect(scope.passwordDetails).toEqual(null);
            expect(scope.success).toEqual(null);
            //expect($location.url()).toEqual('/');
        });

        it('$scope.setSystemWideLimit() should let superuser set limit', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'users/superuserSetSystemWideLimit').respond(200, '2000');

            scope.setSystemWideLimit();
            $httpBackend.flush();

            // Test scope value
            // expect(scope.passwordDetails).toEqual(null);
             expect(scope.success).toEqual(null);
            expect(scope.successTwo).toEqual(null);
           // expect(scope.error).toEqual('Password should be at least 7 characters long.');
            //expect($location.url()).toEqual('/');
        });

      /*  it('$scope.setCanteenName() should change canteen name', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'users/superuserSetCanteenName').respond(200, 'YumYum'
             );

            scope.setCanteenName();
            $httpBackend.flush();

            // Test scope value
            //expect(scope.passwordDetails).toEqual(null);
              expect(scope.successThree).toEqual('YumYum');
            // expect(scope.error).toEqual('Missing credentials');
            expect(scope.error).toEqual('Current password is incorrect');
            //expect($location.url()).toEqual('/');
        });*/

        it('$scope.changeUserPassword() should send an error message if the passwords do not match', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Passwords do not match'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            // Test scope value
            //expect(scope.passwordDetails).toEqual(null);
            // expect(scope.success).toEqual(false);
            // expect(scope.error).toEqual('Missing credentials');
            expect(scope.error).toEqual('Passwords do not match');
            //expect($location.url()).toEqual('/');
        });

    });
}());
