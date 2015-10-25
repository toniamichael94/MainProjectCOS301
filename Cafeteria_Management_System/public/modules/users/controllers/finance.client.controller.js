'use strict';
/*
 Controller: Finance client controller
 */
angular.module('users').controller('FinanceController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
    function($scope, $http, $location, $stateParams, Authentication) {
        //$scope.user = Authentication.user;
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication) $location.path('/');

        /*
         Function name: Generate Report
         @params: n/a
         @return: n/a
         */
		$scope.generateReport = function(){
			$scope.error = $scope.success = null;
			if($scope.username === '' || $scope.startDate === '' || $scope.endDate === '')
			{
				$scope.error = 'Please fill in all fields';
				return;
			}
			var toDate = new Date($scope.current_toDate);
			toDate.setHours(23,59,59);

			$http.post('users/finance/generateReportUser',{username: $scope.username, start: $scope.startDate, end: $scope.endDate},{responseType:'arraybuffer'}).success(function(response){

				var file = new Blob([response], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);

				var fileName = 'invoice.pdf';
				var a = document.createElement('a');
				document.body.appendChild(a);
				a.setAttribute('style', 'display: none');

				a.href =  fileURL;
                a.download = fileName;
                a.click();
				$scope.success = 'Report generated';
			}).error(function(response){
				$scope.success = '';
				$scope.error = 'Could not generate report';
			});
		};

        /*
         Function name: Load Employees
         @params: n/a
         @return: n/a
         */
        $scope.loadEmployees = function(){
            $http.get('/loadEmployees').success(function(response) {
                $scope.employees = response.message;
                var empArr = [];
                var counter = 0;

                for(var empID in response.message){
                    empArr[counter] = response.message[empID];
                    counter++;
                    console.log('Superuser: '+ empID);
                }
                $scope.employees = empArr;
            }).error(function(response) {
                $scope.employees = 'Error loading employees';
            });
        };

        /*
         Function name: Generate Report All
         @params: n/a
         @return: n/a
         */
        $scope.reportFormat = 'csv';
		$scope.generateReportAll = function(){
			$http.post('users/finance/generateReportAll',{start: $scope.startDateTwo, end: $scope.endDateTwo, format: $scope.reportFormat},{responseType:'arraybuffer'}).success(function(response){
				var format = $scope.reportFormat;
                var file = new Blob([response], {type: 'application/' + $scope.reportFormat});
				var fileURL = URL.createObjectURL(file);

				var fileName = 'report.' + $scope.reportFormat;
				var a = document.createElement('a');
				document.body.appendChild(a);
				a.setAttribute('style', 'display: none');

				a.href =  fileURL;
                a.download = fileName;
                a.click();
				$scope.successTwo = 'Report generated';
			}).error(function(response){
				$scope.successTwo = '';
				$scope.errorTwo = 'Could not generate report';
			});
		};

        /*
         Function name: Check User
         @params: n/a
         @return: n/a
         */
        $scope.checkUser = function(){
            if((!Authentication.user) || (Authentication.user && Authentication.user.roles[0] !== 'finance')){
                $location.path('/');
            }
        };
    }
]);
