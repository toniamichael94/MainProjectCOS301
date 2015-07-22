'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', '$cookies','Authentication', 'Menus',
	function($scope,  $http, $cookies, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		
		$scope.onMyPlateNum = 0;
		if($cookies.plate)
			$scope.onMyPlateNum = JSON.parse($cookies.plate).length;


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.loadCanteenInfo = function(){
			$http.get('/loadCanteenInfo').success(function(response) {
			// If successful show success message and clear form
			$scope.canteenName = response.message.value;

			}).error(function(response) {
				$scope.canteenName = 'Canteen Name';
			});
		};






		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});


	}




]);
