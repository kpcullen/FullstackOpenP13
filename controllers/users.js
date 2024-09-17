const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const { userExtractor, authenticateToken } = require('../middleware/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'id', 'createdAt', 'updatedAt'] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
    ],
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body
  if (password.length < 3) throw new Error('Password too short')
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  try {
    const user = await User.create({
      username,
      name,
      passwordHash,
    })
    res.status(201).json(user)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', authenticateToken, async (req, res) => {
  let where = {}

  if (req.query.read) {
    where = {
      read: req.query.read,
    }
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
    include: [
      {
        model: Blog,
      },
      {
        model: Blog,
        as: 'toRead',
        through: {
          attributes: { exclude: ['blogId', 'userId'] },
          where,
        },
      },
    ],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', authenticateToken, userExtractor, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })

  if (req.user.id !== user.id)
    throw new Error('Must be logged in to change your username')
  if (!user) throw new Error('User not found')

  user.username = req.body.newUsername

  await user.save()

  res.json(user)
})

module.exports = router
