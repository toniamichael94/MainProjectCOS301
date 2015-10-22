'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', '$http', '$location', '$cookies','$interval', 'Authentication', 'Menus',
	function($scope, $rootScope,$http, $location, $cookies, $interval, Authentication, Menus) {
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

        var stop;
		$scope.loadNotifications = function(){
			if($scope.authentication.user){
				 if ( angular.isDefined(stop) ) return;
				var stop = $interval(function(){
                    $http.post('/orders/getNrNotifications').success(function(response){
						$scope.newMessages = response.message;
					}).error(function(response){
						$scope.newMessages = 0;
					});
				}, 10000);
			}
		};
		
		$scope.stopLoad = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };
		
		$scope.$on('$destroy', function() {
          // Make sure that the interval is destroyed too
          $scope.stopLoad();
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
