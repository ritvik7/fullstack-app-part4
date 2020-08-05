const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, userObject) => {
    userObject.id = userObject._id
    delete userObject._id
    delete userObject.__v
    delete userObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)