/**
 * Created by tonia on 2015/07/08.
 */
'use strict';
//reset password
(function() {
    // settings/profile controller Spec
    describe('FinanceController', function() {

        // Initialize global variables
        var FinanceController,
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
            FinanceController = $controller('FinanceController', {
                $scope: scope
            });
        }));


        it('$scope.getUserOrders() should get users orders', function() {
            // Test expected GET request
            $httpBackend.when('POST','/orders/getUserOrders').respond(200,{'message': ['spinach pie','feta pie','cheese pie']});

            scope.getUserOrders();
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual(['spinach pie','feta pie','cheese pie']);
        });

        it('$scope.getUserOrders() should not get users orders', function() {
            // Test expected GET request
            $httpBackend.when('POST','/orders/getUserOrders').respond(400,"could not get orders" );

            scope.getUserOrders();
            $httpBackend.flush();

            // Test scope value
            expect(scope.error).toEqual("could not get orders");
        });
    });
}());
