'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('profileView', {
			url: '/settings/profileView',
			templateUrl: 'modules/users/views/settings/profile.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
        state('superuser', {
            url: '/settings/adminSettings',
            templateUrl: 'modules/users/views/settings/adminSettings.html'
        }).
				state('admin', {
            url: '/settings/adminSettingsAdminRole',
            templateUrl: 'modules/users/views/settings/adminSettingsAdminRole.html'
        }).
        state('superuser2', {
            url: '/settings/brandingSettings',
            templateUrl: 'modules/users/views/settings/brandingSuperUser.html'
        }).
		state('auditSettings', {
			url: '/settings/audits',
			templateUrl: 'modules/users/views/settings/audits.html'
		}).
        state('cafeteriaManager', {
            url: '/manageInventory',
            templateUrl: 'modules/orders/views/inventory/manageInventory.html'
        }).
		 state('manageCafeteria', {
            url: '/manageCafeteria',
            templateUrl: 'modules/orders/views/menu/manageCafeteria.html'
        }).
		state('menuItemsStatistics', {
            url: '/menuItemsStatistics',
            templateUrl: 'modules/orders/views/menu/menuItemsStatistics.html'
        }).
		state('inventoryStatistics', {
								url: '/inventoryStatistics',
								templateUrl: 'modules/orders/views/menu/inventoryStatistics.html'
						}).
        state('cashier', {
            url: '/cashier',
            templateUrl: 'modules/users/views/settings/cashier.html'
        }).
        state('finance', {
            url: '/finance',
            templateUrl: 'modules/users/views/settings/finance.html'
        });
	}
]);
