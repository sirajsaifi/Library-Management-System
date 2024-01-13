const Book = require('../models/bookModel')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.getAllBooks = factory.getAll(Book)
exports.createBook = factory.createOne(Book)
exports.updateBook = factory.updateOne(Book)
exports.deleteBook = factory.deleteOne(Book)


//for basic reference
// exports.getOverview = catchAsync( async(req, res) => {
//     const books = await Book.find()

//     res.status(200).json({
//         status: 'success',
//         data: {
//             books
//         }
//     })
// })