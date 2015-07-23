/**
 * Created by rendani on 2015/07/23.
 */
'use strict';

(function() {
    // menuItems controller Spec
    describe('menuItemsController', function() {
		// Initialize global variables
        var superuserController,
            scope,
            $httpBackend,
            $stateParams,
            $location,
			$cookies;
		
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
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$cookies_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
			$cookies = _$cookies_

            // Initialize the SettingsController controller
            superuserController = $controller('menuItemsController', {
                $scope: scope
            });
        }));
		
		/*it('$scope.addToPlate() should add menu item to plate', function() {
			scope.addToPlate();

            expect($cookies.plate).;
        });*/
		
	});
}());