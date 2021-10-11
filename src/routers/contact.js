const express = require('express')
const Contact = require('../models/contact')
const ContactLog = require('../models/contact_log')
const router = new express.Router()

// middleware to authenticate every request
const auth = require('../middlewares/auth')


/**
 * get all contacts for user
 */
router.get('/contacts', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id })
    res.status(200).send(contacts)
  } catch (error) {
    console.error(error)
    res.status(400).send(error)
  }
})


/**
 * get single request contact and save contact log for same
 */
router.get('/contacts/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const contact = await Contact.findOne({ _id: id, user: req.user._id })
    if (!contact) {
      throw new Error()
    } else {
      // calculalate today's date in format `YYYYMMDD` as number 
      const date = new Date()
      let dateInNumber = date.getDate() + 100 * (date.getMonth() + 1 + 100 * date.getFullYear())
      const contactLog = new ContactLog({ userId: req.user._id, contactId: id, dateInNumber, activity: 'view' })
      await contactLog.save()

      // change current date to 7 days before for fetching views of every past 7 days
      date.setDate(date.getDate() - 7)
      dateInNumber = date.getDate() + 100 * (date.getMonth() + 1 + 100 * date.getFullYear())

      // aggregate query is used to fetch contacts for current date to 7 day before
      // and then project it in format of `{_id:YYYYMMDD,views:number}`
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

// request to save contact for user
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

// request to update contact 
router.patch('/contacts/:id/update', auth, async (req, res) => {
  try {
    const id = req.params.id
    // if body have values other than allowed values then throw error of `Invalid Update `
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
      await contactLog.save()
      
      // checking if image was present before and user didn't update it to new image
      // then not updating it 
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

// request for deleting contact
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