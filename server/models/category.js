const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
	description:{
		type: String,
		unique: true,
		required: [true, 'Field description is required']
	},
	usuario:{
		type: Schema.Types.ObjectId,
		ref: 'Usuario'
	}
});

module.exports = mongoose.model('Category', categorySchema);
