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
router.get('/create-book', authController.protect, viewController.createBook)
router.get('/books', authController.protect, viewController.getBooks)
router.get('/update-book', authController.protect, viewController.updateBook)
router.get('/delete-book', authController.protect, viewController.deleteBook)
router.get('/issue-book', authController.protect, viewController.issueBook)
router.get('/books-issued', authController.protect, viewController.booksIssued)
router.get('/return-book', authController.protect, viewController.returnBook)
router.get('/book-issued-student', authController.protect, viewController.booksIssuedStudent)
router.get('/my-books', authController.protect, viewController.myBooks)


module.exports = router