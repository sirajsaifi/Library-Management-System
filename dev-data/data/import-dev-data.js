const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const Book = require('../bookModel')
const User = require('../userModel')

dotenv.config({ path : './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.set('strictQuery', true)

mongoose.connect ( DB )
.then(() => {
    console.log('DB connected successfully.')
})

//read json files
const books = JSON.parse(fs.readFileSync(`${__dirname}/books.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))

// importing data into database
const importData = async() => {
    try {
        await Book.create( books )
        await User.create(users)
        console.log('Data successfully loaded.')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}

//delete all data rfom database
const deleteData = async() => {
    try {
        await Book.deleteMany()
        await User.deleteMany()
        console.log('Data successfully deleted.')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}