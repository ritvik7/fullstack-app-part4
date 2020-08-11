const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({
    username: 'bebop',
    name: 'Spike',
    password: 'jazz'
  })
  await user.save()
})

describe('invalid users', () => {
  test('username should be unique', async () => {
    const user = {
      username: 'bebop',
      name: 'Faye',
      password: 'jam'
    }
    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)

    expect(result.body.error).toContain('`username` to be unique')

  })

  test('username or password shorter than 3 characters returns error', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      username: 'fus',
      name: 'bar',
      password: 'pa'
    }
    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)

    expect(result.body.error).toBe('username and password should be 3 or more characters long')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map(user => user.username)).not.toContain('fu')
  })

  test('missing username or password returns error', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      username: 'fus',
      name: 'bar'
    }
    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)

    expect(result.body.error).toBe('username or password missing')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map(user => user.username)).not.toContain('fu')
  })
})

afterAll(() => {
  mongoose.connection.close()
})