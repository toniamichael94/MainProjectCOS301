'use strict';

// Placeorders controller
angular.module('placeorders').controller('PlaceordersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Placeorders',
	function($scope, $stateParams, $location, Authentication, Placeorders) {
		$scope.authentication = Authentication;

		// Create new Placeorder
		$scope.create = function() {
			// Create new Placeorder object
			var placeorder = new Placeorders ({
				name: this.name
			});

			// Redirect after save
			placeorder.$save(function(response) {
				$location.path('placeorders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Placeorder
		$scope.remove = function(placeorder) {
			if ( placeorder ) { 
				placeorder.$remove();

				for (var i in $scope.placeorders) {
					if ($scope.placeorders [i] === placeorder) {
						$scope.placeorders.splice(i, 1);
					}
				}
			} else {
				$scope.placeorder.$remove(function() {
					$location.path('placeorders');
				});
			}
		};

		// Update existing Placeorder
		$scope.update = function() {
			var placeorder = $scope.placeorder;

			placeorder.$update(function() {
				$location.path('placeorders/' + placeorder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Placeorders
		$scope.find = function() {
			$scope.placeorders = Placeorders.query();
		};

		// Find existing Placeorder
		$scope.findOne = function() {
			$scope.placeorder = Placeorders.get({ 
				placeorderId: $stateParams.placeorderId
			});
		};
	}
]);