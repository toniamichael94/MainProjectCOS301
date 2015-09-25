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

<<<<<<< HEAD
/*
        it('$scope.getUserOrders() should get users orders', function() {
=======
		//Will be revisited
       /* it('$scope.generateReport() should generate invoice for specific user', function() {
>>>>>>> 9fee45876e857f37d58f0744bc75643e72bf19e1
            // Test expected GET request
            scope.username = 'Timmy';
			scope.startDate = '2015/01/01';
			scope.endDate = '2015/08/01';
			$httpBackend.when('POST','users/finance/generateReport').respond(200);

            scope.generateReport();
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual('Report generated');
        });
		*/
		
        it('$scope.generateReport() should not generate report if missing fields', function() {
            // Test expected GET request
            scope.username = ''; scope.startDate = ''; scope.endDate = '';
            scope.generateReport();
            

            // Test scope value
<<<<<<< HEAD
            expect(scope.error).toEqual("could not get orders");
        });*/
=======
            expect(scope.error).toEqual('Please fill in all fields');
        });
>>>>>>> 9fee45876e857f37d58f0744bc75643e72bf19e1
    });
}());
