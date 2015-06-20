var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.createConnection('mongodb://localhost/db1dani');
var db = mongoose.connection;




var UserSchema = mongoose.Schema({
	username:{
		type:String,
		index: true
	},
	nombre:{
		type:String
	},
	email:{
		type:String
	},
	password:{
		type:String,
		required: true,
		bcrypt: true
	},
	profileimage:{
		type:String
	}
}); // fin userSchema

var User = module.exports = mongoose.model('User', UserSchema);

// ahora defino funciones que el User model puede manejar
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if (err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
	if(err) throw err;
	// cambiar pass a hash
	newUser.password = hash;
	// crear el usuario en db	
	newUser.save(callback);	
	});
	
};	