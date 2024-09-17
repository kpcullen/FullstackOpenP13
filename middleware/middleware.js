const jwt = require('jsonwebtoken')
const logger = require('../util/logger')
const User = require('../models/user')
const InvalidToken = require('../models/invalid_token')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error('LOGGER ERROR', error.message)

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'User must be logged in' })
  }

  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map((e) => e.message)
    return response.status(400).json({ error: errors.join(' + ') })
  }
  if (
    error.message === 'Blog not found' ||
    'No blogs found' ||
    'Unable to create new blog' ||
    'User not found' ||
    'Must be logged in to change your username'
  ) {
    return response.status(404).json({ error: error.message })
  }
  if (error.message === 'Password too short') {
    return response
      .status(400)
      .send({ error: 'Password must be at least 3 characters long.' })
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token has expired' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authHeader = request?.headers?.['authorization']

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    request.token = token
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Invalid token' })
    } else {
      request.user = await User.findByPk(decodedToken.id)
    }
  } catch (err) {
    next(err)
  }
  next()
}

const authenticateToken = async (request, response, next) => {
  const token = request.token
  if (token) {
    const invalidToken = await InvalidToken.findOne({
      where: {
        token,
      },
    })
    if (invalidToken) {
      return response.status(401).json({ error: 'Token has been invalidated' })
    }
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
  requestLogger,
  authenticateToken,
}
