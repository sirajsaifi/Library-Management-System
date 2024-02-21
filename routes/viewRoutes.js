const express = require('express')


const authController = require('../controllers/authController')
const viewController = require('../controllers/viewController')


const router = express.Router()

// router.get('/', authController.isLoggedIn, viewController.getOverview)
router.get('/',authController.isLoggedIn, viewController.getOverview)
router.get('/login', authController.isLoggedIn, viewController.getLoginForm)
router.get('/me', authController.protect, viewController.getMyAccount)
router.post('/submit-user-data', authController.protect, viewController.updateUserData)
router.get('/create-user', authController.protect, viewController.createUser)
router.get('/students', authController.protect, viewController.getStudents)
router.get('/staff', authController.protect, viewController.getStaff)
router.get('/update-user', authController.protect, viewController.updateUser)
router.get('/delete-user', authController.protect, viewController.deleteUser)


module.exports = router