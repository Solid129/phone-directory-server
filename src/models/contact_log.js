const mongoose = require('mongoose')

/**
 * schema for storing contact activity log
 */
const contactLogSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  contactId: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  dateInNumber: {
    type: Number,
    required: true
  }
}, { timestamps: true, })

const ContactLog = mongoose.model('contact_logs', contactLogSchema)

module.exports = ContactLog