var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');



router.get('/', function(req, res, next){
	mongoose.model('empleado').find(function(err, empleados){
		res.render('empleados/index', {title:'Oglit', oglit: "Cambiar el mundo", empleados: empleados});
	});
	
});


module.exports = router;