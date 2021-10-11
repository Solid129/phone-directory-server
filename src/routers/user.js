const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middlewares/auth')


// user sign up request 
router.post('/user/sign-up', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.send({ username: user.username, token })
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})


// user login request 
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ username: user.username, token })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: 'Unable to login' })
  }
})


// user logout request
// logout sets token in user db to empty string
// so no next request with same token authenticate
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.token = ''
    await req.user.save()
    res.status(200).send({ username: req.user.username })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: "ssss" })
  }
})

module.exports = router