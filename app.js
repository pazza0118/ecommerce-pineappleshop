// REQUIRED
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')
require('dotenv').config()
// IMPORT ROUTES
const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const categoryRoutes = require('./routes/categoryRoute')
const productRoutes = require('./routes/productRoute')
const braintreeRoute = require('./routes/braintreeRoute')
const orderRoute = require("./routes/orderRoute")



// mongo db connection 
const dbURL = process.env.MONGO_URI    //  || 'mongodb://localhost/ecommerce';
mongoose
  .connect(dbURL,
    { useNewUrlParser: true })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));
  
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

console.log("app.js")
// MIDDLEWARES
app.use(cors());            // THIS LINE MUST BE PLACED AT THE TOP OF ALL MIDDLEWARES
app.use(morgan('dev'))      // gives info on http request for dev purposes
app.use(bodyParser.json())  // parses data from client as json
app.use(cookieParser())     // parses cookie, now cookie available under req.cookie
app.use(expressValidator())

// ROUTES MIDDLEWARE
app.use('/api', authRoutes) // note that /api is there because I was copying from tutorial, it does not really need to be there
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', braintreeRoute)
app.use('/api', orderRoute)


app.get('/', (req, res) => {
  res.send("home page working section 6 of eCommerce")
})
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`express app is listening to port: ${port}`)
})





