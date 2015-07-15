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



        it('$scope.assignRoles() should let superuser assign roles', function() {
            // Test expected GET request
             $httpBackend.expectPOST('/users/superuserAssignRoles').respond(200, {'message': 'Role has been successfully assigned'});
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

        it('$scope.changeEmployeeID() should not change employeeID if the user is not in the database', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserAssignRoles').respond(400, {'message': 'No such user'});
            scope.assignRoles(true);
            $httpBackend.flush();

            expect(scope.error).toEqual('No such user');
        });

        it('$scope.assignRoles() should not let superuser assign roles', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/users/superuserAssignRoles').respond(400, {'message': 'No such user'});
            scope.assignRoles(true);
            $httpBackend.flush();

            expect(scope.error).toEqual('No such user');
        });

        it('$scope.setSystemWideLimit() should let superuser set limit', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'users/superuserSetSystemWideLimit').respond(200, {'message': 'Limit has been successfully changed.'});

            scope.setSystemWideLimit(true);
           $httpBackend.flush();

            expect(scope.successTwo).toEqual('Limit has been successfully changed.');
        });

         it('$scope.setCanteenName() should change canteen name', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'users/superuserSetCanteenName').respond(200, {'message': 'Canteen name has been successfully changed.'}
             );

            scope.setCanteenName(true);
            $httpBackend.flush();

              expect(scope.successThree).toEqual('Canteen name has been successfully changed.');
        });


    });
}());
