/**
 * Created by tonia on 2015/07/08.
 */
'use strict';
//reset password
(function() {
    // settings/profile controller Spec
    describe('cashierController', function() {

        // Initialize global variables
        var cashierController,
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

            // Initialize the PasswordController controller
            cashierController = $controller('cashierController', {
                $scope: scope
            });
        }));


        it('$scope.markAsReady() should mark order as ready', function() {
            // Test expected GET request
            $httpBackend.expectPOST('orders/markAsReady',{username : 'tonia', orderNumber : 7}).respond(200, {'message': 'order marked as ready'});
			
			//Prevent refresh function from crashing test
			$window.location.reload = function(bool) {};
			
            scope.markAsReady('tonia',7);
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual('order marked as ready');
        });

        it('$scope.markAsReady() should not mark order as ready when incorrect parameters sent to function', function() {
            
			scope.markAsReady('tonia');
            
            // Test scope value
            expect(scope.error).toEqual('Invalid parameters');
        });

  /*    Should be deleted as we dont use markAsCollected anymore  
		it('$scope.markAsCollected() should  mark the order as collected successfully', function() {
            // Test expected GET request
            $httpBackend.expectPOST('orders/markAsCollected',{"uname":"tonia","orderNumber":"7","item":"spinach tart"}).respond(200, {'message': 'Order collected'});

            scope.markAsCollected('tonia','spinach tart','7');
            $httpBackend.flush();

            // Test scope value
            // expect(scope.success).toEqual('Order collected');
        });

        it('$scope.markAsCollected() should not mark the order as collected successfully', function() {
            // Test expected GET request
            $httpBackend.expectPOST('orders/markAsCollected',{"uname":"tonia"}).respond(400, {'message': 'Order not collected'});

            scope.markAsCollected('tonia');
            $httpBackend.flush();

            // Test scope value
            // expect(scope.success).toEqual('Order collected');
        });*/

       it('$scope.markAsPaid() should  mark the order as paid successfully', function() {
            // Test expected GET request
            $httpBackend.expectPOST('orders/markAsPaid',{"username":"tonia","orderNumber":7, "method":"cash"}).respond(200, {'message': 'Order paid'});
            var ord = {username:"tonia", orderNumber: 7, item:"spinach tart", paymentMethod:"cash"};
            
			//Prevent refresh function from crashing test
			$window.location.reload = function(bool) {};
			scope.markAsPaid(ord);
            $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual('Order paid');
        });

		//Will be revisited
        /*it('$scope.markAsPaid() should NOT mark order as paid if no payment method specified', function() {
            // Test expected GET request
            var ord = {username:"tonia", orderNum: 7, item:"spinach tart"};
            
            scope.markAsPaid(ord);
            $httpBackend.flush();

            // Test scope value
            // expect(scope.success).toEqual('Order collected');
        });*/
	
        it('$scope.getOrders() should get a list of orders where status is open', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/orders/getOrderList').respond(200, {'message': {"order":"anOrder"}});

            scope.getOrders();
            $httpBackend.flush();

            // Test scope value
             expect(scope.orders).not.toBe(null);
        });

        it('$scope.getOrders() should not get a list of orders where status is closed', function() {
            // Test expected GET request
            $httpBackend.expectPOST('/orders/getOrderList').respond(400, {'message': {"status":"closed"}});

            scope.getOrders();
            $httpBackend.flush();

            // Test scope value
            expect(scope.error).toEqual({"status":"closed"});
        });
    });
}());
