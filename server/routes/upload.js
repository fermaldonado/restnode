const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const User = require('../models/usuario');
const Product = require('../models/product');
const path = require('path');
const USERS = 'users';
const PRODUCTS = 'products';

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
	let type = req.params.type;
	let id = req.params.id;

	if (!req.files) {
	    return res.status(400).json({
	    	ok: false,
	    	err: {
	    		message: 'There is no file selected'
	    	}
	    });
	}

	//Type validation
	let validateTypes = [USERS, PRODUCTS];
	if( validateTypes.indexOf(type) < 0 ){
		return res.status(400).json({
			ok: false,
			message: 'Only valid types like ' + validateTypes.join(',')
		});
	}

	let file = req.files.file;
	let nameFileArray = file.name.split('.');
	let extension = nameFileArray[nameFileArray.length - 1];

	// Validate extensions
	let validExtensions = ['png','jpg','jpeg','gif'];

	if( validExtensions.indexOf(extension) < 0 ){
		return res.status(400).json({
			ok: false,
			message: 'Only valid extensions like ' + validExtensions.join(',')
		});
	}

	//Change file name
	let nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

	file.mv(`uploads/${ type }/${ nameFile }`, (err) => {
	    if (err)
	    	return res.status(500).json({
	    		ok: false,
	    		err
	    	});

	    // Load Image
	    if (type === USERS) {
	    	userImage(id, res, nameFile);
	    } else if (type === PRODUCTS) {
	    	productImage(id, res, nameFile);
	    }
	});
});

function userImage(id, res, nameFile) {
	User.findById(id, (err, userDB) => {
		if (err) {
			deleteFile(nameFile, USERS);
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!userDB) {
			deleteFile(nameFile, USERS);
			return res.status(400).json({
				ok: false,
				message: 'User does not exist'
			})
		}

		//Delete physically image saved in db
		deleteFile(userDB.img, USERS);

		// Save new image in DB
		userDB.img = nameFile;
		userDB.save( (err, userSaved) => {
			res.json({
				ok: true,
				user: userSaved,
				img: nameFile
			})
		});
	});
}

function productImage(id, res, nameFile) {
	Product.findById(id, (err, productDB) => {
		if (err) {
			deleteFile(nameFile, PRODUCTS);
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productDB) {
			deleteFile(nameFile, PRODUCTS);
			return res.status(400).json({
				ok: false,
				message: 'Product does not exist'
			})
		}

		//Delete physically image saved in db
		deleteFile(productDB.img, PRODUCTS);

		// Save new image in DB
		productDB.img = nameFile;
		productDB.save( (err, userSaved) => {
			res.json({
				ok: true,
				user: userSaved,
				img: nameFile
			})
		});
	});
}

function deleteFile(nameImage, type) {
	let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ nameImage }`);
	if (fs.existsSync(pathImage)) {
		fs.unlink(pathImage, () => {
			console.log(pathImage + ' deleted');
		});
	}
}

module.exports = app;