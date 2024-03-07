const multer = require('multer')    //used for uploading image
const sharp = require('sharp')  //to resize photo

const Book = require('../models/bookModel')
const factory = require('../controllers/handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


//use this if the image processing is needed eg.image resizing
const multerStorage = multer.memoryStorage()

//checks whether the uploaded file is image if so then True is passed in callback function else False along with error
//can be used to check csv files...works for all kind of files
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image. Please upload only images.'), false)
    }
}

const upload = multer({ //destination where to save the user's photo
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadBookPhoto = upload.single('photo')    //.single is because only a single image is going to be uploaded

exports.resizeBookPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()    //if no request for upload then go to next middleware

    req.file.filename = `book-${req.user.id}-${Date.now()}.jpeg`
    //width(500) and height(500)
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) //90%
        .toFile(`public/img/books/${req.file.filename}`)

    next()
})

exports.updateBook = factory.updateOne(Book)
exports.getAllBooks = factory.getAll(Book)
exports.createBook = factory.createOne(Book)
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