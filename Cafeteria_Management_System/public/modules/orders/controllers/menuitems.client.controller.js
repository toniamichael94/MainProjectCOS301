'use strict';

// MenuItem controller
var menuItemsModule = angular.module('menuItems').controller('MenuItemsController', ['$scope', '$rootScope','$http', '$stateParams', '$location', '$cookies', 'Authentication', 'MenuItems',
	function($scope, $rootScope, $http, $stateParams, $location, $cookies, Authentication, MenuItems) {
		$scope.authentication = Authentication;
		$scope.alertUser = false; // used for user alerts - help page...
		$scope.viewImage = true;
		$scope.menuItems = [];
		$scope.selectedCategory = [];
		$scope.selectedCategory = JSON.stringify('all');
		$scope.navClicked = false;
		$scope.menuNameSearch = '';
		$scope.container1Data = []; // menu items stats data
		$scope.container1Data1 = []; // menu items stats data
		$scope.container1drilldownData = []; // menu items stats data
		$scope.container1drilldownData1 = []; // menu items stats data
		$scope.container2Data = []; // most popular items data

//filter the catagories
//filter the categories
		$scope.filterCat = function(catName){
					$cookies.selectedCategory = JSON.stringify(catName);
					$scope.selectedCategory = JSON.parse($cookies.selectedCategory);

						if($scope.selectedCategory){

						 if($scope.selectedCategory.localeCompare('all') === 0){
								$http.get('/loadMenuItems').success(function(response){
								var displayItems = response.message;

								for(var item in displayItems){
									if(displayItems[item].itemName.length >1)
										displayItems[item].itemName = displayItems[item].itemName.charAt(0).toUpperCase() + displayItems[item].itemName.slice(1);
								}

								$scope.menuItems = response.message;
								var inStock = true;

								for(var itemName in response.message){
									$scope.menuItems[itemName].stock = true;
									// now check if the inventory items are indeed available
									if(response.message[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
												$scope.menuItems[itemName].stock = false;
									}else{ // check the inventory if all items are available
												$scope.menuItems[itemName].stock= $scope.checkStock(response.message[itemName]);
									}
								}
							}).error(function(response) {
								$scope.menuItems = 'Error loading menu Items';
							});

							if($location.url().localeCompare('/menu-item') === 0){
								$location.path('/menu');
							}

						}else{
							$http.get('/loadMenuItems').success(function(response) {
							var count = 0;
							var newArray = [];
							for(var cat in response.message){
									if(response.message[cat].category[0].localeCompare($scope.selectedCategory) === 0) {
										newArray[count] = response.message[cat];
										count = count+1;
									}
							}
							$scope.menuItems = newArray;

							if(!($location.url().localeCompare('/menu-item') === 0)){
								if($scope.navClicked === false)
									$location.path('/menu-item'); // else change directories....
						}
							var inStock = true;

							for(var itemName in newArray){
								$scope.menuItems[itemName].stock = true;
								// now check if the inventory items are indeed available
								if(newArray[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
											$scope.menuItems[itemName].stock = false;
								}else{ // check the inventory if all items are available
											$scope.menuItems[itemName].stock= $scope.checkStock(newArray[itemName]);
								}
							}
						}).error(function(response) {
							$scope.menuCatagory = 'Error loading menu Categories';
						});
					}

				}

	if($cookies.selectedCategory){
		$scope.selectedCategory = JSON.parse($cookies.selectedCategory);
		$scope.filterCat($scope.selectedCategory);
	}


	if($cookies.navClicked){
		$scope.navClicked = JSON.parse($cookies.navClicked);
	};

// helper function to graphs initiating values and cookies
$scope.MenuItemsGraphPage = function(){

	$scope.container1Data1[0] = {
		name: '',
		y: 0,
		drilldown:''
	};

	$scope.container1drilldownData[0] = {
		'id': '',
		'data': [['', 0]]
	};

	$scope.container2Data[0] = {
		name: '',
		y: 0,
		drilldown:''
	};
	$cookies.container1Data1 = JSON.stringify($scope.container1Data1);
	$scope.container1Data1 = JSON.parse($cookies.container1Data1);
	$cookies.container1drilldownData = JSON.stringify($scope.container1drilldownData);
	$scope.container1drilldownData = JSON.parse($cookies.container1drilldownData);
	$cookies.container2Data = JSON.stringify($scope.container2Data);
	$scope.container2Data = JSON.parse($cookies.container2Data);

};

// if no such cookies exist create them
if(!$cookies.container2Data || (!$cookies.container1drilldownData && !	$cookies.container1Data1)){
	$scope.MenuItemsGraphPage();
}

/*Container to create graph for container 1 - menu item stats*/
	 $('#container1').highcharts({
			 chart: { type: 'column' },
			 title: { text: 'Menu Item Statistics'},
			 xAxis: { type: 'category' },
			 legend: { enabled: false },
			 plotOptions: { series: { borderWidth: 0,
				  											dataLabels: {enabled: true}
					 										}
			 							},
			 series: [{
					 name: 'Categories',
					 colorByPoint: true,
					 data: JSON.parse($cookies.container1Data1)
			 }],
			 drilldown: {
					 series: JSON.parse($cookies.container1drilldownData)
				 }
});

//container 2 for most popular menu items
$('#container2').highcharts({
		chart: { type: 'column' },
		title: { text: 'Most Popular Menu Items'},
		xAxis: { type: 'category' },
		legend: { enabled: false },
		plotOptions: { series: { borderWidth: 0,
														 dataLabels: {enabled: true}
													 }
								 },
		series: [{
				name: 'Categories',
				colorByPoint: true,
				data: JSON.parse($cookies.container2Data)
		}]
});


$scope.NavClicked = function(){
	$cookies.navClicked = JSON.stringify(true);
	$scope.navClicked = JSON.parse($cookies.navClicked);
};


//Help alert function when user wants help variable set to true
$scope.helpAlert = function(){
			$scope.alertUser = true;
};

$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
};

	/*Alert Messages for help page*/
	$scope.alert1 = {type: 'warning', msg: 'Page help: To order a menu item click the add to plate button and then click the on my plate button to confirm your order. To navigate between menu categories - use the navigation bar and click on the appropriate button (Menu contains all the menu categories)'};
	$scope.alert2 = {type: 'warning', msg: 'Page help: This page contains all the settings to add menu items and menu categories to the menu page.'};
	$scope.alert3 = {type: 'warning', msg: 'Page help: Type in a menu category to add to your menu. (a menu category will appear in the menu navigation bar on the menu page and menu items can be placed under a menu category)' };
	$scope.alert4 = {type: 'warning', msg: 'Page help: This section will add a menu item to the menu page. NOTE - you need to have ingredients (stored as inventory) stored in your database to be able to add menu items - this can be added by clicking on your name in the navigation bar and choosing the manage inventory page'};
	$scope.alert5 =	{type: 'warning', msg: 'Page help: To search for a menu item, simply type in the name of the item in the search textbox and click search'};
	$scope.alert6 = {type: 'warning', msg: 'Page help: Manage inventory page will allow you to add, remove and update inventory items'};
	$scope.alert7 = {type: 'warning', msg: 'Page help: Add the name of the inventory item you are adding, the amount of the item you are adding and the unit it is measured in the respective boxes below'};
	$scope.alert8 = {type: 'warning', msg: 'Page help: To search for an inventory item, type in the name of the item and the option to edit will appear'};
	$scope.alert9 =	{type: 'warning', msg: 'Page help: First click on display inventory to see all the inventory items and then edit the quantity of the inventory item as needed.'};
	$scope.alert10 = {type: 'warning', msg: 'Page help: This page shows the orders on your plate. To remove an order click remove and to increase the quantity of your order use the arrows in the textbox. You can type in how you prefer your meal to be prepared in the preferences box.' };
	$scope.alert11 = {type: 'warning', msg: 'Page help: To edit your profile click on your name in the top navigation bar and then click on edit profile which will direct you to a page to edit your profile settings'};
	$scope.alert12 = {type: 'warning', msg: 'Page help: To edit your profile simply edit the text boxes and/or check boxes and then click save profile to save your changes'};
	$scope.alert13 = {type: 'warning', msg: 'Page help: This page is only accesible to the Super User and Admin User. Here you can edit all the admin settings of the system that deal with the users.'};
	$scope.alert14 = {type: 'warning', msg: 'Page help: You can only assign a role to an existing user by typing in the user\'s employee ID and selecting their new role.'};
	$scope.alert15 = {type: 'warning', msg: 'Page help: You can change an employee id can be changed by typing in the current employee id and then typing the new employee id in the respective text boxes and then click on change employee id button.'};
	$scope.alert16 = {type: 'warning', msg: 'Page help: To remove an employee type the employee id in the respective textbox and click on the remove employee button.'};
	$scope.alert17 = {type: 'warning', msg: 'Page help: To set the system wide limit enter the new limit in the given textbox and click on the set system wide limit button.'};
	$scope.alert18 = {type: 'warning', msg: 'Page help: This page contains the branding settings needed to brand the canteen such as setting the canteen name.'};
	$scope.alert19 = {type: 'warning', msg: 'Page help: To set the canteen name type the desired name in the text box and then click on the set canteen name button, the page will refresh and the new canteen name will be visible in the browser tab, the home navigation bar and the home page.'};
	$scope.alert20 = {type: 'warning', msg: 'Page help: To upload an image for branding, click on the browse button and then select the desired image and then click on open, thereafter click on the upload image button - the image will now be visible on the canteen home page .'};
	$scope.alert21 = {type: 'warning', msg: 'Page help: This is the login page - you need to be registered to log in. If you are not registered click on the sign up button and follow the registration instructions. If you have forgotten your password click on forgot password link.'};
	$scope.alert22 = {type: 'warning', msg: 'Page help: This is the sign up page. Fill in your details below and then click the sign up button. If you are already registered click on the sign in button and log into your account'};
	$scope.alert23 = {type: 'warning', msg: 'Page help: This page will help you reset your password, type in your username and an e-mail will be sent to the e-mail account that is associated with your employee ID'};
	$scope.alert24 = {type: 'warning', msg: 'Page help: This page gives you details about your order - e.g. if it is ready for collection - and any other changes that might take place in the system.'};
	$scope.alert25 = {type: 'warning', msg: 'Page help: WELCOME! These buttons will help you navigate through this website, whenever you do not know what to do click on the button that looks like this one you just clicked and help will be right there! To start have a look at our menu page that can be found by clicking on the button that says Menu in the top navigation bar ;-)'};
	$scope.alert26 = {type: 'warning', msg: 'Page help: This page will display logs of all actions performed in the system - choose what type of audit you would like and the data range and then click the GET AUDITS button and the logs will be displayed.'};
	$scope.alert27 = {type: 'warning', msg: 'Page help: This page will generate invoices for the specified user'};
	$scope.alert28 = {type: 'warning', msg: 'Page help: This field allows the superuser to change the colour scheme for the system'};
	$scope.alert29 = {type: 'warning', msg: 'Page help: This page shows you how to contact the Cafeteria Management and find out how everything works or to lodge complaints or maybe even give compliments.'};
	$scope.alert30 = {type: 'warning', msg: 'Page help: To search for an menu category, type in the name of the category and the option to edit will appear'};
  	$scope.alert31 = {type: 'warning', msg: 'Page help: This page will give you the statistics of the menu items, the sold items and the most popular items'};
  	$scope.alert32 = {type: 'warning', msg: 'Page help: This allows user to search for statistics for the menu items sold in a given period of time'};
  	$scope.alert33 = {type: 'warning', msg: 'Page help: This allows user to view the most popular menu items sold by the cafeteria'};
  	$scope.alert34 = {type: 'warning', msg: 'Page help: This page will give the user the statistics for the used inventory'};
  	$scope.alert35 = {type: 'warning', msg: 'Page help: This allows the you as the cafeteria manager to select amount of inventory used in a given period of time'};
  	$scope.alert36 = {type: 'warning', msg: 'Page help: This page shows you the details of all the orders you made for the current month in tabular form'};
  	$scope.alert37 = {type: 'warning', msg: 'Page help: This page shows you the details of all the orders you made for the current month in graph form'};
  	$scope.alert38 = {type: 'warning', msg: 'Page help: This page allows you as the cashier to view people\'s orders and to process them accordingly'};
  	$scope.alert39 = {type: 'warning', msg: 'Page help: This allows you as the finance manager to generate the invoice for a user with the given employee ID for a given period of time'};
  	$scope.alert40 = {type: 'warning', msg: 'Page help: This allows you as the finance manager to generate the total amount spent for all the users for a given period of time'};
  	$scope.alert41 = {type: 'warning', msg: 'Page help: This allows you to view the statistics of the menu items in graph format'};
  	$scope.alert42 = {type: 'warning', msg: 'Page help: This allows you to view the statistics of the most popular items in graph format'};
		

//close alert will take alert box away
$scope.closeAlert = function(index) {
			$scope.alertUser = false;
};



		/*
			Dynamically add fields to the menu items page to add ingredients for a menu item.
		*/
		$scope.ingredients = {ingredients:[],quantities:[]};

		$scope.addFormField = function() {
			$scope.ingredients.ingredients.push('');
			$scope.ingredients.quantities.push('');
		};

  /*==Update functions ==*/

  /*
	Load all the ingredients of the searched menu item into loadedIngredients
	@founditem: the menu item that was searched and found.
  */
	$scope.loadedIngredients = {ingredients:[],quantities:[]};
	$scope.displayedMenuItems = false;

	$scope.loadIngredients = function() {
		for(var ingredient in $scope.foundItem.ingredients.ingredients)
		{
			$scope.loadedIngredients.ingredients.push($scope.foundItem.ingredients.ingredients[ingredient]);
			$scope.loadedIngredients.quantities.push($scope.foundItem.ingredients.quantities[ingredient]);
		}
  };

  /*
  Add more ingredients to the menu item being updated.
  Dynamically add fields to add more ingredients.
  Store the new ingredients that are added in addedUpdateIngredients.
  */
   $scope.addedUpdateIngredients = {ingredients:[],quantities:[]};

	$scope.addMoreIngredientsUpdate = function()
	{
			$scope.addedUpdateIngredients.ingredients.push('');
			$scope.addedUpdateIngredients.quantities.push('');
	};

	/*Remove an ingredient from the item being updated*/
	$scope.removedIngredients =[];
	$scope.removeIngredient = function(index)
	{
		//console.log('REMOVE:'+index + ' ' + $scope.loadedIngredients.ingredients[index]);
		$scope.removedIngredients[index] = 0;
		//console.log('Removed ingredients:'+$scope.removedIngredients);

	};

	/*Undo the remove ingredient function*/
	$scope.undoRemoveIngredient = function(index)
	{
		delete $scope.removedIngredients[index];
	};


		/*Update the menu item*/
		$scope.updateMenuItem = function()
		{

		for(var removedIngredient in $scope.removedIngredients)
		{
			if($scope.removedIngredients[removedIngredient] === 0)
			{
				delete $scope.loadedIngredients.ingredients[removedIngredient];
				delete $scope.loadedIngredients.quantities[removedIngredient];
			}

		}


			for(var removedIngredient in $scope.removedIngredients)
			{
				if($scope.removedIngredients[removedIngredient] !== '')
				{
					$scope.loadedIngredients.ingredients[removedIngredient] = '';
					$scope.loadedIngredients.quantities[removedIngredient] = '';
				}
			}
			//console.log('After removed:'+$scope.loadedIngredients.ingredients);
			var errorIngredient = false;

			/*Perform check to see if any of the ingredient or quantity fields are empty.*/
			for(var ingredient in $scope.loadedIngredients.quantities)
			{
				if($scope.loadedIngredients.quantities[ingredient] === null)
				{
					errorIngredient = true;
					$scope.errorMessage = 'Please fill in all the quantity fields.';
				}
			}

			if(!errorIngredient)
			{
				for (var i = 0; i < $scope.addedUpdateIngredients.ingredients.length; i++)
				{
					if($scope.addedUpdateIngredients.ingredients[i] === '' || $scope.addedUpdateIngredients.quantities[i] === '' || $scope.addedUpdateIngredients.quantities[i] === null)
					{
						errorIngredient = true;
						$scope.errorMessage = 'Please fill in all the ingredients and quantities fields.';
					}
				}

			}

			/*Perform check for duplicate ingredients in the extra added ingredients*/
			if(!errorIngredient)
			{
				for(var i = 0; i < ($scope.addedUpdateIngredients.ingredients.length-1); i++)
				{
					for(var j = i+1; j < ($scope.addedUpdateIngredients.ingredients.length); j++)
					{

						if($scope.addedUpdateIngredients.ingredients[i].localeCompare($scope.addedUpdateIngredients.ingredients[j])===0)
						{
							errorIngredient = true;
							$scope.errorMessage = 'Duplicate ingredients are not allowed.';
						}
					}
				}
			}
		//	console.log('error:'+errorIngredient);
		//	console.log('here');

			/*Perform check for duplicate ingredients in loaded ingredients and the extra added ingredients*/
			if(!errorIngredient)
			{
				for(var k = 0; k < ($scope.addedUpdateIngredients.ingredients.length); k++)
				{//console.log('here2');
					for(var g = 0; g < ($scope.loadedIngredients.ingredients.length); g++)
					{
					//	console.log('addedIngredient:'+$scope.addedUpdateIngredients.ingredients[k]+' loaded:'+$scope.loadedIngredients.ingredients[g]);
						if($scope.addedUpdateIngredients.ingredients[k].localeCompare($scope.loadedIngredients.ingredients[g])===0)
						{
							errorIngredient = true;
							$scope.errorMessage = 'Duplicate ingredients are not allowed.';
						}
					}
				}
			}
			/*Perform check to see if the menu item has at least one ingredient*/
			//console.log($scope.loadedIngredients.ingredients);
			//console.log($scope.addedUpdateIngredients.ingredients);

		/*Perform check to see if the menu item has at least one ingredient*/
		/*if(!errorIngredient)
		{
			if($scope.addedUpdateIngredients.ingredients.length == 0 && $scope.ingredients.ingredients.length == 0)
			{
				errorIngredient = true;
				$scope.errorMessage = 'The menu item must have at least one ingredient.';
			}
		}*/


		if(!errorIngredient)
		{
			for (var ingredient in $scope.loadedIngredients.ingredients)
			{
				if($scope.loadedIngredients.ingredients[ingredient] !== '')
				{
					$scope.addedUpdateIngredients.ingredients.push($scope.loadedIngredients.ingredients[ingredient]);
					$scope.addedUpdateIngredients.quantities.push($scope.loadedIngredients.quantities[ingredient]);
				}
			}
		}

		/*Perform check to see if the menu item has at least one ingredient*/
		var count = 0;
		var i = 0;
		while(count === 0 && i < $scope.addedUpdateIngredients.ingredients.length)
		{
			if($scope.addedUpdateIngredients.ingredients[i] !== null && $scope.addedUpdateIngredients.ingredients[i] !=='')
				count = 1;
			i++;
		}

		if(count === 0)
		{
			errorIngredient = true;
			$scope.errorMessage = 'The menu item must have at least one ingredient.';
		}

		if(errorIngredient)
		{
			$scope.loadedIngredients = {ingredients:[],quantities:[]};
			$scope.loadIngredients();
		}


			if(!errorIngredient)
			{
				$scope.errorMessage = null;
				$scope.updateItemName = $scope.updateItemName.toLowerCase();
				$scope.successFind = null;
				var reqObj = {itemName:$scope.foundItem.itemName.toLowerCase(), updateItemName: $scope.updateItemName, price:$scope.updateItemPrice, description:$scope.updateItemDescription, category : $scope.updateItemCategory, ingredients:$scope.addedUpdateIngredients};
				$http.post('/orders/updateMenuItem',reqObj).success(function(response){
				$scope.successMessage = response.message;
				$scope.itemNameSearch = $scope.updateItemName = $scope.updateItemPrice = $scope.updateItemCategory = $scope.updateItemDescription = null;
			    $scope.addedUpdateIngredients = {ingredients:[],quantities:[]};
				$scope.removedIngredients =[];
				$scope.loadedIngredients = {ingredients:[],quantities:[]};
				$scope.showme = false;
				}).error(function(response){
					$scope.errorMessage = response.message;
					$scope.addedUpdateIngredients = {ingredients:[],quantities:[]};
					$scope.removedIngredients =[];
					$scope.loadedIngredients = {ingredients:[],quantities:[]};

					/*Reload all of the ingredients*/
					$scope.loadIngredients();

				});
			}
		};

		/*Removing add ingredients option*/
		$scope.removeIngredientOptionUpdate = function(index)
		{
			$scope.addedUpdateIngredients.ingredients.splice(index, 1);
			$scope.addedUpdateIngredients.quantities.splice(index, 1);
		};


/*==== end of update functions ===*/

        /**
		Add product to favourites
		*/
		$scope.favourite = function(itemName)
		{
			//console.log('item'+itemName);
		};


//search for item
        $scope.searchMenu = function(isValid) {
        if(isValid){
					console.log('hello');
					$scope.showme = false;
					$scope.successFind = $scope.errorFind = null;
					$scope.successMessage = $scope.errorMessage = null;


	                var reqObj = {itemName: $scope.menuNameSearch.toLowerCase()};
	                $http.post('/menu/search', reqObj).success(function(response){

						//$scope.showme = true;
						 $scope.successFind = response.message;
						 console.log(response.message);
						//Set the values for the item being updated.
						$scope.foundItem = response.menuItem;
						$scope.updateItemName = $scope.foundItem.itemName;
						$scope.updateItemCategory = $scope.foundItem.category;
						$scope.updateItemPrice = $scope.foundItem.price;
						$scope.updateItemDescription = $scope.foundItem.description;

					//console.log('Item found:'+$scope.foundItem.ingredients.ingredients);
                }).error(function(response){
					$scope.errorFind = response.message;
					$scope.errorMessage=response.message;
					//console.log('here');
                });
            }
						console.log('nope...');
        };

		$scope.uploadImage = function(isValid){
			if(isValid){
				var fd = new FormData();
				fd.append('file', $scope.upload);
				fd.append('data', $scope.foundItem.itemName);

				$http.post(url, fd, {
					headers : {
						'Content-Type' : undefined
					},
					transformRequest : angular.identity
				}).success(function(data){
					console.log(data);
				}).error(function(data){
					console.log(data);
				});
				//console.log()
			}
		};
		/*Functions for creating a new menu item*/

		 /* Create new Menu Item*/
		$scope.createMenuItem = function(isValid) {
			$scope.success = $scope.error = null;


		//Check if any of the ingredient name or ingredient quantity fields are empty
		var errorIngredient = false;

		for (var i = 0; i < $scope.ingredients.ingredients.length; i++)
		{
			if($scope.ingredients.ingredients[i] === '' || $scope.ingredients.quantities[i] === '' || $scope.ingredients.quantities[i] === null)
			{
				errorIngredient = true;
				$scope.error = 'Please fill in all the ingredients fields.';
			}
		}

		if(!errorIngredient)
		{
			for(var i = 0; i < ($scope.ingredients.ingredients.length-1); i++)
			{
				for(var j = i+1; j < ($scope.ingredients.ingredients.length); j++)
				{

					if($scope.ingredients.ingredients[i].localeCompare($scope.ingredients.ingredients[j])===0)
					{
						errorIngredient = true;
						$scope.error = 'Duplicate ingredients are not allowed.';
					}
				}
			}
		}

		/*Perform check to see if the menu item has at least one ingredient*/
		if(!errorIngredient)
		{
			if($scope.ingredients.ingredients.length === 0)
			{
				errorIngredient = true;
				$scope.error = 'The menu item must have at least one ingredient.';
			}
		}

		if(!errorIngredient)
		{
				if (isValid) {
				var reqObj = {itemName: $scope.menuItem.itemNameAdd.toLowerCase(), description: $scope.menuItem.itemDescription, price:$scope.menuItem.itemPrice,
				category:$scope.menuItem.itemCategory, ingredients:$scope.ingredients};
				$http.post('/orders/createMenuItem', reqObj).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;//response.message;
				$scope.sucess = 'Item added to the menu.';
				$scope.menuItem = null;
				$scope.ingredients = null;
				$scope.ingredients = {ingredients:[''],quantities:['']};
				}).error(function(response) {
					$scope.error = response.message;
				});
				}
			}
		};

		/*CreateMenuCategory */
	 $scope.createMenuCatagory = function(isValid) {
		 $scope.success=false;
		 if (isValid){

			 //console.log('You have validated!');
			 if($scope.categoryName === null){
				// console.log('invalid')
				 $scope.error = true;
				 $scope.error = 'No category added, Please fill in the textbox to add a category';
			 }else{
				 var name = {
					 category:  $scope.categoryName.toLowerCase()
				 };
				 //console.log($scope.categoryName);
				 $http.post('/orders/createMenuCategory', name).success(function(response) {
				 // If successful show success message and clear form
				 if(response.message.localeCompare('The category already exists') === 0){
					 $scope.success = null;

					 $scope.error = true;//response.message;
					 $scope.error = 'The category already exists';
					 //console.log("already exist");
				 }else{
					 //console.log('responce : ' + response.message);

					// $scope.error.clear;//
					 $scope.error = null;
					 $scope.success = true;//response.message;
					 $scope.success = 'Category added to the menu.';
					 $scope.categoryName ='';


			 	 }
				 }).error(function(response) {
					 //console.log("error");
					 $scope.error ='The category already exists ';
				 });
				 }
			 }
		 };


		/*Removing add ingredients option*/
		$scope.removeIngredientOption = function(index)
		{
			$scope.ingredients.ingredients.splice(index, 1);
			$scope.ingredients.quantities.splice(index, 1);
		};
/*End of functions for creating a new menu item*/



  //Filter Menu items for search bar
  $scope.searchBar = function (row){
     var itemN = $scope.menuNameSearch.toLowerCase();
     if ((angular.lowercase(row.itemName)).contains(itemN)) {
          return (angular.lowercase(row.itemName));
    }
};

// filter Menu items according to the selected category
$scope.searchBarDynamic = function(row){
	var itemN = $scope.selectedCategory.toLowerCase();
	if ((angular.lowercase(row.itemName)).contains(itemN)) {
			 return (angular.lowercase(row.itemName));
 }
};






		//get menu items from database on the server side
		$scope.loadMenuItems = function(){
			$scope.navClicked = false;
			$cookies.selectedCategory = JSON.stringify('all');
			$scope.selectedCategory = JSON.parse($cookies.selectedCategory);
			$http.get('/loadMenuItems').success(function(response) {

		  //console.log(response.message); // testing
			var displayItems = response.message;

			for(var item in displayItems)
			{
				if(displayItems[item].itemName.length >1)
					displayItems[item].itemName = displayItems[item].itemName.charAt(0).toUpperCase() + displayItems[item].itemName.slice(1);
		//		console.log(displayItems[item].itemName);
			}


			$scope.menuItems = response.message;

			//hide image by default
			for(var i = 0; i < $scope.menuItems.length; i++){
				$scope.menuItems[i].displayImage = false;
			}

			var inStock = true;
			//var notInStock = 'Not in stock';

			for(var itemName in response.message){
				$scope.menuItems[itemName].stock = true;
				// now check if the inventory items are indeed available
				if(response.message[itemName].itemInStock === false){ // then item is marked as out of stock by cafeteria manager for reasons other than inventory
							$scope.menuItems[itemName].stock = false;
				}else{ // check the inventory if all items are available
							$scope.menuItems[itemName].stock= $scope.checkStock(response.message[itemName]);
				}
			}
		}).error(function(response) {
			$scope.menuItems = 'Error loading menu Items';
		});
	};

	/*loadMenuCategories
	*/
	$scope.loadMenuCategories = function(){
		console.log('loading menu Categories');
		$http.get('/loadMenuCategories').success(function(response) {
		$scope.menuCatagory = response.message;
		$scope.cat = response.message;
	console.log(response.message);
	}).error(function(response) {
		$scope.menuItems = 'Error loading categories';
	});
	};



        /*
         * Check if an ingredient is in stock or not
        */
        $scope.checkStock = function(menuItemName){
					for(var inventoryItem in menuItemName.ingredients.ingredients) {
						var name = menuItemName.ingredients.ingredients[inventoryItem]; // name of ingredient
						var quantity = menuItemName.ingredients.quantities[inventoryItem];
						// now check that the amount in the inventory is more than the amount needed for this menu item
							var ingredient = {
								ingredientName: name,
								ingredientQuantity: quantity
							};

							$http.post('/inventoryItems', ingredient).success(function(response2) {
								if(response2.message[0].length === 0){
										menuItemName.stock = false;
								}else{
								if(response2.message[0][0].quantity >= response2.message[1]){
										if(menuItemName.stock !== false){
												menuItemName.stock = true;
												}
											}else {
													menuItemName.stock = false;
											}
								}
							}).error(function(response2) {
										$scope.error = response2.message;
								});
					}
					return menuItemName.stock;
        };

		/*
		Delete a menu item
		*/
		$scope.deleteMenuItem = function()
		{
			$scope.successFind = null;
			$scope.menuNameSearch=$scope.menuNameSearch.toLowerCase();
			var reqObj = {itemName:$scope.menuNameSearch};
			$http.post('/orders/deleteMenuItem',reqObj).success(function(response){
				$scope.successMessage = response.message;
				$scope.itemNameSearch = null;
			}).error(function(response){
				$scope.errorMessage = response.message;
			});
		};


		/*
	// Remove existing menu item
		$scope.remove = function(menuItem) {
			if ( menuItem ) {
				menuItem.$remove();

				for (var i in $scope.menuitems) {
					if ($scope.menuitems [i] === menuItem) {
						$scope.menuitems.splice(i, 1);
					}
				}
			} else {
				$scope.menuItem.$remove(function() {
					$location.path('menuitmes');
				});
			}
		};*/

		// Update existing menu item
		$scope.update = function() {
			var menuItem = $scope.menuItem;

			menuItem.$update(function() {
				$location.path('menuitems/' + menuItem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of menu items
		$scope.find = function() {
			$scope.menuItem = MenuItems.query();
		};

		// Find existing menu item
		$scope.findOne = function() {
			$scope.menuItem.itemNameSearch = MenuItems.get({
				menuItemId: $stateParams.menuItemId
			});
		};


		/*Search, update, and delete a menu category*/
			$scope.searchMenuCategory = function(isValid){
			if(isValid){
					$scope.successFind = $scope.errorFind = null;
					$scope.successMessage = $scope.errorMessage = null;
					var reqObj = {categoryName: $scope.categoryNameSearch.toLowerCase()};
					$http.post('/searchMenuCategory', reqObj).success(function(response){
					$scope.successFind = response.message;

					//Fill in the fields for the update function
					$scope.oldCategoryName = $scope.categoryNameSearch.toLowerCase();
					$scope.newCategoryName = $scope.categoryNameSearch.toLowerCase();

					$scope.categoryActive = response.foundcategory.active;


					console.log('FOUND:'+$scope.categoryActive);

					}).error(function(response){
							$scope.errorFind = response.message;
							$scope.errorMessage=response.message;
					});
			}
		};

		$scope.updateMenuCategory = function(isValid){
				if(isValid){
					$scope.successFind = null;
	        $scope.successMessage = $scope.errorMessage = null;
					$scope.newCategoryName = $scope.newCategoryName.toLowerCase();
						console.log('Active:'+$scope.categoryActive);
					var reqObj = {oldCategoryName: $scope.oldCategoryName, newCategoryName: $scope.newCategoryName, active: $scope.categoryActive};

					  $http.post('/updateMenuCategory', reqObj).success(function(response) {

							$scope.successMessage = response.message;
							$scope.categoryNameSearch = $scope.newCategoryName = null;
							$scope.categoryNameSearch = '';

							/*Upate the category names for all menu items*/
							$http.post('/updateCategoryMenuItems', reqObj).success(function(response) {

								$scope.successMessage = response.message;
								$scope.categoryNameSearch = $scope.newCategoryName = null;
								$scope.categoryNameSearch = '';

							}).error(function(response) {
									$scope.errorMessage = response.message;
							});

						}).error(function(response) {
								$scope.errorMessage = response.message;
						});

				}
		};

		/*Delete a menu category*/
		$scope.deleteMenuCategory = function(){
			$scope.successFind = null;
			$scope.successMessage = $scope.errorMessage = null;
			$scope.categoryNameSearch=$scope.categoryNameSearch.toLowerCase();
		//	console.log('Delete:'+$scope.menuNameSearch);
			var reqObj = {categoryName: $scope.categoryNameSearch};
			$http.post('/orders/deleteMenuCategory',reqObj).success(function(response){
					$scope.successMessage = response.message;
					$scope.categoryNameSearch = $scope.newCategoryName = null;
					$scope.categoryNameSearch = '';
			}).error(function(response){
				$scope.errorMessage = response.message;
			});
		};

		/*
		 * Add to plate. Last edited by {Rendani Dau}
		 */
		//Helper function to determine if item is in array(i.e. item is in plate)
		var indexOfItem = function(arr, item){
			for(var i = 0; i < arr.length; i++){
				if(arr[i].itemName === item.itemName)
					return i;
			}
			return -1;
		};

		/*
			Reporting for menuItems
		*/

		/*This function stores all the names of the menu items in an array so that
			it can be displayed in an HTML page*/

		$scope.loadAllMenuItems = function(){
						$http.get('/loadMenuItems').success(function(response) {

								$scope.menuItems = response.message;
								var itemsArray = [];
								var counter = 0;

								for(var itemName in response.message){
									itemsArray[counter] = response.message[itemName];
									counter++;
								}

								$scope.menuItems = itemsArray;

						}).error(function(response) {
						$scope.inventoryItems = 'Error loading menu Items';
					});
		};

		/*This function generates a report that shows the amount of the selected
			items sold over time.*/
		$scope.generateSoldReport = function(){
				$http.post('orders/generateSoldReport',{items: $scope.soldItems, start: $scope.startDateSold, end: $scope.endDateSold},{responseType:'arraybuffer'}).success(function(response){


				 var file = new Blob([response], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var fileName = 'test.pdf';
					var a = document.createElement('a');
					document.body.appendChild(a);
					a.setAttribute('style', 'display: none');

					a.href =  fileURL;
									a.download = fileName;
									a.click();

				}).error(function(response){
					console.log(response);
				});
		};

		/*This function adds the selected item to be displayed in the soldReport*/
		$scope.soldItems = [];
		$scope.addSoldItem = function()
		{
				$scope.soldItems.push($scope.soldItem);
		};

		$scope.removeSoldItem = function()
		{
			var index = -1;
			for(var i = 0; i != $scope.soldItems.length; i++)
				if($scope.soldItems[i] === $scope.removeItem)
					index = i;

				if(index >= 0)
					$scope.soldItems.splice(index,1);

		};

//helper function to graph data
		$scope.groupItems = function(item){
				$scope.container1Data[item.category].push(item);
				$scope.container1Data[item.category].category = item.category;
				$scope.container1Data[item.category].amount = $scope.container1Data[item.category].amount + item.quantity;
				if($scope.container1Data[item.category].items[item.itemName]){
						$scope.container1Data[item.category].items[item.itemName][0][1] = $scope.container1Data[item.category].items[item.itemName][0][1] + item.quantity;
				}else{
					$scope.container1Data[item.category].items[item.itemName] = [];
						var tempArray = [];
						tempArray[0] = item.itemName;
						tempArray[1] = item.quantity;
						$scope.container1Data[item.category].items[item.itemName].push(tempArray);
				}

		};

//helper function to graph data
		$scope.groupItems2 = function(item){
			var tempArray = [];
			var count = 0;
			for(var items in item){
					tempArray[count] = item[items][0];
					count++;
			}
			return tempArray;

		};

//generating the graph data for menu item statistics
		$scope.generateReport = function(){
			var date = new Date($scope.endDateReport);
			date.setHours(23,59,59);

			$http.post('orders/generateReport',{start: $scope.startDateReport, end: $scope.endDateReport},{responseType:'JSON'}).success(function(response){
				var  containerData = [];

				for(var i = 0; i < response.message.length; i++){
					if($scope.container1Data[response.message[i].category]){
						$scope.groupItems(response.message[i]);
					}else {
						$scope.container1Data[response.message[i].category] = [];
						$scope.container1Data[response.message[i].category].items = [];
						$scope.container1Data[response.message[i].category].amount = 0;
						$scope.container1Data[response.message[i].category].category = response.message[i].category;
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
				for(var con in $scope.container1Data ){
					containerData[count] = {
						name: $scope.container1Data[con].category,
						y: $scope.container1Data[con].amount,
						drilldown: $scope.container1Data[con].category
					};
					count++;
				}

				count = 0;
				for(var con in $scope.container1Data){
				$scope.container1Data[con].items  = $scope.groupItems2($scope.container1Data[con].items);
					$scope.container1drilldownData[count] = {
						'id': $scope.container1Data[con].category,
						'data': $scope.container1Data[con].items
					};
					count++;
				}

			$scope.container1Data1  = containerData;

			$cookies.container1Data1 = JSON.stringify($scope.container1Data1);
			$scope.container1Data1 = JSON.parse($cookies.container1Data1);
			$cookies.container1drilldownData = JSON.stringify($scope.container1drilldownData);
			$scope.container1drilldownData = JSON.parse($cookies.container1drilldownData);
			$location.path('/reporting/menuItemsStats');

			}).error(function(response){
				console.log(response);
			});

		};

		/*This funtion generates a report that shows the most popular menu itmes over
			a period of time*/
		$scope.generatePopularReport = function(){
			$http.post('orders/generatePopularReport',{start: $scope.startDate, end: $scope.endDate, numItems: $scope.numItems},{responseType:'JSON'}).success(function(response){

				var count = 0;
				for(var i = 0; i < response.message.length; i++){
					$scope.container2Data[count] = {
						name: response.message[i].id,
						y: response.message[i].data,
						drilldown: response.message[i].id
					};
					count++;
				}
				$cookies.container2Data = JSON.stringify($scope.container2Data);
				$scope.container2Data = JSON.parse($cookies.container2Data);
				$location.path('/reporting/mostPopularItems');

			}).error(function(response){
				console.log(response);
			});
		};

		$scope.inventoryReport = function(){
			console.log('Hi');
				$http.post('orders/inventoryReport',{start: $scope.startDateReport, end: $scope.endDateReport},{responseType:'JSON'}).success(function(response){
					console.log(response);


				}).error(function(response){
					console.log(response);
			});

		};

		$scope.addToPlate = function(itemName){
			itemName = itemName.toLowerCase();
			var _price;
			var _category;
			var _ingredients = [];
			var _quantities = [];
			for(var j = 0; j < $scope.menuItems.length; j++){
				console.log('itemName:'+itemName+ ' MenuItems:'+$scope.menuItems[j].itemName);
				console.log('CategoryMenuItems:'+$scope.menuItems[j].category);
				if(itemName === $scope.menuItems[j].itemName.toLowerCase()){
					_price = $scope.menuItems[j].price;
					_category = $scope.menuItems[j].category;
					_ingredients = $scope.menuItems[j].ingredients.ingredients;
					_quantities = $scope.menuItems[j].ingredients.quantities;
					break;
				}
			}
			var y = {
				itemName: itemName,
				price: _price,
				ingredients: _ingredients,
				quantities: _quantities,
				category: _category,
				quantity: 1
			};

			if($cookies.plate){
					var existing = JSON.parse($cookies.plate);

					if(indexOfItem(existing, y) === -1)
						existing[existing.length] = y;

					$cookies.plate = JSON.stringify(existing);
			}
			else
			{
				var plt = [];
				plt[0] = y;
				$cookies.plate = JSON.stringify(plt);
			}
			$rootScope.$broadcast('plateUpdated');
		};


		//$scope.view = true;
        $scope.viewImage = function(item) {
			item.displayImage = item.displayImage === false ? true : false;
        };

        $scope.checkCMUser = function(){
            if(!Authentication.user) {
                $location.path('/');
            }
            else if(Authentication.user.roles[0] !== 'cafeteriaManager') {
                $location.path('/');
            }
        };


//Directive that returns an element which adds input boxes
menuItemsModule.directive('addmoreingredients', function(){
	return {
		restrict: 'E',
		template: '<button addbuttons class="btn btn-large btn-primary">Add more ingredients</button>'
	};
});



//Directive for adding input boxes on click
menuItemsModule.directive('addbuttons', function($compile){
	return function(scope, element, attrs){
		element.bind('click', function(){
			scope.count++;

			angular.element(document.getElementById('space-for-more-ingredients')).append($compile('<div ng-init="loadInventoryItems()" data-ng-controller="InventoryController"><label>Ingredient</label><select id ="itemCategory" name ="itemCategory" class = "form-control" data-ng-model ="menuItem.itemCategory"><option  ng-repeat="item in inventoryItems" value = "Toasted Sandwiches">{{item.productName}} {{item.unit[0]}}</option></select><br><label>Quantity</label><input type ="number" class = "form-control" min = 0 id="addedQuantity" placeholder = "quantity" name ="addedQuantity"></div></div>')(scope));

		});
	};
});


}
]);
