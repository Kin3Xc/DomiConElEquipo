 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var empleadosSchema = new Schema({
 	nombre:String,
 	edad:Number
 });


mongoose.model('empleado', empleadosSchema);


