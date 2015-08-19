'use strict';

angular.module('users').controller('FinanceController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
    function($scope, $http, $location, $stateParams, Authentication) {
        //$scope.user = Authentication.user;
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication) $location.path('/');

        // Search a user profile
        /*$scope.searchEmployee = function(isValid) {
            if(isValid){
                $scope.success = $scope.error = null;

                var reqObj = {username: $scope.username};
                    $http.post('/orders/getUserOrders', reqObj).success(function(response){
                        $scope.orders = response.message;
                    }).error(function(response){
                        $scope.error = response.message;
                    });
            }
        };*/

        $scope.getUserOrders = function(){
            var reqObj = {username: $scope.username};
            $http.post('/orders/getUserOrders', reqObj).success(function(response){
                console.log('success' + response);
                console.log('success2' + response.message);
                $scope.success = response.message;
            }).error(function(response){
                console.log('error' + response.message);
                $scope.error = response.message;
            });
        };

        $scope.checkUser = function(){
            if(!Authentication.user){
                $location.path('/');
            }
            else if(Authentication.user.roles[0] !== 'finance'){
                $location.path('/');
            }
        };
    }
]);
