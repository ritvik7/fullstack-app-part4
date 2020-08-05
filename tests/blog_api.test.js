const mongoose = require('mongoose')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)
let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  for(let blog of helper.initialBlogs){
    blog = new Blog(blog)
    await blog.save()
  }
  await User.deleteMany({username: 'test_user'})
  token = await helper.newUserToken()
})

test('correct number of blogs are fetched as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const currentBlogs = await helper.blogsInDb()
  expect(response.body).toHaveLength(currentBlogs.length)
})

test('id property is defined', async () => {
  const result = await helper.blogsInDb()
  expect(result[0].id).toBeDefined()
})

test('blogs are addded correctly', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const usersBlogsAtStart = await helper.usersBlogsInDb()

  const blog = new Blog({
    title: 'Hey',
    author: 'Pixies',
    url: 'https://pixies.com',
    likes: 6,
  })

  const result = await api
    .post('/api/blogs')
    .send(blog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    
  const blogsAtEnd = await helper.blogsInDb()
  const usersBlogsAtEnd = await helper.usersBlogsInDb()
  
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  expect(blogsAtEnd.map(blog => blog.id)).toContain(result.body.id)

  expect(usersBlogsAtEnd).toHaveLength(usersBlogsAtStart.length + 1)
  expect(usersBlogsAtEnd.map(blogid => blogid.toString())).toContain(result.body.id)
})

test('blog is not added if token is not provided', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blog = new Blog({
    title: 'Bone Machine',
    author: 'Pixies',
    url: 'https://pixies.com',
    likes: 69,
  })

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  expect(blogsAtEnd.map(blog => blog.title)).not.toContain(blog.title)
})

test('likes are set as 0 by default if not defined', async () => {
  const blog = new Blog({
    title: 'Charas Ganja mereko pyaara',
    author: 'Rupali Lover',
    url: 'https://carryminati.com'
  })
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
  expect(response.body.likes).toBe(0)
})

test('bad request if title and/or url is missing', async () => {
  const blog = new Blog({
    author: 'God',
    likes: 420
  })
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})