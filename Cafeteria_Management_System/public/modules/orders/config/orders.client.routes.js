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
		state('menu', {
			url: '/menu',
			templateUrl: 'modules/orders/views/menu/menu.html'
		}).
		state('menuTramazini', {
			url: '/menu/tramezzinis',
			templateUrl: 'modules/orders/views/menu/menu-Tramezzinis.html'
		}).
		state('menuToastedSandwiches', {
			url: '/menu/toastedSandwiches',
			templateUrl: 'modules/orders/views/menu/menu-ToastedSandwiches.html'
		}).
		state('menuBurgerBar', {
			url: '/menu/burgerBar',
			templateUrl: 'modules/orders/views/menu/menu-burgerBar.html'
		}).
		state('menuDailyLunch', {
			url: '/menu/dailyLunch',
			templateUrl: 'modules/orders/views/menu/menu-dailyLunch.html'
		}).
		state('menuSaladBar', {
			url: '/menu/saladBar',
			templateUrl: 'modules/orders/views/menu/menu-saladBar.html'
		}).
		state('menuSweetTreats', {
			url: '/menu/sweetTreats',
			templateUrl: 'modules/orders/views/menu/menu-sweetTreats.html'
		}).
		state('menuResaleItems', {
			url: '/menu/resaleItems',
			templateUrl: 'modules/orders/views/menu/menu-resaleItems.html'
		}).
		state('menuOnThSide', {
			url: '/menu/onTheSide',
			templateUrl: 'modules/orders/views/menu/menu-onTheSide.html'
		}).
		state('menuExtra', {
			url: '/menu/extra',
			templateUrl: 'modules/orders/views/menu/menu-extra.html'
		}).
		//-----------------end of menu page routes
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
