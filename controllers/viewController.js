const Book = require('../models/bookModel')
const User = require('../models/userModel')
const IssueBook = require('../models/issueModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')


exports.getOverview = catchAsync(async(req, res) => {
    //1) Get book data from collection
    const books = await Book.find()

    //2) Build template --> build in overview.pug

    //3)render that template using data from 1)
    res.status(200).render('overview', {
        title: 'All Books',
        books
    })
})

exports.getLoginForm = catchAsync(async(req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
})