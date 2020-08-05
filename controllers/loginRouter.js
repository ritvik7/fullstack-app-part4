const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({username: request.body.username})
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(request.body.password, user.passwordHash) 
  if(!passwordCorrect)
    response.status(401).send({error: 'invalid credentials'})

  const payload = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(payload, process.env.SECRET)
  response.status(200).send({token, username: user.username, name: user.name})

})

module.exports = loginRouter