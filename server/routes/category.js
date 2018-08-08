const express = require('express');
const Category = require('../models/category');
const {verifyToken, verifyAdminRole} = require('../middlewares/auth');
const app = express();

//=======================================
// Get Category
//=======================================
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('usuario', 'nombre email')
        .exec((err, categories) => {
        if (err) {
            return res.status(500).json({ok: false, err});
        }

        res.json({ok: true, categories});
        });
});

//=======================================
// Get Category By Id
//=======================================
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id incorrect'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

//=======================================
// New Category
//=======================================
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        usuario: req.usuario._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

//=======================================
// Update Category
//=======================================
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let options = {
        new: true,
        runValidators: true
    };

    Category.findByIdAndUpdate(id, {description: req.body.description}, options, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

//=======================================
// Delete Category
//=======================================
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id does not exist'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Category deleted'
        });
    });
});

module.exports = app;
