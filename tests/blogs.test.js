const list_helper = require('../utils/list_helper')

const blog_list = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}, {
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}, {
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
}, {
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0
}, {
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
}, {
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}]


test('dummy returns one', () => {
  const blogs = []
  const result = list_helper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    const blogs = [blog_list[0]]
    const result = list_helper.totalLikes(blogs)
    expect(result).toBe(blogs[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = blog_list
    const result = list_helper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('of empty list returns 0', () => {
    const blogs = []
    const result = list_helper.totalLikes(blogs)
    expect(result).toBe(0)
  })
})

describe('favourite blog', () => {
  test('when only one blog in list returns that blog', () => {
    const blogs = [blog_list[0]]
    const result = list_helper.favoriteBlog(blogs)
    let { title, author, likes } = blogs[0]
    expect(result).toEqual({ title, author, likes })
  })

  test('of empty list returns null', () => {
    const blogs = []
    const result= list_helper.favoriteBlog(blogs)
    expect(result).toEqual(null)
  })

  test('of bigger list returns blog with most likes', () => {
    const blogs = blog_list
    const result = list_helper.favoriteBlog(blogs)
    let { title, author, likes } = blogs[2]
    expect(result).toEqual({ title, author, likes })
  })
})

describe('most blogs', () => {
  test('in list returns any one author with most blogs', () => {
    const blogs = blog_list
    const result = list_helper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })

  test('of empty list returns null', () => {
    const blogs = []
    const result = list_helper.mostBlogs(blogs)
    expect(result).toEqual(null)
  })

  test('when list has only one blog returns the author of that blog with 1 as count', () => {
    const blogs = [blog_list[0]]
    const result = list_helper.mostBlogs(blogs)
    expect(result).toEqual({ author: blog_list[0].author, blogs: 1 })
  })
})

describe('most likes', () => {
  test('in list returns any one author with most likes', () => {
    const blogs = blog_list
    const result = list_helper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('of empty list returns null', () => {
    const blogs = []
    const result = list_helper.mostLikes(blogs)
    expect(result).toEqual(null)
  })

  test('when list has only one blog returns the author of that blog with 1 as count', () => {
    const blogs = [blog_list[0]]
    let { author, likes } = blogs[0]
    const result = list_helper.mostLikes(blogs)
    expect(result).toEqual({ author, likes })
  })
})