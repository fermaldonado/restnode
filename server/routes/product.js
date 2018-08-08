const express = require('express');
const Product = require('../models/product');
const { verifyToken } = require('../middlewares/auth');
const app = new express();

//=======================================
// Get all products
//=======================================
app.get('/products', verifyToken, (req, res) => {
	let from = req.query.from || 0;
	from = Number(from);

	Product.find({ available: true })
	.skip(from)
	.limit(10)
	.populate('usuario', 'nombre email')
	.populate('category', 'description')
	.exec((err, products) => {
		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		res.json({
			ok: true,
			products
		})
	});
});

//=======================================
// Get product by id
//=======================================
app.get('/products/:id', verifyToken, (req, res) => {
	let id = req.params.id;

	Product.findById(id)
	.populate('usuario', 'nombre email')
	.populate('category', 'description')
	.exec((err, productDB) => {
		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		if (!productDB) {
			return res.status(400).json({
				ok:false,
				err: {
					message: 'Id incorrect'
				}
			});
		}

		res.json({
			ok: true,
			product: productDB
		});
	});
});

//=======================================
// Search product
//=======================================
app.get('/products/search/:value', verifyToken, (req, res) => {
	let value = req.params.value;

	let regExp = new RegExp(value, 'i');

	Product.find({ name: regExp, available: true })
	.populate('category', 'description')
	.exec((err, products) => {

		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		res.json({
			ok: true,
			products
		});
	});
});

//=======================================
// Create product
//=======================================
app.post('/products', verifyToken, (req, res) => {
	let body = req.body;

	let product = new Product({
		name: body.name,
	    price: body.price,
	    description: body.description,
	    available: body.available,
	    category: body.category,
	    usuario: req.usuario._id
	});

	product.save((err, productDB) => {
		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

/*		if (!productDB) {
			return res.status(400).json({
				ok:false,
				err
			});
		}*/

		res.status(201).json({
			ok: true,
			product: productDB
		});
	});
});

//=======================================
// Update product
//=======================================
app.put('/products/:id', verifyToken, (req, res) => {
	let id = req.params.id;
	let body = req.body;

	Product.findById(id, (err, productDB) => {
		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		if (!productDB) {
			return res.status(400).json({
				ok:false,
				err: {
					message: 'Id does not exist'
				}
			});
		}

		productDB.name = body.name;
	    productDB.price = body.price;
	    productDB.description = body.description;
	    productDB.available = body.available;
	    productDB.category = body.category;

	    productDB.save( (err, productSaved) => {
	    	if (err) {
				return res.status(500).json({
					ok:false,
					err
				});
			}

			res.json({
				ok: true,
				product: productSaved
			});
	    });
	});
});

//=======================================
// Delete products
//=======================================
app.delete('/products/:id', verifyToken, (req, res) => {
	let id = req.params.id;

	Product.findById(id, (err, productDB) => {
		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		if (!productDB) {
			return res.status(400).json({
				ok:false,
				err
			});
		}

		productDB.available = false;
		productDB.save((err, productDeleted) => {
			if (err) {
				return res.status(500).json({
					ok:false,
					err
				});
			}

			res.json({
				ok: true,
				product: productDeleted,
				message: 'Deleted correctly'
			});
		})
	});
});

module.exports = app;
