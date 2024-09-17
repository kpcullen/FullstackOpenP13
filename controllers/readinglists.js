const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const { userExtractor, authenticateToken } = require('../middleware/middleware')
const { Op, QueryTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const ReadingList = require('../models/reading_list')

router.post('/', authenticateToken, userExtractor, async (req, res) => {
  const user = req.user

  const toRead = await ReadingList.create({
    userId: user.id,
    blogId: req.body.blogId,
  })

  res.json(toRead)
})

router.post('/:id', authenticateToken, userExtractor, async (req, res) => {
  const updateReading = await ReadingList.findByPk(req.params.id)

  if (req.user.id !== updateReading.userId) {
    res
      .status(404)
      .json({ error: 'Must be logged in to update read status' })
      .end()
  }

  updateReading.read = req.body.read

  updateReading.save()

  res.json(updateReading)
})

module.exports = router
