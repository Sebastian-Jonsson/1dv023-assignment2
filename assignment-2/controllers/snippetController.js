const moment = require('moment')
const SnippetSchema = require('../models/SnippetSchema')

const snippetController = {}

/**
 * Maps the snippetschema and what to reveal in the viewData.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next function in line.
 */
snippetController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippet: (await SnippetSchema.find({}))
        .map(SnippetSchema => ({
          id: SnippetSchema._id,
          title: SnippetSchema.title,
          tag: SnippetSchema.tag,
          author: SnippetSchema.author,
          description: SnippetSchema.description,
          createdAt: moment(SnippetSchema.createdAt).fromNow(),
          value: SnippetSchema.value,
          isAuthor: (SnippetSchema.author === req.session.user)
        }))
        .sort((a, b) => a.value - b.value)
    }
    res.render('snippet/index', { viewData })
  } catch (error) {
    console.log(error)

    next(error)
  }
}

/**
 * Renders the new snippet view with viewData.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.new = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('snippet/new', { viewData })
}

/**
 * Creates a new snippet with the user preset as the currently logged in user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.create = async (req, res) => {
  try {
    const newSnippet = new SnippetSchema()
    newSnippet.title = req.body.title
    newSnippet.tag = req.body.tag
    newSnippet.author = req.session.user
    newSnippet.description = req.body.description

    await newSnippet.save(function (err) {
      if (err) {
        console.log(err)
        return res.status(403).send()
      }
      return res.status(200).send()
    })

    req.session.flash = { type: 'success', text: 'The snippet was saved successfully.' }
    res.redirect('.')
  } catch (error) {
    return res.render('snippet/new', {
      validationErrors: [error.message] || [error.errors.value.message],
      value: req.body.value
    })
  }
}

/**
 * Renders the edit snippet view.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.edit = async (req, res) => {
  try {
    SnippetSchema.findById(req.params.id, function (err, snippet) {
      if (err) {
        console.log(err)
      }
      res.render('snippet/edit', {
        snippet: snippet
      })
    })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    return res.redirect('snippet/index')
  }
}

/**
 * The function that allows for updates to be made.
 * Aided by https://youtu.be/aZ16pkrMkZE?list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp&t=335.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.update = async (req, res) => {
  try {
    const result = await SnippetSchema.updateOne({ id: req.body.id }, {
      title: req.body.title,
      tag: req.body.tag,
      description: req.body.description
    })

    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Updated successfully.' }
    } else {
      req.session.flash = { type: 'danger', text: 'Update failed.' }
    }
    res.redirect('../snippet/')
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Failed to update.' }
    res.redirect('.')
  }
}

/**
 * The delete a snippet rendering.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.delete = async (req, res) => {
  try {
    SnippetSchema.findById(req.params.id, function (err, snippet) {
      if (err) {
        console.log(err)
      }
      res.render('snippet/delete', {
        snippet: snippet
      })
    })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    return res.redirect('snippet/index')
  }
}

/**
 * The function that removes the snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.remove = async (req, res) => {
  try {
    await SnippetSchema.deleteOne({ _id: req.body.id })
    req.session.flash = { type: 'success', text: 'Deleted successfully.' }

    res.redirect('../snippet/')
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Failed to Delete.' }
    res.redirect('.')
  }
}

module.exports = snippetController
