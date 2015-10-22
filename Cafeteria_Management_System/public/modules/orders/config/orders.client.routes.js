'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/menu/list-orders.client.view.html'
		}).
		//----------------menu items - routes
		state('menu-item', {
			url: '/menu-item',
			templateUrl: 'modules/orders/views/menu/menu-item.html'
		}).
		state('inventoryStats', {
			url: '/inventoryStats',
			templateUrl: 'modules/orders/views/reporting/inventoryStats.html'
		}).
		state('menu', {
			url: '/menu',
			templateUrl: 'modules/orders/views/menu/menu.html'
		}).
        state('notifications', {
            url: '/notifications',
            templateUrl: 'modules/orders/views/placedorders/notifications.html'
        }).
		state('menuItemsStats', {
		  url: '/reporting/menuItemsStats',
			templateUrl: 'modules/orders/views/reporting/menuItemsStats.html'
		}).
		state('mostPopularItems', {
			url: '/reporting/mostPopularItems',
			templateUrl: 'modules/orders/views/reporting/mostPopularItems.html'
		}).
		// view Orders page / on my plate page
		state('createOrder', {
			url: '/orders/create',
			templateUrl: 'modules/orders/views/menu/create-order.client.view.html'
		}).
		state('viewOrders', {
			url: '/placeOrder/viewOrders',
			templateUrl: 'modules/orders/views/placedorders/viewOrders.html'
		}).
		state('viewOrder', {
			url: '/orders/:orderId',
			templateUrl: 'modules/orders/views/menu/menu.html'
		}).
		state('editOrder', {
			url: '/orders/:orderId/edit',
			templateUrl: 'modules/orders/views/menu/edit-order.client.view.html'
		});
	}
]);
