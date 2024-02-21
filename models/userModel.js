const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please provide a name for the user.']
    },
    email: {
        type: String,
        require: [true, 'Please provide an E-mail.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid E-mail.']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['librarian', 'staff', 'student'],
        default: 'student'
    },
    gender: {
        type: String,
        require: [true, 'Please provide a gender.']
    },
    number: {
        type: Number,
        require: [true, 'Please provide a phone number.']
    },
    password: {
        type: String,
        require: [true, 'Please provide a password.'],
        minlength: [8, 'A password must contain atleast 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please re-enter your password'],
        validate: {
            validator: function(el)  {
                return el === this.password
            },
            message: 'Passwords are not same.'
        }
    },
    passwordChangedAt: Date,    //whenever someone change the password then this will be changed
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false   //hides active status
    }
})


userSchema.pre('save', async function(next) {   //runs b/w the data we receive and the moment it is actually persisted to the database
    //runs if the password was modified
    if (!this.isModified('password')) return next()

    //password hashing
    this.password = await bcrypt.hash(this.password, 12)    //higher the number better the hasing

    //since we already have a hashed password
    this.passwordConfirm = undefined
    next()
})


//for reset password
userSchema.pre('save', function(next) {     //will run right before a new document is saved
    if ( !this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000
    //sometimes it may happen that the token is created before changePasswordTimeStamp, so we fix it by subtracting 1 second(1000)
    next()
})


//to show only active users
userSchema.pre(/^find/, function(next){
    this.find({
        active: { $ne: false }
    })
    next()
})


//for custom error message if email is not unique...this will work for all the field which are unique so be careful
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('User with this email already exists.'))
    } else {
        next(error)
    }
})


//Instance Method (Will be available on all the documents of certain collection)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {  //candidatePassword --> password that user passes in the body
    return await bcrypt.compare(candidatePassword, userPassword)    //returns true if same else false
}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) { //JWTTimestamp means when the JWT token was issued
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)

        return JWTTimestamp < changedTimestamp
    }
    return false    //returns false if not changed
}


userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')   //converts into hexadecimal string

    //encrypted password sent to DB
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')  //sha256 is a algorithm

    this.passwordResetExpires = Date.now() + 10 + 60 * 1000 //10 min, 60 is sec, 1000 millisecond

    return resetToken   //unencrypted password
}


const User = mongoose.model('User', userSchema)
module.exports = User