const express = require('express')

const bookController = require('../controllers/bookController')
const authController = require('.././controllers/authController')
const router = express.Router()

// router.use(authController.protect)

router.route('/').get(bookController.getAllBooks)

router.use(authController.protect)
router.use(authController.restrictTo('librarian'))

router.post('/create-book', bookController.createBook)
router.route('/:id').patch(bookController.uploadBookPhoto, bookController.resizeBookPhoto, bookController.updateBook).delete(bookController.deleteBook)


module.exports = router