const mongoose = require('mongoose')
const User = require('./userModel')
const validator = require('validator')
const slugify = require('slugify')


const issueBookSchema = new mongoose.Schema({
    book: {
        type: String,
        required: [true, 'A book must be issued.'],
    },
    slug: String,
    userEmail: {
        type: String,
        required: [true, "Please enter the student's email."],
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    issuedAt: {
        type: String,
    },
    returnDate: {
        type: String
    },
    returnedOn: {
        type: String,
        default: 'NA'
    },
    status: {
        type: String,
        default: 'Not-Returned',
        enum: ['Returned', 'Not-Returned']
    }
})

issueBookSchema.pre('save', function(next) {
    this.slug = slugify(this.book, {lower : true})
    next()
})

issueBookSchema.pre('save', async function (next) {
    const userID = await User.findOne({ email: this.userEmail })
    this.user = userID._id
    next()
})

issueBookSchema.pre('save', function (next) {
    this.issuedAt = new Date().toISOString().slice(0, 10)

    const returnDate = new Date(this.issuedAt)
    returnDate.setDate(returnDate.getDate() + 14)
    this.returnDate = returnDate.toISOString().slice(0, 10)
    next()
})


const IssueBook = mongoose.model('IssueBook', issueBookSchema)

module.exports = IssueBook