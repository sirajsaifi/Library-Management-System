const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const Email = require('../utils/email')
// import { showAlert } from '../public/js/alerts'


const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        //JWT will no longer work after this time period has passed
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id)

    const cookieOptions = {
        //the browser or user will delete the cookie after the time expires
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true  //cookie cannot be accessed or modified by client-side js 
        //prevents XSS attacks
    }

    //cookie will only be sent to encrypted connection, reducing the risk of interception or tampering.
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    //sending cookies
    //jwt, data to be sent, options
    res.cookie('jwt', token, cookieOptions)

    //removes password from output (when sign up)
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signup = catchAsync(async(req, res, next) => {
    // const existingUser = await User.findOne({email: Email})

    // if (existingUser) {
    //     showAlert('error', 'User with this email already exists')
    // }
    // else {
    const newUser = await User.create(req.body)
    const url = `${req.protocol}://${req.get('host')}/me`
    console.log(url)
    // }

    // new Email(newUser, url).sendWelcome()
    res.status(200).json({
        status: 'success'
    })
    // createSendToken(newUser, 201, req, res)
})


exports.login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body

    // 1) check if email and password exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    // 2) check if user exists && password is correct
    const user = await User.findOne({email}).select('+password')  //+ for fields that are not selected

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createSendToken(user, 200, req, res)
})


exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
}


// authorizing users based on cookies
exports.protect = catchAsync(async(req, res, next) => {
    // 1) getting token and checking if it is there
    let token
    // to check below line code do not set the res.cookies() in createSendToken rather go to get all books api and
    // then go to headers and under User-agent write Authorization with value Bearer and then paste the token which
    // you will get after loggging in. (use login api to get the token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    // console.log(token)
    if (!token) {
        return next(new AppError('You are not logged in. Please login to get access', 401))
    }

    // 2)verification of the token (JWT verifies whether the token is valid or not)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)


    // 3) check if the user still exist (user will be deleted but the token will still exist, so we don't want the user to login if he is deleted)
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401))
    }

    // 4) check if user changed password once jwt was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed the password. Please login again', 404))
    }

    // grant access to protected route
    req.user = currentUser
    res.locals.user = currentUser
    next()
})


// only for rendered pages, no error
exports.isLoggedIn =async(req, res, next) => {
    if (req.cookies.jwt) {
        try{
            // 1) verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

            // 2) check if user still exist (if user is deleted but the token still exist)
            const currentUser = await User.findById(decoded.id)
            if (!currentUser) {
                return next()
            }

            // 3) check if the user change the password or not
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next()
            }

            //there is a logged in user
            //each pug template will have the access to res.locals
            //res.local.user is available only to the views rendered during request/response cycle
            //so in oredr to show/hide the login/logout button, the -header.pug needs to know if user is logged in or not, and the way to  do that is by accessing local.user
            res.locals.user = currentUser   //making user accessible to our pug templates...there will be a varible user in each template as user is written after locals
            return next()

        } catch (err){
            return next()   //stops the execution immediately...jump out the callback immediately
        }
    }
    next()  //if there is no cookie then next middleware will be called
}


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have the permission to perform this action.', 403))    //403 --> forbidden
        }
        next()
    }
}


exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) get user based on POSTED email
    const user = await User.findOne({ email:req.body.email })
    if (!user) {
        return next(new AppError('No user with such email found.', 404))
    }

    //2)generate the random resest token
    const resetToken = user.createPasswordResetToken()

    await user.save({ validateBeforeSave:false })

    //3) send it to the user's email
    try{
        console.log(resetToken)
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
        await new Email(user, resetURL).sendPasswordReset()

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

    }catch(err){
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave:false })

        // console.error(err.message)
        return next(new AppError('There was an error sending this email', 500))

    }
})


exports.resetPassword = catchAsync(async(req, res, next) => {
    //1) get the user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    //find user with the token
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gte: Date.now() }})

    //2) if token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password   //if next() is not called then it sets the password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()     //the above only modifies the document and not save it...so this saves or updates the document
    //we won't turn off the validator as we want the validators to confirm if password == passwordConfirm

    //3) Update changedPasswordAt property for the user
    //done in userModel.js

    //4) Log the user in, send JWT
    createSendToken(user, 200, req, res)
})


exports.updatePassword = catchAsync(async (req, res, next) => {
    //1) get the user from collection
    const user = await User.findById(req.user.id).select('+password')

    //2) check if the posted current password is correct
    if (! (await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401))
    }

    //3) if so, then update the passsword
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    // User.findByIdAndUpdate will not work on intended

    //4)log user in, send JWT
    createSendToken(user, 200, req, res)
})