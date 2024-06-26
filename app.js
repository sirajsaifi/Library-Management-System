const path = require('path')
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const compression = require('compression')


const bookRouter = require('./routes/bookRoutes')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
const issueRouter = require('./routes/issueRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express()

app.set('view engine', 'pug')
// app.set('views', 'views') 
app.set('views', path.join(__dirname, 'views'))


app.use(express.static(`${__dirname}/public`))
// app.use(express.static('public'))

app.use(cors()) //Access-Control-Allow-Origin to *

// app.use(morgan('dev'))
if (process.env.NODE_ENV === 'development') {    //to use NODE_ENV variable...available to us in every single file...see video 67 time 12:00
    app.use(morgan('dev'))
}

app.use(helmet())

//protection from bruteforce attack, limit request from same API
const limiter = rateLimit({
    max: 200,   //100 requests from same IP
    windowMs: 60 * 60 * 100, //in 1 hour
    message: 'Too many requests from this IP, please try again in an hour'
})
app.use('/api', limiter)    //'/api' only appllied to api's

//app.use is used so that we don't have to write middleware function everytime
//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))     //limit data to 10 kb that comes in body

//the way in which forms sends data to the server is also called encoding
//extended:true ==> allows to pass some complex data
app.use(express.urlencoded({ extended: true, limit: '10kb' }))  //for updating account by user..parses data coming from the form
app.use(cookieParser())   //parses data from cookie

//Data sanatization againt NoSQL query injection
app.use(mongoSanitize())    //looks at req.body && req.bodyString &&req.params and filter out all $ signs and dots(.)

//Data sanitization againt XSS(cross side scripting attacks)
app.use(xss())  //will clean any user input from malicious html code

//prevent parameterpollution
//prevents duplicate query strings like sort=price, sort=new etc etc
app.use(hpp())  //use whitelist option to allow duplicate query like for duration

//done before deployment
app.use(compression())  //returns a middleware function which compresses all our responses(text) sent to client


//test api
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    // console.log(req.headers)
    next()
})


//routes
app.use('/', viewRouter)
// app.get('/', (req, res) => {
//     res.status(200).render('base')
// })
app.use('/api/v1/books', bookRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/issueBooks', issueRouter)

//Method 1(basic)
// const getAllBooks = (req, res) => {
//     res.status(200).json({
//         status: 'success',
//           data: {
//               tours
//            }
//     })
// }
// app.route('/api/v1/books').get(getAllBooks)

//method 2(basic)
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/books.json`)
// )
// app.get('/api/v1/books', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tours
//         }
//     })
// })

//for undefined routes...this error will be shown...undefined means which are not defined above
//like '/', '/api/v1/books', '/api/v1/users', '/api/v1/issueBooks' are defined routes...
//undefined will be like '/api/v1/hello' or anything which is not defined above
app.all('*', (req, res, next) => {  //'*' means for all
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app