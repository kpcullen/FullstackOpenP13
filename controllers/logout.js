const router = require('express').Router()
const InvalidToken = require('../models/invalid_token')

router.delete('/', async (req, res) => {
  const token = req.token
  await InvalidToken.create({ token })
  const invalidatedToken = await InvalidToken.findOne({
    where: {
      token,
    },
  })
  console.log(invalidatedToken)
  res.status(204).end()
})

module.exports = router
