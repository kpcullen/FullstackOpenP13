const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class InvalidToken extends Model {}

InvalidToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'invalid_token',
  }
)

module.exports = InvalidToken
