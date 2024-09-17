const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        isValidYear(year) {
          const currentYear = new Date().getFullYear()
          if (year < 1991 || year > currentYear) {
            throw new Error(`Year must be between 1991 and ${currentYear}`)
          }
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'blog',
    timestamps: false,
    underscored: true,
  }
)

module.exports = Blog
