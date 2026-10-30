const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((bestBlog, blog) => {
    if (blog.likes > bestBlog.likes) {
      return blog
    }
    return bestBlog   
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  const counts = {}

  blogs.forEach((blog) => {
    if (counts[blog.author]) {
      counts[blog.author] += 1
    } else {
      counts[blog.author] = 1
    }
  })

  const authors = Object.entries(counts)

  const result = authors.reduce((max, current) => {
    const maxBlogCount = max[1]
    const currentBlogCount = current[1]

    if (currentBlogCount > maxBlogCount) {
      return current
    }
    return max
  })
  return {
    author: result[0],
    blogs: result[1]
  } 
}

const mostLikes = (blogs) => {
  const counts = {}

  blogs.forEach((blog) => {
    if (counts[blog.author]) {
      counts[blog.author] += blog.likes
    } else {
      counts[blog.author] = blog.likes
    }
  })

  const authors = Object.entries(counts)

  const result = authors.reduce((max, current) => {
    const maxLikeCount = max[1]
    const currentLikeCount = current[1]

    if (currentLikeCount > maxLikeCount) {
      return current
    }
    return max
  })
  return {
    author: result[0],
    likes: result[1]
  } 
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }