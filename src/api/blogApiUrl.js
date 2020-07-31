/**
 * 封装 blog 相关的 API_URL
 * @type {{getBlogList: string, deleteBlogById: string, insertBlog: string, getBlogById: string, updateBlogById: string}}
 */
const BLOG_API_URL = {
  getBlogList: '/blog/list/',
  getBlogById: '/blog/id',
  insertBlog: '/blog/insert',
  updateBlogById: '/blog/id',
  updateBlogTagById: '/blog/updateTag/id',
  deleteBlogById: '/blog/id',
  getViewsAndLikesAndNum: '/blog/views&likes&num',
  getTop5BlogList: '/blog/top5'
}

export default BLOG_API_URL
