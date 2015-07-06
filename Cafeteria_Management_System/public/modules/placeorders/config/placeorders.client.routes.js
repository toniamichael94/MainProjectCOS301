'use strict';

//Setting up route
angular.module('placeorders').config(['$stateProvider',
	function($stateProvider) {
		// Placeorders state routing
		$stateProvider.
		state('listPlaceorders', {
			url: '/placeorders',
			templateUrl: 'modules/placeorders/views/list-placeorders.client.view.html'
		}).
		state('createPlaceorder', {
			url: '/placeorders/create',
			templateUrl: 'modules/placeorders/views/create-placeorder.client.view.html'
		}).
		state('viewPlaceorder', {
			url: '/placeorders/:placeorderId',
			templateUrl: 'modules/placeorders/views/view-placeorder.client.view.html'
		}).
		state('editPlaceorder', {
			url: '/placeorders/:placeorderId/edit',
			templateUrl: 'modules/placeorders/views/edit-placeorder.client.view.html'
		});
	}
]);