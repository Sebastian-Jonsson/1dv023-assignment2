const createError = require('http-errors')
const SnippetSchema = require('../models/SnippetSchema')

/**
 * Authorizing middleware if a matching user.
 *
 * @param {object} req - Requests.
 * @param {object} res - Response.
 * @param {Function} next - Initiates the next function.
 */
async function authMiddleware (req, res, next) {
  try {
    const snippet = await SnippetSchema.findOne({ _id: req.params.id })
    if (req.session.user !== snippet.author) {
      return next(createError(403))
    }
    next()
  } catch (error) {
    next(createError(404))
  }
}

/**
 * Authorizing middleware if a user.
 *
 * @param {object} req - Requests.
 * @param {object} res - Response.
 * @param {Function} next - Initiates the next function.
 * @returns {Error} - 403 Error.
 */
function userOnlyAuth (req, res, next) {
  try {
    if (!req.session.user) {
      return next(createError(403))
    }
    next()
  } catch (error) {
    next(createError(404))
  }
}

module.exports = { auth: authMiddleware, userAuth: userOnlyAuth }
