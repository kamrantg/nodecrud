const Product = require('../Models/Product.model')
const mongoose = require('mongoose')
const createError = require('http-errors')



module.exports = {

    getAllProducts: async (req, res, next) => {
        try {
            const result = await Product.find({}, { __v: 0 })
            res.send(result)
        } catch (e) {
            console.log(e)
            res.send(e.message)
        }
    },

    findProductById: async (req, res, next) => {
        const id = req.params.id
        try {
            const result = await Product.findById(id)
            if (!result) throw createError(404, 'product does not exist')
            res.send(result)
        } catch (e) {
            if (e instanceof mongoose.CastError) {
                next(createError(400, 'Invalid Product id'))
                return
            }
            console.log(e)
            next(e)
        }
    },

    createProduct: async (req, res, next) => {
        try {
            const product = new Product(req.body)
            const result = await product.save()
            res.send(result)
        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const id = req.params.id
            const updates = req.body
            const options = { new: true }
            const result = await Product.findByIdAndUpdate(id, updates, options)
            if (!result) throw createError(404, 'product does not exist')
            res.send(result)
        } catch (e) {
            if (e instanceof mongoose.CastError) {
                next(createError(400, 'Invalid Product id'))
                return
            }
            console.log(e)
            next(e)
        }
    },

    deleteProduct: async (req, res, next) => {
        const id = req.params.id
        try {
            const result = await Product.findByIdAndDelete(id)
            if (!result) throw createError(404, 'product does not exist')
            res.send(result)
        } catch (e) {
            if (e instanceof mongoose.CastError) {
                next(createError(400, 'Invalid Product id'))
                return
            }
            console.log(e)
            next(e)
        }
    }
}