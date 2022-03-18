const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * The model for a snippet and it's rules.
 */
const snippetSchema = new Schema({
  title: { type: String, unique: true, required: true, minlength: 2, maxlength: 20 },
  tag: { type: String, required: true, minlength: 1, maxlength: 20 },
  author: { type: String, required: true, minlength: 2, maxlength: 50 },
  description: { type: String, required: true, minlength: 1, maxlength: 4000 }
}, {
  timestamps: true,
  versionKey: false
})

const SnippetSchema = mongoose.model('SnippetSchema', snippetSchema)

module.exports = SnippetSchema
