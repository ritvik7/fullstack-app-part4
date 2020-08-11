const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
  const body = request.body
  if(!body.password || !body.username)
    throw Error('InvalidCreds')

  if (body.password.length < 3 || body.username.length < 3)
    throw Error('ShortCreds')

  const saltRounds = 10
  const user = new User({
    username: body.username,
    name: body.name ? body.name : null
  })
  user.passwordHash = await bcrypt.hash(body.password, saltRounds)
  await user.save()
  response.status(201).json(user)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  response.status(200).json(users)
})

userRouter.delete('/:id', async (request, response) => {
  const result = await User.findByIdAndRemove(request.params.id)
  if(!result)
    throw Error('id not found')
  else
    response.status(204).end()
})

module.exports = userRouter