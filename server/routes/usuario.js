const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');
const app = express();

app.get('/usuario', (req, res) => {
	let from = req.query.from || 0;
	from = Number(from);

	let limit = req.query.limit || 8;
	limit = Number(limit);

	Usuario.find({ estado: true }, 'nombre email role estado google img')
		.skip(from)
		.limit(limit)
		.exec( (err, usuarios) => {
			if(err){
				return res.status(400).json({
					ok:false,
					err
				});
			}

			Usuario.countDocuments({estado: true}, (err,total) => {
				res.json({
					ok: true,
					usuarios,
					total
				});
			});

			

		});

});

app.post('/usuario', (req, res) => {
	let body = req.body;

	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});

	usuario.save((err, userDB) => {
		if(err){
			return res.status(400).json({
				ok:false,
				err
			});
		}

		res.json({
			ok: true,
			usuario: userDB
		})
	});
});

app.put('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);

	let options = {
		new: true,
		runValidators: true
	};

	Usuario.findByIdAndUpdate(id, body, options, (err, userDB) => {

		if(err){
			return res.status(400).json({
				ok:false,
				err
			});
		}

		
		if(!userDB){
			return res.status(400).json({
				ok:false,
				err: {
					message: 'User doesnt found'
				}
			});
		}

		res.json({
		  	ok: true,
		  	usuario: userDB
		});

	});
});

app.delete('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {
  	
	let id = req.params.id;
	let changeStatus = {
		'estado' : false
	};

	Usuario.findByIdAndUpdate(id, changeStatus, {new:true}, (err, userDB) => {
		if(err){
			return res.status(400).json({
				ok:false,
				err
			});
		}

		res.json({
			ok: true,
			usuario: userDB
		});
	});

});

module.exports = app;