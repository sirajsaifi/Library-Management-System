const express = require('express')

const bookController = require('../controllers/bookController')
const authController = require('.././controllers/authController')
const router = express.Router()


router.route('/').get(authController.protect, bookController.getAllBooks).post(authController.protect, authController.restrictTo('librarian'), bookController.createBook)
// router.route('/').get(bookController.getAllBooks).post(bookController.createBook)
router.route('/:id').patch(authController.protect, authController.restrictTo('librarian'), bookController.updateBook).delete(authController.protect, authController.restrictTo('librarian'), bookController.deleteBook)


module.exports = router

// ,
//     {
//         "_id": "5c8a359914eb5c17645c9117",
//         "image": "book-12.jpg",
//         "bookName": "Business Studies",
//         "bookAuthor": "Poonam Gandhi",
//         "bookPublisher": "VK",
//         "bookPages": 360,
//         "bookPrice": 603,
//         "bookState": "Available"
//     }