const multer = require('multer')    //used for uploading image
const sharp = require('sharp')  //to resize photo

const User = require('../models/userModel')
const factory = require('../controllers/handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


//use this if the image processing is needed eg.image resizing
const multerStorage = multer.memoryStorage()

//checks whether the uploaded file is image if so then True is passed in callback function else False along with error
//can be used to check csv files...works for all kind of files
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {//to only allow images to be uploaded
        cb(null, true)
    } else {
        cb(new AppError('Not an image. Please upload only images.'), false)
    }
}

const upload = multer({ //destination where to save the user's photo
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo')    //.single is because only a single image is going to be uploaded
//above 'photo' is the field name in the database

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()    //if no request for upload then go to next middleware
    //req.file is for a single file and req.files is for the multiple files

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    //we have file.filename above because below in updateMe controller we are assigning it to
    // filteredBody.photo...if it wasn't assigned below then it should be body.photo above
    //width(500) and height(500)
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) //90%
        .toFile(`public/img/users/${req.file.filename}`)

    next()
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}


exports.updateMe = catchAsync(async(req, res, next) => {
    // 1) if the user tries to posts password data then create an error
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for updating passwords. Please use /updatePassword for updating your password.', 400))
    }

    //2) filter out unwanted fields name that are not allowed to be updated like roles
    const filteredBody = filterObj(req.body, 'name', 'email', 'gender', 'number')

    if (req.file) filteredBody.photo = req.file.filename    //adding photo property to filteredBody

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,  //to return a new updated object
            runValidators: true     //mongoose validates our document incase we have put a invalid email
        }
    )

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})


exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id,
        {
            active: false
        })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User, { path: 'issuedBooks' })
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)