const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * middleware to verify and authenticate user using jwt token
 * it verify token using jwt and then compares that token with 
 * user's stored token in db to authenticate request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SIGNATURE)
    const user = await User.findOne({ _id: decoded._id, token })
    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' })
  }
}

module.exports = auth