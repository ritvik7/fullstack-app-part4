const supertest = require('supertest')
const app = require('../app')
const test_helper = require('./test_helper')
const mongoose = require('mongoose')
const api = supertest(app)

describe('invalid users', () => {
  test('username or password shorter than 3 characters returns error', async () => {
    const usersAtStart = await test_helper.usersInDb()
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
    const usersAtEnd = await test_helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map(user => user.username)).not.toContain('fu')
  })
  
  test('missing username or password returns error', async () => {
    const usersAtStart = await test_helper.usersInDb()
    const user = {
      username: 'fus',
      name: 'bar'
    }
    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
    
    expect(result.body.error).toBe('username or password missing')
    const usersAtEnd = await test_helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(usersAtEnd.map(user => user.username)).not.toContain('fu')
  })
})

afterAll(() => {
  mongoose.connection.close()
})