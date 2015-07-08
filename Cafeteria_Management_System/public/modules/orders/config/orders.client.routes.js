'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/list-orders.client.view.html'
		}).
		state('createOrder', {
			url: '/orders/create',
			templateUrl: 'modules/orders/views/create-order.client.view.html'
		}).
		state('viewOrder', {
			url: '/orders/:orderId',
			templateUrl: 'modules/orders/views/view-order.client.view.html'
		}).
		state('editOrder', {
			url: '/orders/:orderId/edit',
			templateUrl: 'modules/orders/views/edit-order.client.view.html'
		});
	}
]);