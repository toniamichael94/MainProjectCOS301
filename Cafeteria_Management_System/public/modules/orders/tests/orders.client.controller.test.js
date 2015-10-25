/**
 * Created by rendani on 2015/07/23.
 */
'use strict';

(function() {
    // menuItems controller Spec
    describe('OrdersController', function() {
        // Initialize global variables
        var OrdersController,
            scope,
            $httpBackend,
            $stateParams,
            $location,
            Authentication,
            $cookies,
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
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$cookies_, _$window_, Authentication) {
            // Set a new global scope
            scope = $rootScope.$new();
             scope.authentication = Authentication;
            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            $cookies = _$cookies_;
			$window = _$window_;
			
            // Initialize the SettingsController controller
            OrdersController = $controller('OrdersController', {
                $scope: scope
            });
        }));
		
		it('$scope.removeFromPlate should remove item from plate', function(){
			$cookies.plate = JSON.stringify([{itemName: 'sandwhich'},{itemName: 'burger'},{itemName: 'Pie'}]);
			
			//Prevent refresh function from crashing test
			$window.location.reload = function(bool) {};
			
			scope.removeFromPlate('sandwhich');
			
			// Test scope value
            expect($cookies.plate).toEqual(JSON.stringify([{itemName: 'burger'},{itemName: 'Pie'}]));
		});

		it('$scope.placeOrder() should place order', function() {
			//Test expected POST request
			//Place Order uses 2 requests, one to place the order, the other to decrease the ingredients
			$httpBackend.expectPOST('/orders/placeOrder',{plate : [{itemName: 'sandwhich', username: 'aUser', quantity: 1, ingredients: ['cheese (slices)'], quantities: [1]}], paymentMeth: 'credit' }).respond(200, {'message': 'Order has been made'});
			$httpBackend.expectPOST('/orders/decreaseInventory', {productName: 'cheese', quantity: -1}).respond(200, {'message':'Dcreased inventory'});
			
			scope.plate = [{itemName: 'sandwhich', username: 'aUser', quantity: 1, ingredients: ['cheese (slices)'], quantities: [1]}];
			scope.paymentMethod = 'credit';
			scope.authentication.user = {username: 'aUser', limit: 1000};
			
            scope.placeOrder();
            $httpBackend.flush();

            expect(scope.success).toEqual('Order has been made');
        });

		it('$scope.placeOrder() should not place order if user is not signed in', function() {
			scope.authentication.user = null;
			//Create spy to spy on the location.path function, which redirects when user is not signed in
			spyOn($location, 'path');
			scope.placeOrder();

			expect($location.path).toHaveBeenCalledWith('/signin');
		});

    });
}());
