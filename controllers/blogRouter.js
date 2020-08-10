const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {blogs: 0})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const tokenDecoded = jwt.verify(request.token, process.env.SECRET)
  if(!(request.token && tokenDecoded.id))
    throw Error('UserNotAuthorized')
  const user = await User.findById(tokenDecoded.id)
  const blog = new Blog(request.body)
  blog.user = user.id
  let result = await blog.save()
  user.blogs = user.blogs.concat(result.id)
  await user.save()
  result = result.populate('user', {blogs: 0})
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const blogToBeDeleted = await Blog.findById(request.params.id)
  if(!blogToBeDeleted)
    throw Error('resource not found')
  const tokenDecoded = jwt.verify(request.token, process.env.SECRET)
  if((tokenDecoded.id !== blogToBeDeleted.user.toString()) || !request.token)
    throw Error('UserNotAuthorized')
  await Blog.findByIdAndRemove(request.params.id)
  const user = await User.findById(blogToBeDeleted.user)
  user.blogs = user.blogs.filter(blog => blog.id !== blogToBeDeleted.id)
  await user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  console.log(request.body)
  if(request.body.likes === undefined) 
    throw Error('likes not found')

  const result = await Blog
    .findByIdAndUpdate(request.params.id, {likes: request.body.likes + 1}, {new: true})
    .populate('user', {blogs: 0})

  if(!result) 
    throw new Error('resource not found')
  else
    response.status(201).json(result)
})

module.exports = blogRouter