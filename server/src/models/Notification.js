module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING, // 'join' | 'leave' | 'full'
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    return Notification
}
