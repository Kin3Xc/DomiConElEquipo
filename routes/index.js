var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Miembros', title2: 'Area de Usuarios'});
});

module.exports = router;
