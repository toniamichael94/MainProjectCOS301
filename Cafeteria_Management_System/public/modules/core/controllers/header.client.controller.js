'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$http', '$location', '$cookies','Authentication', 'Menus',
	function($scope, $rootScope,$http, $location, $cookies, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.onMyPlateNum = 0;
		$scope.newMessages = 0;
		if($cookies.plate)
			$scope.onMyPlateNum = JSON.parse($cookies.plate).length;

		$rootScope.$on('plateUpdated',  function(){
			if($cookies.plate)
				$scope.onMyPlateNum = JSON.parse($cookies.plate).length;
			else
				$scope.onMyPlateNum = 0;
		});

                $rootScope.$on('newMess',  function(){
			console.log('NEW MESSAGE SENT THROUGH');
			    $http.post('/orders/getNrNotifications').success(function(response){
				console.log('Notification ' + response.message);
				 $scope.newMessages = response.message;
			    }).error(function(response){
				console.log('Error getting number of notifications');
				$scope.newMessages = response.message;
				console.log(response.message);
				//$scope.error = response.message;
			    });
			console.log('should be: ' + $scope.newMessages);
			 //$scope.newMessages = 1;
		});

                $rootScope.$on('messRead',  function(){
                    $scope.newMessages = 0;
		});

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

		$scope.signout = function(){
			if($cookies.plate){
				var j = [];
				$cookies.plate = JSON.stringify(j);
			}
		};



		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});


	}




]);
