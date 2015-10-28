'use strict';
/*
 Controller: Settings client controller
 */
angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', '$cookies', 'Users', 'Authentication',
    function ($scope, $http, $location, $cookies, Users, Authentication) {
        $scope.user = Authentication.user;
        $scope.container1Data = [];
        $scope.container1Data1 = [];
        $scope.container1drilldownData = [];

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        /*
         Function name: Graph Page
         @params: n/a
         @return: n/a
         */
        //This function will initiate the graph arrays cookies
        $scope.GraphPage = function () {

            $scope.container1Data1[0] = {
                name: '',
                y: 0,
                drilldown: ''
            };

            $scope.container1drilldownData[0] = {
                'id': '',
                'data': [['', 0]]
            };


            $cookies.container1Data1 = JSON.stringify($scope.container1Data1);
            $scope.container1Data1 = JSON.parse($cookies.container1Data1);
            $cookies.container1drilldownData = JSON.stringify($scope.container1drilldownData);
            $scope.container1drilldownData = JSON.parse($cookies.container1drilldownData);
        };

        //if no such cookies exist it will make them
        if (!$cookies.container2Data || (!$cookies.container1drilldownData && !$cookies.container1Data1)) {
            $scope.GraphPage();
        }
        ;

//My History graoh will show all the orders listed in the users history for that month
        $('#container1').highcharts({
            chart: {type: 'column'},
            title: {text: 'User History'},
            xAxis: {type: 'category'},
            legend: {enabled: false},
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {enabled: true}
                }
            },
            series: [{
                name: 'Items',
                colorByPoint: true,
                data: JSON.parse($cookies.container1Data1)
            }],
            drilldown: {
                series: JSON.parse($cookies.container1drilldownData)
            }
        });


        /*
         Function name: Update User Profile
         @params: Boolean isValid
         @return: n/a
         */
        $scope.updateUserProfile = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function (response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        /*
         Function name: View User Profile
         @params: Boolean isValid
         @return: n/a
         */
        $scope.viewUserProfile = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function (response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        /*
         Function name: Change User Password
         @params: n/a
         @return: n/a
         */
        $scope.changeUserPassword = function () {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        /*
         Function name: Get System Limit
         @params:  n/a
         @return: n/a
         */
        $scope.getSystemLimit = function () {
            $http.get('/users/getSystemLimit').success(function (response) {
                angular.element(document.querySelector('#limit')).attr('max', parseInt(response.val));
            }).error(function (response) {
                console.log(response.message);
            });
        };

        /*
         Function name: Search Employee
         @params: Boolean isValid
         @return: n/a
         */
        $scope.searchEmployee = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;

                var reqObj = {username: $scope.username};
                $http.post('/users/search', reqObj).success(function (response) {
                    $scope.success = response.message;
                }).error(function (response) {
                    $scope.error = response.message;
                });
            }
        };

        /*
         Function name: Group Items
         @params: JSONObject item
         @return: n/a
         */
        //helper function for graph data
        $scope.groupItems = function (item) {
            $scope.container1Data[item.category].push(item);
            $scope.container1Data[item.category].category = item.category;
            $scope.container1Data[item.category].amount = $scope.container1Data[item.category].amount + item.quantity;
            if ($scope.container1Data[item.category].items[item.itemName]) {
                $scope.container1Data[item.category].items[item.itemName][0][1] = $scope.container1Data[item.category].items[item.itemName][0][1] + item.quantity;
            } else {
                $scope.container1Data[item.category].items[item.itemName] = [];
                var tempArray = [];
                tempArray[0] = item.itemName;
                tempArray[1] = item.quantity;
                $scope.container1Data[item.category].items[item.itemName].push(tempArray);
            }

        };

        /*
         Function name: Group Items 2
         @params: JSONObject item
         @return: n/a
         */
        //helper function for graph data
        $scope.groupItems2 = function (item) {
            var tempArray = [];
            var count = 0;
            for (var items in item) {
                tempArray[count] = item[items][0];
                count++;
            }
            return tempArray;

        };

        /*
         Function name: Get User History
         @params: Date _startDate, Date _endDate
         @return: n/a
         */
        //Get User history
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.itemHistory = [];
        $scope.getUserHistory = function (_startDate, _endDate) {
            var temp = new Date();
            if (_startDate === undefined) {
                _startDate = new Date();
                _startDate.setDate(1);
                _startDate.setMilliseconds(0);
                _startDate.setSeconds(0);
                _startDate.setMinutes(0);
                _startDate.setHours(0);
                _endDate = new Date();
            }
            $http.post('/orders/getUserOrders', {
                startDate: _startDate,
                endDate: _endDate
            }).success(function (response) {
                $scope.itemHistory = response.message;
                //console.log(response.message);
                $scope.total = 0;
                for (var item in $scope.itemHistory) {
                    var temp = new Date($scope.itemHistory[item].created);
                    $scope.itemHistory[item].date = days[temp.getDay()] + ' ' + months[temp.getMonth()] + ' ' + temp.getDate() + ', ' + temp.getFullYear() + ' ' +
                    temp.getHours() + ':' + temp.getMinutes() + ':' + temp.getSeconds();
                    $scope.total += $scope.itemHistory[item].price * $scope.itemHistory[item].quantity;
                }


                //info for the graph
                var containerData = [];

                for (var i = 0; i < response.message.length; i++) {
                    if ($scope.container1Data[response.message[i].category]) {
                        $scope.groupItems(response.message[i]);
                    } else {
                        $scope.container1Data[response.message[i].category] = [];
                        $scope.container1Data[response.message[i].category].items = [];
                        $scope.container1Data[response.message[i].category].amount = 0;
                        $scope.container1Data[response.message[i].category].category = response.message[i].category
                        // now generate the menu items
                        $scope.container1Data[response.message[i].category].items[response.message[i].itemName] = [];
                        var tempArray = [];
                        tempArray[0] = response.message[i].itemName;
                        tempArray[1] = response.message[i].quantity;
                        $scope.container1Data[response.message[i].category].items[response.message[i].itemName].push(tempArray);

                        $scope.container1Data[response.message[i].category].push(response.message[i]);
                        $scope.container1Data[response.message[i].category].amount = $scope.container1Data[response.message[i].category].amount + response.message[i].quantity;
                    }
                }


                var count = 0;
                for (var con in $scope.container1Data) {
                    containerData[count] = {
                        name: $scope.container1Data[con].category,
                        y: $scope.container1Data[con].amount,
                        drilldown: $scope.container1Data[con].category
                    }
                    count++;
                }

                count = 0;
                for (var con in $scope.container1Data) {
                    $scope.container1Data[con].items = $scope.groupItems2($scope.container1Data[con].items);
                    $scope.container1drilldownData[count] = {
                        "id": $scope.container1Data[con].category,
                        "data": $scope.container1Data[con].items
                    };
                    count++;
                }

                $scope.container1Data1 = containerData;

                $cookies.container1Data1 = JSON.stringify($scope.container1Data1);
                $scope.container1Data1 = JSON.parse($cookies.container1Data1);
                $cookies.container1drilldownData = JSON.stringify($scope.container1drilldownData);
                $scope.container1drilldownData = JSON.parse($cookies.container1drilldownData);

            }).error(function (response) {
                console.log(response.message);
            });
        };

        /*
         Function name: Visual History
         @params: n/a
         @return: n/a
         */
        $scope.visualHistory = function () {
            $location.path('/settings/historyGraph');
        };
      
        $scope.loadEmployees = function () {
            $http.get('/loadEmployees').success(function (response) {
                $scope.employees = response.message;
                var empArr = [];
                var counter = 0;

                for (var empID in response.message) {
                    empArr[counter] = response.message[empID];
                    counter++;
                }
                $scope.employees = empArr;
            }).error(function (response) {
                $scope.employees = 'Error loading employees';
            });
        };

        /*exports.loadEmployees = function(req, res){
         User.find({}, function(err, employees) {
         var itemMap = {};

         employees.forEach(function(employees) {
         itemMap[employees._id] = employees;
         console.log(employees.username);
         //console.log(employees.username);
         });
         if(err || !itemMap) return res.status(400).send({message: 'Employees not found' });
         else {
         console.log('LOAD');
         //console.log(employees);
         res.status(200).send({message: itemMap});
         }
         });
         };*/

        /*
         Function name: Check User
         @params: n/a
         @return: n/a
         */
        $scope.checkUser = function () {
            if (!$scope.user)// && ($location.path === '/#!/settings/password'))
            {
                //$location.path('/');
                if ($location.path === '/#!/settings/password')
                    $location.path('/');
                else if ($location.path === '/#!/settings/profileView')
                    $location.path('/');
                else if ($location.path === '/#!/settings/profile')
                    $location.path('/');
                else if ($location.path === '/#!/manageCafeteria')
                    $location.path('/');
                else if ($location.path === '/#!/manageInventory')
                    $location.path('/');
            }
        };

        /*
         Function name: Check Fin User
         @params: n/a
         @return: n/a
         */
        $scope.checkFinUser = function () {
            if ((Authentication.user.roles[0] !== 'finance') && $location.path('/#!/finance'))
                $location.path('/');
        };

    }
]);
