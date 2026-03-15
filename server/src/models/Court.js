module.exports = (sequelize, DataTypes) => {
    const Court = sequelize.define('Court', {
        name: {
            type: DataTypes.STRING,
            allowNull: false // ชื่อสนามห้ามเป็นค่าว่าง
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true // พิกัดหรือที่อยู่สนาม
        }
    })
    return Court
}