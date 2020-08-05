const maxBy = require('lodash.maxby')
const groupBy = require('lodash.groupby')
const countBy = require('lodash.countby')
const keys = require('lodash.keys')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.length > 0 ? blogs.reduce((sum, blog) => sum + blog.likes, 0) : 0
}

const favoriteBlog = (blogs) => {
  if(!blogs.length) return null
  let {title, author, likes} = blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
  return {title, author, likes}
}

const mostBlogs = (blogs) => {
  if(!blogs.length) return null
  const blogCounts = countBy(blogs, 'author')
  const authors = keys(blogCounts)
  const result = authors.map(author => {
    return {'author': author, 'blogs': blogCounts[author]}
  })
  return maxBy(result, 'blogs')
}

const mostLikes = (blogs) => {
  if(!blogs.length) return null
  const likeCounts = groupBy(blogs, 'author')
  const authors = keys(likeCounts)
  const result = authors.map(author => {
    likes = likeCounts[author].reduce((sum, blog) => sum + blog.likes, 0)
    return {'author': author, 'likes': likes}
  })
  return maxBy(result, 'likes')
}

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog, 
  mostBlogs, 
  mostLikes,
}