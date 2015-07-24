/**
 * Created by rendani on 2015/07/23.
 */
'use strict';

(function() {
    // menuItems controller Spec
    describe('MenuItemsController', function() {
		// Initialize global variables
        var MenuItemsController,
            scope,
            $httpBackend,
            $stateParams,
            $location,
			$cookies;
		
		beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$cookies_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
			$cookies = _$cookies_;

            // Initialize the SettingsController controller
            MenuItemsController = $controller('MenuItemsController', {
                $scope: scope
            });
        }));
		
		it('$scope.updateMenuItem() should update menu item', function() {
             //Test expected POST request
             $httpBackend.expectPOST('/orders/updateMenuItem').respond(200, {'message': 'Product information successfully updated.'});
			scope.updateItemName = 'mock cheese sandwich';
			scope.foundItem = {};
			scope.foundItem.itemName = 'mock cheese and tomato sandwich item';
		   scope.updateMenuItem();
           $httpBackend.flush();

            expect(scope.successMessage).toEqual('Product information successfully updated.');
        });
		
		it('$scope.updateMenuItem() should not update menu item', function() {
             //Test expected POST request
             $httpBackend.expectPOST('/orders/updateMenuItem').respond(400, {'message': 'Error updating the product!'});
			scope.updateItemName = 'mock cheese sandwich';
			scope.foundItem = {};
			scope.foundItem.itemName = 'mock cheese and tomato sandwich item';
		   scope.updateMenuItem();
           $httpBackend.flush();

            expect(scope.errorMessage).toEqual('Error updating the product!');
        });
		
		it('$scope.searchMenu() should search and find menu item', function() {
             //Test expected POST request
             $httpBackend.expectPOST('/menu/search').respond(200, {'message': 'This menu item has been found', 'menuItem':{itemName: 'itemName', category: 'category', price: 10, description: 'a description'}});
			scope.menuNameSearch = 'mock search query';
			
			scope.searchMenu(true);
           $httpBackend.flush();

            expect(scope.successFind).toEqual('This menu item has been found');
        });
		
		it('$scope.searchMenu() should search and NOT find menu item', function() {
            //Test expected POST request
            $httpBackend.expectPOST('/menu/search').respond(400, {'message':'Menu item not found'});
			scope.menuNameSearch = 'mock search query';
			
			scope.searchMenu(true);
           $httpBackend.flush();

            expect(scope.errorFind).toEqual('Menu item not found');
        });
		
		it('$scope.createMenuItem() should create menu item', function() {
             //Test expected POST request
            $httpBackend.expectPOST('/orders/createMenuItem').respond(200);
			scope.menuNameSearch = 'mock search query';
			scope.menuItem = {
				itemNameAdd: 'mock item name',
				itemDescripton: 'mock item description',
				itemPrice: 10,
				category: 'mock category',
				ingredients: ['cheese','tomato','bread']
			};
			scope.createMenuItem(true);
			$httpBackend.flush();

            expect(scope.success).toEqual(true);
        });
		
		it('$scope.createMenuItem() should fail to create menu item', function() {
             //Test expected POST request
            $httpBackend.expectPOST('/orders/createMenuItem').respond(400, {'message':'Database error!'});
			scope.menuNameSearch = 'mock search query';
			scope.menuItem = {
				itemNameAdd: 'mock item name',
				itemDescripton: 'mock item description',
				itemPrice: 10,
				category: 'mock category',
				ingredients: ['cheese','tomato','bread']
			};
			scope.createMenuItem(true);
			$httpBackend.flush();

            expect(scope.error).toEqual('Database error!');
        });
		
		it('$scope.loadMenuItems() should load menu items', function() {
			 //Test expected GET request
            $httpBackend.expectGET('/loadMenuItems').respond(200, {'message':[{itemName: 'item 1', itemInStock: true},{itemName: 'item 2', itemInStock: false}]});
			
			scope.loadMenuItems();

            expect(scope.menuItems).not.toBe(null);
        });
		
		
		/*
		it('$scope.loadMenuItems() should NOT load menu items', function() {
			 //Test expected GET request
            $httpBackend.expectGET('/loadMenuItems').respond(400, {'message': 'Error loading menu items'});
			
			scope.loadMenuItems();

            expect(scope.menuItems).toEqual('Error loading menu Items');
        });
	
		
		it('$scope.deleteMenuItem() should delete menu item', function() {
			 //Test expected GET request
			$httpBackend.expectGET('/orders/deleteMenuItem').respond(200, {'message': 'Item deleted'});
			scope.menuNameSearch = 'mock search';
			scope.deleteMenuItem();

            expect(scope.successMessage).toEqual('Item deleted');
        });
		
		it('$scope.deleteMenuItem() should NOT delete menu item', function() {
			 //Test expected GET request
			$httpBackend.expectGET('/orders/deleteMenuItem').respond(400, {'message': 'Item could not be deleted'});
			scope.menuNameSearch = 'mock search';
			scope.deleteMenuItem();

            expect(scope.errorMessage).toEqual(''Item could not be deleted'');
        });
		
		/*it('$scope.addToPlate() should add menu item to plate', function() {
			scope.addToPlate();

            expect($cookies.plate).;
        });*/
		
	});
}());