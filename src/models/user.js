const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * users schema for storing username, password and current authorized token
 */
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  }
});

userSchema.index({ username: 1 })

/**
 * genrating token on user login and sign up
 */
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SIGNATURE, { expiresIn: "1h" })
  user.token = token
  await user.save()

  return token
}

/**
 * check if username and paswword are correct for login request 
 * @param {String} username 
 * @param {String} password 
 */
userSchema.statics.authenticate = async (username, password) => {
  const user = await User.findOne({ username })

  if (!user) {
    throw new Error('Unable to login')
  }

  const validUser = await bcrypt.compare(password, user.password)

  if (!validUser) {
    throw new Error('Unable to login')
  }

  return user
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})


const User = mongoose.model('users', userSchema)
module.exports = User