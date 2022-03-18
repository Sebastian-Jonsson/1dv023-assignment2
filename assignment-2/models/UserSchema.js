const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

/**
 * The model for a user.
 */
const userSchema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 1 },
  password: { type: String, required: true, minlength: 2, maxlength: 120 },
  firstname: { type: String, required: true, minlength: 1, maxlength: 50 },
  lastname: { type: String, required: true, minlength: 1, maxlength: 50 }
},
{
  timestamps: true,
  versionKey: false
})

/**
 * Insights from https://youtu.be/yNoqbrvRAwA?t=34023.
 * Authenticator.
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {string} User - The user profile.
 */
userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }
  return user
}

const UserSchema = mongoose.model('UserSchema', userSchema)

module.exports = UserSchema
