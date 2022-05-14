const mongoose = require('mongoose')

// create schema definition
const userSchemaDefinition = {
  name: {
    type: String,
    minLength: [3, 'name is required and min of 3 characters'],
    maxLength: [20, 'name can not be more than 20 character'],
    required: true
  },
  email: {
    type: String,
    minLength: [3, 'email is required and min of 3 characters'],
    maxLength: [50, 'email can not be more than 50 character'],
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: [18, 'age is required and min of 3 characters'],
    max: [100, 'age can not be more than 100 character'],
    unique: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    minLength: [8, 'password must be greater than 8 characters'],
    maxLength: 64,
    required: true
  }
}
// create the schema itself
const userSchema = new mongoose.Schema(userSchemaDefinition)
// create the model
const User = mongoose.model('User', userSchema)
// export the model to be required in our app
module.exports = User