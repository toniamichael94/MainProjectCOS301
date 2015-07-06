'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Placeorder = mongoose.model('Placeorder'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, placeorder;

/**
 * Placeorder routes tests
 */
describe('Placeorder CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Placeorder
		user.save(function() {
			placeorder = {
				name: 'Placeorder Name'
			};

			done();
		});
	});

	it('should be able to save Placeorder instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placeorder
				agent.post('/placeorders')
					.send(placeorder)
					.expect(200)
					.end(function(placeorderSaveErr, placeorderSaveRes) {
						// Handle Placeorder save error
						if (placeorderSaveErr) done(placeorderSaveErr);

						// Get a list of Placeorders
						agent.get('/placeorders')
							.end(function(placeordersGetErr, placeordersGetRes) {
								// Handle Placeorder save error
								if (placeordersGetErr) done(placeordersGetErr);

								// Get Placeorders list
								var placeorders = placeordersGetRes.body;

								// Set assertions
								(placeorders[0].user._id).should.equal(userId);
								(placeorders[0].name).should.match('Placeorder Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Placeorder instance if not logged in', function(done) {
		agent.post('/placeorders')
			.send(placeorder)
			.expect(401)
			.end(function(placeorderSaveErr, placeorderSaveRes) {
				// Call the assertion callback
				done(placeorderSaveErr);
			});
	});

	it('should not be able to save Placeorder instance if no name is provided', function(done) {
		// Invalidate name field
		placeorder.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placeorder
				agent.post('/placeorders')
					.send(placeorder)
					.expect(400)
					.end(function(placeorderSaveErr, placeorderSaveRes) {
						// Set message assertion
						(placeorderSaveRes.body.message).should.match('Please fill Placeorder name');
						
						// Handle Placeorder save error
						done(placeorderSaveErr);
					});
			});
	});

	it('should be able to update Placeorder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placeorder
				agent.post('/placeorders')
					.send(placeorder)
					.expect(200)
					.end(function(placeorderSaveErr, placeorderSaveRes) {
						// Handle Placeorder save error
						if (placeorderSaveErr) done(placeorderSaveErr);

						// Update Placeorder name
						placeorder.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Placeorder
						agent.put('/placeorders/' + placeorderSaveRes.body._id)
							.send(placeorder)
							.expect(200)
							.end(function(placeorderUpdateErr, placeorderUpdateRes) {
								// Handle Placeorder update error
								if (placeorderUpdateErr) done(placeorderUpdateErr);

								// Set assertions
								(placeorderUpdateRes.body._id).should.equal(placeorderSaveRes.body._id);
								(placeorderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Placeorders if not signed in', function(done) {
		// Create new Placeorder model instance
		var placeorderObj = new Placeorder(placeorder);

		// Save the Placeorder
		placeorderObj.save(function() {
			// Request Placeorders
			request(app).get('/placeorders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Placeorder if not signed in', function(done) {
		// Create new Placeorder model instance
		var placeorderObj = new Placeorder(placeorder);

		// Save the Placeorder
		placeorderObj.save(function() {
			request(app).get('/placeorders/' + placeorderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', placeorder.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Placeorder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Placeorder
				agent.post('/placeorders')
					.send(placeorder)
					.expect(200)
					.end(function(placeorderSaveErr, placeorderSaveRes) {
						// Handle Placeorder save error
						if (placeorderSaveErr) done(placeorderSaveErr);

						// Delete existing Placeorder
						agent.delete('/placeorders/' + placeorderSaveRes.body._id)
							.send(placeorder)
							.expect(200)
							.end(function(placeorderDeleteErr, placeorderDeleteRes) {
								// Handle Placeorder error error
								if (placeorderDeleteErr) done(placeorderDeleteErr);

								// Set assertions
								(placeorderDeleteRes.body._id).should.equal(placeorderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Placeorder instance if not signed in', function(done) {
		// Set Placeorder user 
		placeorder.user = user;

		// Create new Placeorder model instance
		var placeorderObj = new Placeorder(placeorder);

		// Save the Placeorder
		placeorderObj.save(function() {
			// Try deleting Placeorder
			request(app).delete('/placeorders/' + placeorderObj._id)
			.expect(401)
			.end(function(placeorderDeleteErr, placeorderDeleteRes) {
				// Set message assertion
				(placeorderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Placeorder error error
				done(placeorderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Placeorder.remove().exec();
		done();
	});
});