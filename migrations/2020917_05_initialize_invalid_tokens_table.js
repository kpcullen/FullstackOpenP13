const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('invalid_tokens', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('invalid_tokens')
  },
}
