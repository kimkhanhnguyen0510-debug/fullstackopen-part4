const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { title: 'Blog A', likes: 5 },
    { title: 'Blog B', likes: 12 },
    { title: 'Blog C', likes: 8 }
  ]

  test('favorite blog is Blog B', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, blogs[1])
  })
})

describe('mostBlogs', () => {
  const blogs = [
    { title: 'Blog A', author: 'Anna' },
    { title: 'Blog B', author: 'Bob' },
    { title: 'Blog C', author: 'Anna' },
    { title: 'Blog D', author: 'Anna' }
  ]

  test('author with the most blogs is Anna', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Anna',
      blogs: 3
    })
  })
})

describe('mostLikes', () => {
  const blogs = [
    { author: 'Anna', likes: 5 },
    { author: 'Bob', likes: 10 },
    { author: 'Anna', likes: 8 },
    { author: 'Bob', likes: 5 }
  ]

  test('the author with most likes is Bob', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Bob',
      likes: 15
    })
  })
})
