var bcrypt = require("bcrypt-nodejs");
var mongodb = require("mongoose");
var Schema = mongodb.Schema;
var SALT_WORK_FACTOR = 10;

var conn = mongodb.createConnection("mongodb://localhost/testDB", function(err){
	if(err) throw err;
});

var UserSchema = conn.model("users", new Schema({
	name: String,
	password: String
}, {versionKey: false}), "users");

var pass = "hisPass";
var passHash;
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
	if(err) throw (err);
	
	bcrypt.hash(pass, salt, null, function(err, hash){
		if(err) throw (err);
		passHash = hash;
		
		new UserSchema({
			name: "james",
			password: hash
		}).save(function(err){
			if(err) throw err;
		});
		
		
		pass = "hisPass";
		bcrypt.compare(pass, passHash, function(err, isMatch){
			if(err) throw err;
			console.log("Password should match. " + isMatch);
		});
		
		pass = "herPass";
		bcrypt.compare(pass, passHash, function(err, isMatch){
			if(err) throw err;
			console.log("Password should not match. " + isMatch);
		});
	});
});



