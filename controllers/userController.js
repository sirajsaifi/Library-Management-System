const User = require('../models/userModel')
const factory = require('../controllers/handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


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
    const filteredBody = filterObj(req.body, 'name', 'email')

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
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)