'use strict';

(function() {
	// Placeorders Controller Spec
	describe('Placeorders Controller Tests', function() {
		// Initialize global variables
		var PlaceordersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
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

		// Then we can start by loading the main application module
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

			// Initialize the Placeorders controller.
			PlaceordersController = $controller('PlaceordersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Placeorder object fetched from XHR', inject(function(Placeorders) {
			// Create sample Placeorder using the Placeorders service
			var samplePlaceorder = new Placeorders({
				name: 'New Placeorder'
			});

			// Create a sample Placeorders array that includes the new Placeorder
			var samplePlaceorders = [samplePlaceorder];

			// Set GET response
			$httpBackend.expectGET('placeorders').respond(samplePlaceorders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.placeorders).toEqualData(samplePlaceorders);
		}));

		it('$scope.findOne() should create an array with one Placeorder object fetched from XHR using a placeorderId URL parameter', inject(function(Placeorders) {
			// Define a sample Placeorder object
			var samplePlaceorder = new Placeorders({
				name: 'New Placeorder'
			});

			// Set the URL parameter
			$stateParams.placeorderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/placeorders\/([0-9a-fA-F]{24})$/).respond(samplePlaceorder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.placeorder).toEqualData(samplePlaceorder);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Placeorders) {
			// Create a sample Placeorder object
			var samplePlaceorderPostData = new Placeorders({
				name: 'New Placeorder'
			});

			// Create a sample Placeorder response
			var samplePlaceorderResponse = new Placeorders({
				_id: '525cf20451979dea2c000001',
				name: 'New Placeorder'
			});

			// Fixture mock form input values
			scope.name = 'New Placeorder';

			// Set POST response
			$httpBackend.expectPOST('placeorders', samplePlaceorderPostData).respond(samplePlaceorderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Placeorder was created
			expect($location.path()).toBe('/placeorders/' + samplePlaceorderResponse._id);
		}));

		it('$scope.update() should update a valid Placeorder', inject(function(Placeorders) {
			// Define a sample Placeorder put data
			var samplePlaceorderPutData = new Placeorders({
				_id: '525cf20451979dea2c000001',
				name: 'New Placeorder'
			});

			// Mock Placeorder in scope
			scope.placeorder = samplePlaceorderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/placeorders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/placeorders/' + samplePlaceorderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid placeorderId and remove the Placeorder from the scope', inject(function(Placeorders) {
			// Create new Placeorder object
			var samplePlaceorder = new Placeorders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Placeorders array and include the Placeorder
			scope.placeorders = [samplePlaceorder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/placeorders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePlaceorder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.placeorders.length).toBe(0);
		}));
	});
}());