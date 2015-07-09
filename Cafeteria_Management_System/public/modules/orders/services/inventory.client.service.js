'use strict';

// Inventory service used for communicating with the users REST endpoint
angular.module('inventory').factory('Inventory', ['$resource',
	function($resource) {
		return $resource('inventory', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
