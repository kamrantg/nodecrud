const express = require('express')
const router = express.Router()

const ProductController = require('../Controllers/Product.controller')

router.get('/', ProductController.getAllProducts)

router.get('/:id', ProductController.findProductById)

router.post('/', ProductController.createProduct)

router.patch('/:id', ProductController.updateProduct)

router.delete('/:id', ProductController.deleteProduct)

module.exports = router