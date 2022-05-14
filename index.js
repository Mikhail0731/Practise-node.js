// include express and create an app
const express = require('express')
const app = express()

// include mongoose
const mongoose = require('mongoose')

// connect to mongodb
const uri =
  'mongodb+srv://Practise:practise@cluster0.ydwci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose
  // @ts-ignore
  .connect(uri, options)
  .catch(error => console.error('mongoose error: ', error.message))

mongoose.connection.once('open', () => {
  // create express server
  const port = 3000
  app.listen(port, () => {
    console.log('server started on port ' + port)
  })
  console.log('mongodb connected successfully')
})

// create endpoint

app.get('/', (req, res) => {
  // route to homepage
  res.send('<a href="google.com">google</a>')
})

const UserModel = require('./models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersSlug = '/users'
app.post(`${usersSlug}/register`, async (req, res) => {
  try {
    // route to handle the create users

    // extract request parameters
    const { name, email, password, age, isAdmin } = req.body

    // hash the user password
    const passwordHash = await bcrypt.hash(password, 10)

    // create new user object
    const newUserObject = {
      name,
      email,
      password: passwordHash,
      age,
      isAdmin
    }

    const newUser = new UserModel(newUserObject)

    await newUser.save()

    res.send({ ...newUserObject, password: undefined })
  } catch (error) {
    console.error('create user error: ', error.message)
    res.status(500).send(`error while creating user. ${error.message}`)
  }
})

app.get(`${usersSlug}/:_id`, async (req, res) => {
  try {
    // extract uri params
    const { _id } = req.params
    // interact with database
    const user = await UserModel.findById({ _id })
    // close the request response cycle
    res.send(user)
  } catch (error) {
    // handle errors and exceptions
    const errorString = `error getting users ${error.message}`
    console.error(errorString)
    res.status(500).send(errorString)
  }
})

app.post(`${usersSlug}/login`, async (req, res) => {
  try {
    // extract params
    const { email, password } = req.body

    // find out if there is a user with this email
    const user = await UserModel.findOne({ email }).exec()

    if (!user) return res.status(400).send('wrong email or password')

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) return res.status(401).send('unauthorized')

    const token = jwt.sign(
      { id: user._id, email: user.email },
      'oNZpSj2XRak9EF86'
    )

    res.cookie('x-auth-token', token).send('authorized')
  } catch (error) {
    // handle errors and exceptions
    const errorString = `error login users ${error.message}`
    console.error(errorString)
    res.status(500).send(errorString)
  }
})
  