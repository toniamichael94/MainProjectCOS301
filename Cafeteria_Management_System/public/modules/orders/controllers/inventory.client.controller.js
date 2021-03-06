'use strict';

// Inventory controller
angular.module('inventory').controller('InventoryController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Inventory',
	function($scope, $http, $stateParams, $location, Authentication, Inventory) {
		$scope.authentication = Authentication;

		/*
			Dynamically add fields to the inventory page to update the quantity.
		*/
		$scope.allInventory = {inventoryProduct:[],inventoryQuantity:[]};
		$scope.addFormFieldInventory = function() {
			$http.get('/loadInventoryItems').success(function(response) {
			$scope.inventoryItems = response.message;
			var itemsArray = new Array();
			var counter = 0;

			for(var itemName in response.message){
				itemsArray[counter] = response.message[itemName];
				counter++;
			}


			$scope.inventoryItems = itemsArray;
			console.log($scope.inventoryItems.length);
			$scope.previousQuantity = {prevQuantity:[]};
			$scope.allInventory = {inventoryProduct:[],inventoryQuantity:[]};

				for(var i = 0; i !== $scope.inventoryItems.length; i++)
				{
					$scope.allInventory.inventoryProduct.push($scope.inventoryItems[i].productName +' ' +$scope.inventoryItems[i].unit);
					$scope.allInventory.inventoryQuantity.push($scope.inventoryItems[i].quantity);
					$scope.previousQuantity.prevQuantity.push($scope.inventoryItems[i].quantity);
					console.log($scope.allInventory.inventoryProduct[i]);
				}
			$scope.showInventory = true;
			$scope.hideInventory = false;

				}).error(function(response) {
				$scope.inventoryItems = 'Error loading inventory Items';
			});




		};


		/*
		Update the quantity of an inventory item
		*/
		$scope.updateInventoryQuantity = function()
		{
				var error = false;
				$scope.message = "";

			for(var i = 0; i !== $scope.allInventory.inventoryProduct.length; i++)
			{

				if($scope.allInventory.inventoryQuantity[i] !== $scope.previousQuantity.prevQuantity[i])
				{
					var space = $scope.allInventory.inventoryProduct[i].lastIndexOf(" ");
					var name = $scope.allInventory.inventoryProduct[i].substring(0,space);
					console.log(name);

					var reqObj = {productName:name, quantity:$scope.allInventory.inventoryQuantity[i]};
					$http.post('/orders/updateInventoryQuantity',reqObj).success(function(response){
						if(!error)
						{
							$scope.message = response.message;
						}
					}).error(function(response){
						$scope.message = response.message;
						error = true;
					});
				}
			}



		};

		/*
		Delete an inventory item
		*/
		$scope.deleteInventoryName = '';

		$scope.deleteInventoryItem = function(inventoryItemName)
		{
			$scope.successFind = null;
			$scope.errorMessage = $scope.successMessage = null;
			$scope.itemNameSearch=$scope.itemNameSearch.toLowerCase();
			var reqObj = {productName:$scope.itemNameSearch};
			$http.post('/orders/deleteInventoryItem',reqObj).success(function(response){

				$scope.successMessage = response.message;
				$scope.itemNameSearch = null;
			}).error(function(response){
				$scope.errorMessage = response.message;
			});
		};

		// Loading the items from the inventory to display in the add ingredients of the menu items being added
		$scope.loadInventoryItems = function(){
			$http.get('/loadInventoryItems').success(function(response) {
			$scope.inventoryItems = response.message;
			var itemsArray = new Array();
			var counter = 0;

			for(var itemName in response.message){
				itemsArray[counter] = response.message[itemName];
				counter++;
			}


			$scope.inventoryItems = itemsArray;


				}).error(function(response) {
				$scope.inventoryItems = 'Error loading inventory Items';
			});
		};

		//create new inventory item
		$scope.create = function(isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var reqObj = {productName: $scope.inventory.itemName.toLowerCase(), unit: $scope.inventory.unit, quantity:$scope.inventory.quantity};
        $http.post('/orders/create', reqObj).success(function(response) {
	   $scope.allInventory.inventoryProduct.push($scope.inventory.itemName.toLowerCase()+' ' +$scope.inventory.unit);
		$scope.allInventory.inventoryQuantity.push($scope.inventory.quantity);
        $scope.success = 'Inventory item added';
		$scope.inventory = null;
		//$scope.hideInventory=true;
        }).error(function(response) {
          $scope.error = response.message;
        });
        }
      };

		// Remove existing inventory item
		$scope.remove = function(inventoryItem) {
			if ( inventoryItem ) {
				inventoryItem.$remove();

				for (var i in $scope.inventory) {
					if ($scope.inventory [i] === inventoryItem) {
						$scope.inventory.splice(i, 1);
					}
				}
			} else {
				$scope.inventoryItem.$remove(function() {
					$location.path('inventory');
				});
			}
		};

		// Update existing Inventory item
		/*$scope.update = function() {
			var inventoryItem = $scope.inventoryItem;

			inventoryItem.$update(function() {
				$location.path('inventory/' + inventoryItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/

		// Find a list of Inventory items
		$scope.find = function() {
			$scope.inventory = Inventory.query();
		};

		// Find existing Inventory item
		$scope.findOne = function() {
			$scope.inventoryItem = Inventory.get({
				inventoryItemId: $stateParams.inventoryItemId
			});
		};

        // Search inventory
        $scope.searchInventory = function(isValid) {
            if(isValid){
                $scope.successFind = $scope.errorFind = null;
				$scope.successMessage = $scope.errorMessage = null;
                var reqObj = {productName: $scope.itemNameSearch.toLowerCase()};
                $http.post('/orders/search', reqObj).success(function(response){
                    $scope.successFind = response.message;

					//Fill in the fields for the update function
					$scope.itemUpdateName = $scope.itemNameSearch;
					$scope.updateQuantity = response.foundInventoryItem.quantity;
					$scope.updateUnit = response.foundInventoryItem.unit;

                }).error(function(response){
                    $scope.errorFind = response.message;
					$scope.errorMessage=response.message;
                });
            }
        };

        //Update inventory
        $scope.updateInventory = function(isValid) {
            if (isValid) {
				$scope.successFind = null;
                $scope.successMessage = $scope.errorMessage = null;
				$scope.itemUpdateName = $scope.itemUpdateName.toLowerCase();
                var reqObj = {oldProdName: $scope.itemNameSearch.toLowerCase(), newProdName: $scope.itemUpdateName, quantity:$scope.updateQuantity, unit: $scope.updateUnit};

                $http.post('/orders/updateInventory', reqObj).success(function(response) {

					for(var item in $scope.allInventory.inventoryProduct)
					{
						var space = $scope.allInventory.inventoryProduct[item].lastIndexOf(" ");
						var name = $scope.allInventory.inventoryProduct[item].substring(0,space);

						if(name == $scope.itemNameSearch.toLowerCase())
						{
							$scope.allInventory.inventoryProduct[item] = $scope.itemUpdateName;
							$scope.allInventory.inventoryQuantity[item] = $scope.updateQuantity;
						}
					}

                    $scope.successMessage = response.message;
                    $scope.itemNameSearch = $scope.itemUpdateName = $scope.updateUnit = $scope.updateQuantity = null;
					$scope.itemNameSearch = '';
                }).error(function(response) {
                    $scope.errorMessage = response.message;

                });
            }
        };

        $scope.checkCMUser = function(){
            if(!Authentication.user){
                $location.path('/');
            }
            /*else if(Authentication.user.roles[0] === 'cafeteriaManager') {
                console.log('Checking cafeteria manager Inventory: ' + Authentication.user.roles[0]);
                //$location.path('/#!/manageInventory');
            }*/
            else if(Authentication.user.roles[0] !== 'cafeteriaManager'){
                $location.path('/');
            }

        };
	}
]);
