const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const { sequelize } = require('../util/db')

User.belongsToMany(Blog, { through: ReadingList, as: 'toRead' })
Blog.belongsToMany(User, { through: ReadingList, as: 'userList' })

User.hasMany(Blog, { foreignKey: ['blogs'] })
Blog.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
  Blog,
  User,
  ReadingList,
}
