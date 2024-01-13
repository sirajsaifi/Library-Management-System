const mongoose = require('mongoose')


const issueBookSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: [true, 'Issue book must have a book.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Issue book must have a user.']
    },
    issuedAt: {
        type: Date,
        default: Date.now()
    }
})


//to populate the book and user automatically whenever there is a query
issueBookSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'book',
        select: 'name'
    })
    next()
})


const IssueBook = mongoose.model('IssueBook', issueBookSchema)

module.exports = IssueBook