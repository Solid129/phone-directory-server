const express = require('express')
const Contact = require('../models/contact')
const ContactLog = require('../models/contact_log')
const router = new express.Router()
const auth = require('../middlewares/auth')

router.get('/contacts', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id })
    res.status(200).send(contacts)
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})

router.get('/contacts/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const contact = await Contact.findOne({ _id: id, user: req.user._id })
    if (!contact) {
      throw new Error()
    } else {
      const date = new Date()
      let dateInNumber = date.getDate() + 100 * (date.getMonth() + 1 + 100 * date.getFullYear())
      const contactLog = new ContactLog({ userId: req.user._id, contactId: id, dateInNumber, activity: 'view' })
      await contactLog.save()

      date.setDate(date.getDate() - 7)
      dateInNumber = date.getDate() + 100 * (date.getMonth() + 1 + 100 * date.getFullYear())

      const [totalViews, sevenDaysViews] = await Promise.all([
        ContactLog.find({ userId: req.user._id, contactId: id, activity: 'view' }).count(),
        ContactLog.aggregate([
          {
            "$match":
            {
              userId: req.user._id.toString(),
              contactId: id,
              dateInNumber: { $gte: dateInNumber },
              activity: 'view'
            }
          }, {
            "$group":
            {
              _id: "$dateInNumber",
              views: { "$sum": 1 }
            }
          }])
      ])
      res.status(200).send({ contact, totalViews, sevenDaysViews })
    }
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})

router.post('/contacts/add', auth, async (req, res) => {
  try {
    const contact = new Contact({ ...req.body, user: req.user._id })
    await contact.save()
    res.status(201).send(contact)
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})

router.patch('/contacts/:id/update', auth, async (req, res) => {
  try {
    const id = req.params.id
    const allowed = ["firstName", "middleName", "lastName", "email", "mobileNumber", "landlineNumber", "photo", "notes"]
    Object.keys(req.body).forEach(u => {
      if (!allowed.includes(u)) {
        throw new Error('Invalid Update')
      }
    })
    const contact = await Contact.findOne({ _id: id, user: req.user._id })
    if (!contact) {
      throw new Error()
    } else {
      const date = new Date()
      const dateInNumber = date.getDate() + 100 * (date.getMonth() + 1 + 100 * date.getFullYear())
      const contactLog = new ContactLog({ userId: req.user._id, contactId: id, dateInNumber, activity: 'update' })
      Object.keys(req.body).forEach(u => {
        if (u === 'photo' && req.body[u] === '') {
        } else {
          contact[u] = req.body[u]
        }
      })
      await Promise.all([contact.save(), contactLog.save()])
      res.status(200).send(contact)
    }
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})

router.delete('/contacts/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const contact = await Contact.findOne({ _id: id, user: req.user._id })
    if (!contact) {
      throw new Error()
    } else {
      await Contact.findByIdAndDelete(id)
      res.status(200).send(contact)
    }
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})

module.exports = router