const mongoose = require('mongoose')
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