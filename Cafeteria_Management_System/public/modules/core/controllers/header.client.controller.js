'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus',
	function($scope,  $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.loadCanteenInfo = function(){
			//console.log('in load canteen info...');
			$http.get('/loadCanteenInfo').success(function(response) {
				// If successful show success message and clear form
			$scope.canteenName = response.message.value;
			//console.log(response.message.value);

			}).error(function(response) {
				$scope.canteenName = 'Canteen Name (undifined)';
			});
			//console.log($scope.canteenName);
		};






		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});


	}




]);
