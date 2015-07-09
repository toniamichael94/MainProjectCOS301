/**
 * Created by tonia on 2015/07/08.
 */
'use strict';
//reset password
(function() {
    // settings/profile controller Spec
    describe('PasswordController', function() {

        // Initialize global variables
        var PasswordController,
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

            // Initialize the PasswordController controller
            PasswordController = $controller('PasswordController', {
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

        it('$scope.askForPasswordReset() should let valid user get email with instructions to change password', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/auth/forgot').respond(200,'validID');

            scope.askForPasswordReset();
            $httpBackend.flush();

            // Test scope value
            expect(scope.credentials).toEqual(null);
            //expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });

        it('$scope.askForPasswordReset() should fail with error message stating that no account with that username has been found', function() {
            // Test expected POST request
            $httpBackend.expectPOST('/auth/forgot').respond(400, {
                'message': 'No account with that username has been found'
            });

            scope.askForPasswordReset();
            $httpBackend.flush();

            // Test scope value
            expect(scope.error).toEqual('No account with that username has been found');
        });

/*
         it('$scope.resetUserPassword() should allow user to reset password', function() {
            // Test expected GET request
          //  $httpBackend.when('POST',	'/auth/reset').respond(200,'toniamichael, toniamichael');
          //   scope.authentication.user = 'Foo';
          //   scope.credentials = 'Bar';
             $httpBackend.expectPOST('/auth/reset').respond(200, 'thgjukjkiu');

            scope.resetUserPassword();
            $httpBackend.flush();

            // Test scope value
            expect(scope.passwordDetails).toEqual(null);
            // expect(scope.success).toEqual(false);
            //expect(scope.error).toEqual('Password should be at least 7 characters long.');
             expect($location.url()).toEqual('/password/reset/success');
        });

*/

    });
}());
