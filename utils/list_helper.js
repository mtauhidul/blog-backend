const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
};

function favoriteBlog(blogs) {
  if (blogs.length === 0) return null;

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  }, blogs[0]);
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
