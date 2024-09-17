const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const { userExtractor, authenticateToken } = require('../middleware/middleware')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    const searchQuery = `%${req.query.search}%`
    where[Op.or] = [
      { title: { [Op.iLike]: searchQuery } },
      { author: { [Op.iLike]: searchQuery } },
    ]
  }
  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username', 'id'],
      },
    ],
    where,
  })
  if (!blogs) {
    throw new Error('No blogs found')
  }
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const blog = await Blog.findOne({
    where: {
      id,
    },
  })
  if (!blog) throw new Error('Blog not found')
  res.json(blog)
})

router.post('/', authenticateToken, userExtractor, async (req, res) => {
  const {
    user: { id: userId },
  } = req
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Blog,
        attributes: ['title'],
      },
    ],
  })

  const blog = await Blog.create({ ...req.body, userId })
  if (!blog) throw new Error('Unable to create new blog')

  console.log('ACTIVE USER!', user)
  user.blogs = [...user.blogs, blog.id]
  await user.save()

  res.json(blog)
})

router.delete('/:id', authenticateToken, userExtractor, async (req, res) => {
  const activeUserId = req.user.id
  const { id } = req.params
  const { userId: blogUserId } = await Blog.findOne({
    where: {
      id,
    },
  })

  if (!blogUserId) {
    throw new Error('Blog not Found')
  }
  if (activeUserId !== blogUserId)
    throw new Error('Only the blog creator can delete the blog')

  await Blog.destroy({
    where: {
      id,
    },
  })

  res.status(204).end()
})

router.put('/:id', authenticateToken, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) throw new Error('Blog not found')
  blog.likes = req.body.likes
  await blog.save()
  res.json(blog)
})

module.exports = router
