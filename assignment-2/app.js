const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
const createError = require('http-errors')
const session = require('express-session')
const helmet = require('helmet')
const app = express()
require('dotenv').config()
require('./configs/mongoose.js')
// const csrf = require('csurf')

/**
 * Https://stackoverflow.com/questions/40956767/want-to-compare-two-string-in-handlebars-view-in-node-js-app.
 * Found information on how to make a comparator with Handlebars and used it.
 *
 * @param {string} e1 - A value to be compared. (Could be a Number).
 * @param {string} e2 - A value to be compared. (Could be a Number).
 * @returns {string} Options - The result. (Could be a Number).
 */
hbs.registerHelper('ifEqual', function (e1, e2, options) {
  if (e1 === e2) {
    return options.fn(this)
  }
  return options.inverse(this)
})

/**
 * The options for the session cookie.
 */
const sessionOptions = {
  name: 'averyrandomname',
  secret: 'katterna65653is456manga986och75helgen124tittar658utmedans275tomten4356tar873en132snus',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 10,
    sameSite: 'lax'
  }
}

// engine
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Middlewares
app.use(logger('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(helmet.xssFilter())
app.use(helmet.frameguard())

app.use(session(sessionOptions))
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user
  }
  next()
})

// app.use(csrf())
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    // res.locals.csrfToken = req.csrfToken()
    delete req.session.flash
  }

  next()
})

// Routes
app.use('/', require('./routes/homeRouter'))
app.use('/login', require('./routes/loginRouter'))
app.use('/snippet', require('./routes/snippetRouter'))

// Error handler
app.use('*', (req, res, next) => next(createError(404))) // Keep this last of routes?
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, 'views', 'errors', '404.html'))
  }
  if (err.status === 403) {
    return res
      .status(403)
      .sendFile(path.join(__dirname, 'views', 'errors', '403.html'))
  }

  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(path.join(__dirname, 'views', 'errors', '500.html'))
  }
  res
    .status(err.status || 500)
    .render('errors/error', { err })
})

// Listening on
app.listen(8000, () => console.log('Server running at http://localhost:8000/'))
