const moment = require('moment')

const homeController = {}

/**
 * Renders a view with the form.
 *
 * @param {object} req - Requests.
 * @param {object} res - Response.
 */
homeController.index = (req, res) => {
  res.render('home/index')
}

/**
 * Simple test function.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
homeController.indexPost = async (req, res, next) => {
  try {
    const viewData = {
      name: req.body.name,
      dayName: moment().format('dddd')
    }

    res.render('home/index', { viewData })
  } catch (error) {
    next(error)
  }
}

module.exports = homeController
