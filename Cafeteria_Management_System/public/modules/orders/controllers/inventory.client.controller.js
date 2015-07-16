'use strict';

// Inventory controller
angular.module('inventory').controller('InventoryController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Inventory',
	function($scope, $http, $stateParams, $location, Authentication, Inventory) {
		$scope.authentication = Authentication;

		// Create new Inventory Item
		/*$scope.create = function() {
			// Create new InventoryItem object
			var inventoryItem = new Inventory ({
				name: this.name
			});

			// Redirect after save
			inventoryItem.$save(function(response) {
				$location.path('inventory/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/

		
			
		/*
			Dynamically add fields to the menu itmes page to add ingredients for a menu item.
		*/
		
	    $scope.allInventory = {inventoryProduct:[''],inventoryQuantity:['']};
		$scope.previousQuantity = {prevQuantity:['']};
		//$scope.inventoryItems = '';


  $scope.addFormFieldInventory = function() {
   
	 //$scope.allInventory.inventoryProduct.push('');
	 //$scope.allInventory.inventoryQuantity.push('');
	 
	 for(var i = 0; i != $scope.inventoryItems.length; i++)
	 {
		 
		 $scope.allInventory.inventoryProduct.push($scope.inventoryItems[i].productName);
		 $scope.allInventory.inventoryQuantity.push($scope.inventoryItems[i].quantity);
		 $scope.previousQuantity.prevQuantity.push($scope.inventoryItems[i].quantity);
	 }
		 
  };
		
		
		$scope.updateInventoryQuantity = function()
		{
			console.log('here');
			
			for(var i = 0; i != $scope.allInventory.inventoryProduct.length; i++)
			{
				console.log(i);
				if(!($scope.allInventory.inventoryQuantity[i] === $scope.previousQuantity.prevQuantity[i]))
				{
					console.log($scope.allInventory.inventoryProduct[i] + ' changed');
					var reqObj = {productName:$scope.allInventory.inventoryProduct[i], quantity:$scope.allInventory.inventoryQuantity[i]};
					$http.post('/orders/updateInventoryQuantity',reqObj);	
				}
			}
			
		};
		

		// Loading the items from the inventory to display in the add ingredients of the menu items being added
		$scope.loadInventoryItems = function(){
			$http.get('/loadInventoryItems').success(function(response) {
			$scope.inventoryItems = response.message;
			var itemsArray    = new Array();
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
//        reqObj.userID = $scope.userID;
//        reqObj.role = $scope.role;

        $http.post('/orders/create', reqObj).success(function(response) {
          // If successful show success message and clear form
        $scope.success = true;
		$scope.inventory = null;
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
		$scope.update = function() {
			var inventoryItem = $scope.inventoryItem;

			inventoryItem.$update(function() {
				$location.path('inventory/' + inventoryItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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
                $scope.successOne = $scope.errorOne = null;
                var reqObj = {productName: $scope.itemNameSearch.toLowerCase()};
                $http.post('/orders/search', reqObj).success(function(response){
                    $scope.successOne = response.message;
                }).error(function(response){
                    $scope.errorOne = response.message;
                });
            }
        };

        //Update inventory {Antonia Michael and Semaka Malapane}
        $scope.updateInventory = function(isValid) {
            if (isValid) {
                $scope.successTwo = $scope.errorTwo = null;
                var reqObj = {oldProdName: $scope.itemNameSearch.toLowerCase(), newProdName: $scope.itemName.toLowerCase(), unit: $scope.unit, quantity:$scope.quantity};

                $http.post('/orders/update', reqObj).success(function(response) {
                    // If successful show success message and clear form
                    $scope.successTwo = response.message;
                    $scope.itemNameSearch = $scope.itemName = $scope.unit = $scope.quantity = null;
                }).error(function(response) {
                    $scope.errorTwo = response.message;
                });
            }
        };
	}
]);
