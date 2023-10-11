const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/Auth.controller')


router.get('/', AuthController.getUserInfo)

router.post('/signup', AuthController.signup)

router.post('/login', AuthController.login)

router.post('/logout', AuthController.logout)



module.exports = router