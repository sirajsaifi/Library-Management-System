const express = require('express')


const authController = require('../controllers/authController')
const viewController = require('../controllers/viewController')


const router = express.Router()

// router.get('/', authController.isLoggedIn, viewController.getOverview)
router.get('/',authController.isLoggedIn, viewController.getOverview)
router.get('/login', authController.isLoggedIn, viewController.getLoginForm)

module.exports = router