// ไฟล์: src/models/index.js
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

// เชื่อมต่อ MySQL ด้วยค่าคอนฟิกที่เราตั้งไว้
const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

// โค้ดส่วนนี้จะวนลูปอ่านไฟล์ Model ทุกไฟล์ในโฟลเดอร์นี้
fs.readdirSync(__dirname)
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

db.sequelize = sequelize
db.Sequelize = Sequelize

// ความสัมพันธ์: โพสต์เป็นของผู้ใช้
if (db.Post && db.User) {
    db.Post.belongsTo(db.User, { foreignKey: 'user_id', as: 'owner' })
    db.User.hasMany(db.Post, { foreignKey: 'user_id', as: 'posts' })
}

// ความสัมพันธ์: การแจ้งเตือนเป็นของผู้ใช้
if (db.Notification && db.User) {
    db.Notification.belongsTo(db.User, { foreignKey: 'user_id', as: 'recipient' })
    db.User.hasMany(db.Notification, { foreignKey: 'user_id', as: 'notifications' })
}

module.exports = db