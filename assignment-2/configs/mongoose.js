const mongoose = require('mongoose')
require('dotenv').config()

// Bind connection to events (to get notifications).
mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
mongoose.connection.on('error', err => console.error(`Mongoose connection error has occurred: ${err}`))
mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

// If the Node process ends, close the Mongoose connection.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection is disconnected due to application termination.')
    process.exit(0)
  })
})

/**
 * Connects to the server.
 *
 * @param {string} process.env.DB_CONNECTION_STRING - The connection key.
 */
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => {
  console.log(error)
  process.exit(1)
})

module.exports = mongoose
