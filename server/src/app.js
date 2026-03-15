require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { sequelize } = require('./models')
const passport = require('passport')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize())
app.use('/assets', express.static('public'))

require('./userPassport')
require('./routes')(app)

const port = process.env.PORT || 8081

sequelize.sync({ force: false }).then(() => {
    app.listen(port, function () {
        console.log('Server running on port http://localhost:' + port)
        console.log('Connect to the database MySQL Workbench successfully!')
    })
}).catch((error) => {
    console.error('Cannot connect to the MySQL database:', error)
})