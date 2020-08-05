const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [{
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7
}, {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5
}, {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12
}, {
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10
}, {
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0
}, {
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2
}]

const blogsInDb = async () => {
  const data = await Blog.find({})
  return data.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const data = await User.find({})
  return data.map(user => user.toJSON())
}

const newUserToken = async () => {
  const newUser = new User({
    username: 'test_user',
    password: 'testuser',
    name: 'Test User the Third'
  })
  const result = await newUser.save()
  const token = jwt.sign({
    username: result.username,
    id: result.id
  }, process.env.SECRET)
  return token
}

const usersBlogsInDb = async () => {
  const user = await User.findOne({username: 'test_user'})
  return user.blogs
}

module.exports = {blogsInDb, initialBlogs, usersInDb, newUserToken, usersBlogsInDb}