const Book = require('../models/bookModel')
const User = require('../models/userModel')
const IssueBook = require('../models/issueModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')


exports.getOverview = catchAsync(async (req, res) => {
    //1) Get book data from collection
    const books = await Book.find()

    //2) Build template --> build in overview.pug

    //3)render that template using data from 1)
    res.status(200).render('overview', {
        title: 'All Books',
        books
    })
})

exports.getLoginForm = catchAsync(async (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
})

exports.getMyAccount = (req, res) => {
    res.status(200).render('settings', {
        title: 'Your Account'
    })
}

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
        {
            new: true,  //to get updated document as a result
            runValidators: true
        })
    res.status(200).render('settings', {     //to get updated name and email automatically in place of old name and email
        title: 'Your account',
        user: updatedUser   //to get t updatedUser in the protect middleware
    })
})

exports.createUser = (req, res) => {
    res.status(200).render('createUser', {
        title: 'Create User'
    })
}

exports.getStudents = catchAsync(async(req, res) => {
    const students = await User.find()

    res.status(200).render('students', {
        title: 'Students',
        students
    })
})

exports.getStaff = catchAsync(async(req, res) => {
    const staffs = await User.find()

    res.status(200).render('staff', {
        title: 'Staff',
        staffs
    })
})

exports.updateUser = catchAsync(async(req, res) => {
    const id = await req.query.id
    const updateUserForm = await User.findById(id)

    res.status(200).render('updateUser', {
        title: 'Update User',
        updateUserForm
    })
})

exports.deleteUser = catchAsync(async(req, res) => {
    const id = await req.query.id
    const deleteUserForm = await User.findById(id)

    res.status(200).render('deleteUser', {
        title: 'Delete User',
        deleteUserForm
    })
})

exports.createBook = (req, res) => {
    res.status(200).render('createBook', {
        title: 'Create Book'
    })
}

exports.getBooks = catchAsync(async(req, res) => {
    const books = await Book.find()

    res.status(200).render('books', {
        title: 'Books',
        books
    })
})

exports.updateBook = catchAsync(async(req, res) => {
    const id = req.query.id

    const updateBook = await Book.findById(id)
    res.status(200).render('updateBook', {
        title: 'Update Book',
        updateBook
    })
})

exports.deleteBook = catchAsync(async(req, res) => {
    const id = req.query.id

    const deleteBook = await Book.findById(id)
    res.status(200).render('deleteBook', {
        title: 'Delete Book',
        deleteBook
    })
})

exports.issueBook = catchAsync(async(req, res) => {
    const id = req.query.id

    const issueBook = await Book.findById(id)
    res.status(200).render('issueBook', {
        title: 'Issue Book',
        issueBook
    })
})

exports.booksIssued = catchAsync(async(req, res) => {
    const booksIssued = await IssueBook.find()

    res.status(200).render('issuedBooks', {
        title: 'Issued Books',
        booksIssued
    })
})

exports.returnBook = catchAsync(async(req, res) => {
    const id = req.query.id
    const returnBook = await IssueBook.findById(id)

    res.status(200).render('returnBook', {
        title: 'Return Book',
        returnBook
    })
})

exports.booksIssuedStudent = catchAsync(async(req, res) => {
    const id = req.query.id
    const issues = await IssueBook.find({user : id})

    res.status(200).render('bookIssuedStudent',{
        title: 'Issues',
        issues
    } )
})

exports.myBooks = catchAsync(async(req, res) => {
    const issues = await IssueBook.find({user : req.user.id})

    res.status(200).render('bookIssuedStudent',{
        title: 'Issues',
        issues
    } )
})

