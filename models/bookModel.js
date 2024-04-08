const mongoose = require('mongoose')
const slugify = require('slugify')

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
        default: 'createBookForm.png'
    },
    bookName: {
        type: String,
        required : [true, 'A book must have a name.'],
        minlength : [5, 'A book name must have a length of more than 5 characters.'] ,
        maxlength : [30, 'A book name must have a length of less than 40 characters.'],
        unique: true
    },
    slug : String,
    bookAuthor : {
        type: String,
        maxlength: [15, 'An author name must have a length of less than 15 characters.']
    },
    bookPublisher : {
        type : String,
        required : [true, 'A book must have a publisher.'],
        maxlength : [30, 'A book publisher name must be less than 30 characters.']
    },
    bookPages : {
        type: Number,
        required : [true, 'A book must have pages.']
    },
    bookPrice : {
        type: Number,
        required : [true, 'A book must have price.']
    },
    bookState : {
        type : String,
        required : [true, 'A book must have a state.']
    }
})


const Book = mongoose.model('Book', bookSchema)

module.exports = Book