module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        title: DataTypes.STRING,
        date_time: DataTypes.DATE,
        end_time: DataTypes.DATE,
        target_players: DataTypes.INTEGER,
        current_players: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        skill_required: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'open'
        },
        owner_email: DataTypes.STRING,
        description: DataTypes.TEXT,
        user_id: DataTypes.INTEGER,
        joined_user_ids: DataTypes.TEXT  // เก็บ JSON array ของ user IDs ที่เข้าร่วม
    })
    return Post
}