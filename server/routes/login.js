const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', function (req, res) {

	let body = req.body;

	Usuario.findOne({ email: body.email }, (err, userDB) => {
		if(err){
			return res.status(500).json({
				ok:false,
				err
			});
		}

		if( !userDB || !bcrypt.compareSync(body.password, userDB.password) ){
			return res.status(400).json({
				ok:false,
				err: {
					message: 'User or pass incorrect'
				}
			});
		}

		let token = jwt.sign({
			usuario: userDB
		}, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

		res.json({
			ok:true,
			usuario: userDB,
			token
		});

	});
});

//Google conf
async function verify(token) {
  	const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  	});
	const payload = ticket.getPayload();

	return {
		name: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true
	}
}
//verify().catch(console.error);

app.post('/google', async (req, res) => {
	let token = req.body.idtoken;

	let googleUser = await verify(token)
						.catch( e => {
							res.status(403).json({
								ok: false,
								err: e
							});
						});

	Usuario.findOne({email: googleUser.email }, (err, userDB) => {
		if(err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		if(userDB) {
			if(userDB.google === false) {
				return res.status(400).json({
					ok:false,
					err: {
						message: 'Please authenticate normally'
					}
				});
			} else {
				let token = jwt.sign({
					usuario: userDB
				}, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

				return res.json({
					ok: true,
					user: userDB,
					token
				});
			}
		} else {
			//If user doesnt exist in DB
			let user = new Usuario();

			user.nombre = googleUser.name;
			user.email = googleUser.email;
			user.img = googleUser.img;
			user.google = true;
			user.password = ':)';

			user.save((err, userDB) => {
				if(err) {
					return res.status(500).json({
						ok:false,
						err
					});
				}

				let token = jwt.sign({
					usuario: userDB
				}, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

				return res.json({
					ok: true,
					user: userDB,
					token
				});
			});
		}

	});
});

module.exports = app;
