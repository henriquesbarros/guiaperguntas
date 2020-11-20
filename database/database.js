const Sequelize = require('sequelize')
const connection = new Sequelize('guiaperguntas', 'root', '162636', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection