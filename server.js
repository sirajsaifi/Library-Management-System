const mongoose = require('mongoose')
const dotenv = require('dotenv')


process.on('uncaughtException', err => {    //for like if we console something which is undefined
    console.log('UNCAUGHT EXCEPTION! Shutting down...')
    console.log(err.name, err.message)
    // console.error(err)
    process.exit(1)
})

dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.set('strictQuery', true)   //mongoose ensures thata only the fields specified in the schema is saved in your database

mongoose.connect( DB )
.then(() => {
    console.log('DB connected successfully')
}).catch(err => {   //if Db is down or we are unable to login to it etc
    console.log('UNHANDLED REJECTION! Shutting down....')
    console.log('DB connection error', err.name, err.message)
    console.error(err)
    server.close(() => {    //gives time to the server to finish all the pending requests
        process.exit(1)
    })
})

const port = process.env.PORT || 5500
// const port = 3000

const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})

// console.log(x)   //example for uncaught exception

process.on('SIGTERM', () =>{    //SIGTERM is used to restart our app every 24 hours
    console.log('SIGTERM RECEIVED. Shutting down gracefully')
    server.close(() => {    //gracefull shutdown and handles all the requests before shutting down
        console.log('Process terminated!')
    })
})