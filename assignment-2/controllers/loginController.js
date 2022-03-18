const moment = require('moment')
const UserSchema = require('../models/UserSchema')
const bcrypt = require('bcryptjs')

const userController = {}

/**
 * Maps parts of the userSchema and sorts them in order.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next function in line.
 */
userController.index = async (req, res, next) => {
  try {
    const viewData = {
      userSchemas: (await UserSchema.find({}))
        .map(UserSchema => ({
          id: UserSchema._id,
          createdAt: moment(UserSchema.createdAt).fromNow(),
          value: UserSchema.value
        }))
        .sort((a, b) => a.value - b.value)
    }
    res.render('login/index', { viewData })
  } catch (error) {
    console.log(error)

    next(error)
  }
}

/**
 * Renders the registration view..
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.new = async (req, res) => {
  res.render('login/new')
}

/**
 * Insights from: https://youtu.be/yNoqbrvRAwA?t=3402.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.login = async (req, res) => {
  try {
    const user = await UserSchema.authenticate(req.body.username, req.body.password)
    req.session.user = user.username

    req.session.flash = { type: 'success', text: 'The login was successfull.' }
    res.redirect('../')
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Invalid login information.' }
    res.redirect('./')
  }
}

/**
 * Https://www.youtube.com/watch?v=3i0J0uPZhpk&list=PLVBXNyNyLNq3MGbopdcvWc25xijtWaA6X&index=19
 * A logout function.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.logout = async (req, res) => {
  if (req.session.user) {
    req.session.destroy()
    res.redirect('/')
  }
}

/**
 * Registration function which also hashes the password in the same process.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.register = async (req, res) => {
  try {
    const newUser = new UserSchema()
    newUser.username = req.body.username
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    newUser.firstname = req.body.firstname
    newUser.lastname = req.body.lastname
    await newUser.save(function (err) {
      if (err) {
        console.log(err)
        return res.status(500).send()
      }
      if (!newUser.username) {
        return res.status(404).send()
      }
      console.log(newUser.password)
      req.session.flash = { type: 'success', text: 'User created.' }
      return res.status(200).send()
    })

    req.session.flash = { type: 'success', text: 'User created.' }
    res.redirect('.')
  } catch (error) {
    return res.render('login/new', {
      validationErrors: [error.message] || [error.errors.value.message],
      value: req.body.value
    })
  }
}

module.exports = userController
