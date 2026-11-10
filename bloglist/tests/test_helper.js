const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'John',
    url: 'https://blog1.com',
    likes: 5
  },
  {
    title: 'Blog 2',
    author: 'Mary',
    url: 'https://blog2.com',
    likes: 10
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  usersInDb
}