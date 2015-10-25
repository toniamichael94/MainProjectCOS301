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
		
		it('$scope.loadEmployees() should load all employees', function() {
            // Test expected GET request
			$httpBackend.expectGET('/loadEmployees').respond(200, {'message':['12345','54321']})
            
            scope.loadEmployees();
            $httpBackend.flush();
            // Test scope value
            expect(scope.employees).not.toBe(null);
        });
		
		it('$scope.loadEmployees() should show error if cant load employees', function() {
            // Test expected GET request
			$httpBackend.expectGET('/loadEmployees').respond(400, {'message':'Error!'})
            
            scope.loadEmployees();
            $httpBackend.flush();
            // Test scope value
            expect(scope.employees).toEqual('Error loading employees');
        });
		
		/*it('$scope.generateReport() should generate report', function() {
            // Test expected GET request
			var temp = new Date('2015-10-01');
			temp.setHours(23,59,59);
			$httpBackend.expectPOST('users/finance/generateReportUser', {username: '12345', start: '2015-08-01', end: temp}).respond(200);
            scope.username = '12345'; scope.startDate = '2015-08-01'; scope.endDate = '2015-10-01';
            scope.generateReport();
            
			$httpBackend.flush();
			
            // Test scope value
            expect(scope.success).toEqual('Report generated');
        });*/
		
        it('$scope.generateReport() should not generate report if missing fields', function() {
            // Test expected GET request
            scope.username = ''; scope.startDate = ''; scope.endDate = '';
            scope.generateReport();
            
            // Test scope value
            expect(scope.error).toEqual('Please fill in all fields');
        });
		
		 it('$scope.generateReportAll() should not generate report if missing fields', function() {
            // Test expected GET request
            scope.startDateTwo = ''; scope.endDateTwo = '';
            scope.generateReportAll();
            
            // Test scope value
            expect(scope.errorTwo).toEqual('Please fill in all fields');
        });
		
    });
}());
