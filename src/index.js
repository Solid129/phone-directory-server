require('dotenv').config();

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const contactRouter = require('./routers/contact')
var cors = require('cors')
var bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(contactRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})