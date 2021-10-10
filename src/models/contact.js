const mongoose = require('mongoose')
const contactSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  mobileNumber: {
    type: Number
  },
  landlineNumber: {
    type: Number
  },
  photo: {
    type: String
  },
  notes: {
    type: String
  }
}, { timestamps: true })

contactSchema.methods.toJSON = function () {
  const contact = this.toObject()
  delete contact.user
  return contact
}

const Contact = mongoose.model('contact', contactSchema)

module.exports = Contact