'use strict';

(function() {
    // settings/profile controller Spec
    describe('SettingsController', function() {

        // Initialize global variables
        var SettingsController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

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
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the SettingsController controller
            SettingsController = $controller('SettingsController', {
                $scope: scope
            });
        }));

/* Commented out for now - will need to check it
      it('$scope.updateUserProfile() should update profile if valid info entered', function() {
            // Test expected GET request
            //$httpBackend.when('POST',	'/').respond();

            scope.updateUserProfile();
           // $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });

        it('$scope.viewUserProfile() should allow user to view profile', function() {
            // Test expected GET request
          //  $httpBackend.when('POST',	'/settings/profileView').respond();

            scope.viewUserProfile();
            // $httpBackend.flush();

            // Test scope value
            expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });
*/
        it('$scope.changeUserPassword() should let user change their password if a valid one was entered', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(200,'password');

            scope.changeUserPassword();
             $httpBackend.flush();

            // Test scope value
            expect(scope.passwordDetails).toEqual(null);
            expect(scope.success).toEqual(true);
            //expect($location.url()).toEqual('/');
        });

        it('$scope.changeUserPassword() should send an error message if new password is too short', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Password should be at least 7 characters long.'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            expect(scope.error).toEqual('Password should be at least 7 characters long.');
        });

        it('$scope.changeUserPassword() should send an error message if the current password is incorrect', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Current password is incorrect'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            expect(scope.error).toEqual('Current password is incorrect');
        });

        it('$scope.changeUserPassword() should send an error message if the passwords do not match', function() {
            // Test expected GET request
            $httpBackend.when('POST',	'/users/password').respond(400, {
                'message': 'Passwords do not match'
            });

            scope.changeUserPassword();
            $httpBackend.flush();

            expect(scope.error).toEqual('Passwords do not match');
        });


    });
}());
/**
 * Created by Semaka Malapane on 2015/07/08.
 *//*

'use strict';

*/
/**
 * Module dependencies.
 *//*

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

*/
/**
 * Globals
 *//*

var user, user2;

*/
/**
 * Unit tests
 *//*

describe('User Model Unit Tests:', function() {
    before(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            role: 'user',
            limit: '500',
            recipientEmailAddress: 'test@test.com'
        });
        user2 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            role: 'user',
            limit: '500',
            recipientEmailAddress: 'test@test.com'
        });

        done();
    });

    describe('Method Update', function() {
        */
/*****
         * tests the user is logged in
        it('should begin with user logged in', function(done) {
            User.signin().find({}, function(err, users) {
                users.should.have.length(0);
                done();
            });
        });
         *//*

        it('be able to update the name of the user', function(done) {
            user.firstName = 'Bob';
            user.update(done);
        });

        it('be able to update the last name of the user', function(done) {
            user.lastName = 'Smith';
            user.update(done);
        });

        it('be able to update the limit of the user', function(done) {
            user.limit = 100;
            user.update(done);
        });

        it('be able to update the email address of the user', function(done) {
            user.email = 'Me@you.com';
            user.update(done);
        });

        it('be able to update where the monthly bill will be sent to', function(done) {
            user.recipientEmailAddress = 'Me@you.com';
            user.update(done);
        });

        it('should fail if the name is ', function(done) {
            user2.firstName = '';
            return user2.update(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail if the email address is invalid', function(done) {
            user2.email = 'me.com';
            return user2.update(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail if the limit is less than R0', function(done) {
            user2.limit = -1;
            */
/*return*//*
 user2.update(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});

*/