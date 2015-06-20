var express = require('express');
var router = express.Router();
var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title2: "Member area"});
});

router.get('/register', function(req, res, next){
	res.render('register.jade', {title:'Registro'});
});

router.get('/login', function(req, res, next){
	res.render('login.jade', {title:'Ingresar'});
});

router.post('/register', function(req, res, next){
	// recibo los valores del formulario
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// checkear campo de imagen name="profileimage"
	if(req.files.profileimage){
		console.log('Uploading File...');

		// info de la name="profileimage" type="file"
		var profileImage = req.files.profileimage.originalname;
		var profileImageName = req.files.profileimage.name;
		var profileImageMime = req.files.profileimage.mimetype;
		var profileImagePath = req.files.profileimage.path;
		var profileImageExt = req.files.profileimage.extension;
		var profileImageSize = req.files.profileimage.size;
	} else {
		// si no da foto poner foto default
		var profileImageName = "noimage.png";
	}

	// form validation 1st arg igual a name="name"
	req.checkBody('name', 'Falta tu nombre').notEmpty();
	req.checkBody('email', 'Falta tu email').notEmpty();
	req.checkBody('username', 'Falta tu usuario').notEmpty();
	req.checkBody('email', 'Debe ser un email valido ej: tuemail@e.com').isEmail();
	req.checkBody('password', "Falta tu clave").notEmpty();
	req.checkBody('password2', "las claves no son iguales").equals(req.body.password);

	// Revisar Errores
	var errors = req.validationErrors();

	if(errors){
		res.render('register.jade', {
			errors: errors,
			name: name,
			email: email,
			password: password,
			password2: password2
		});
	} else{
		// si no hay errores en el formulario
		// apenas voy a crear el obj User
		// User viene del modelo/user
		var newUser = new User ({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});
		// para guardar en mongodb
		// Crear User invocando función de models/user
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			// si es creado en db mostrar en consola
			else console.log(user);
		});
		// Mostrar Success Message
		req.flash('success', 'you are now registered and may login');
		res.location('/');
		res.render('users/index', {title2: 'adentro'});
	}
});

// serialize and deserialize with passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// definir LocalStrategy para user en router post
passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) {
				throw err;
				console.log(err);
			}
			// si no existe el user en la db
			if(!user){
				console.log('Usuario no existe');
				return done(null, false, {message:'Usuario desconocido'});
			}
			// si no hay err y user si existe 
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					console.log('constraseña invalida');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});	
	}
));

router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'usuario o contraseña incorrecto'}), function(req, res){
	// if user athenticates
	console.log('Autenticación exitosa');
	req.flash('success', 'Ingreste de nuevo, Bienvenido otra vez!');
	res.redirect('/');
});


router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Bye, saliste del sistema');
	res.redirect('/users/login');
});


module.exports = router;




