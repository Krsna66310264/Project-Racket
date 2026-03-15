module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: 'badminton_app', // ชื่อ Database ที่คุณสร้างไว้ใน MySQL Workbench
        user: 'root',              // Username ของ MySQL (ค่าเริ่มต้นมักจะเป็น root)
        password: 'James122548',
        options: {
            dialect: 'mysql',      // ระบุว่าเราใช้ MySQL
            host: 'localhost'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret-badminton-key'
    }
}