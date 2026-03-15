const bcrypt = require('bcrypt') // เรียกใช้ bcrypt สำหรับเข้ารหัสรหัสผ่าน 

// ฟังก์ชันสำหรับทำการ Hash รหัสผ่านก่อนบันทึกลงฐานข้อมูล
async function hashPassword(user, options) {
    if (!user.changed('password')) { // ตรวจสอบว่ามีการแก้ไขรหัสผ่านหรือไม่ 
        return
    }
    const salt = await bcrypt.genSalt(10) // สร้างค่า Salt เพื่อความปลอดภัย 
    const hash = await bcrypt.hash(user.password, salt) // ทำการ Hash รหัสผ่าน 
    user.setDataValue('password', hash) // แทนที่รหัสผ่านเดิมด้วยค่า Hash 
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true, // อีเมลต้องไม่ซ้ำกันในระบบ 
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        skill_level: DataTypes.STRING,
        gender: DataTypes.STRING,  // 'ชาย' | 'หญิง' | 'ไม่ระบุ'
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user' // กำหนดค่าเริ่มต้นเป็น user 
        }
    }, {
        hooks: {
            // เรียกใช้ฟังก์ชัน hashPassword ก่อนที่จะทำการสร้าง (Create) หรืออัปเดต (Update) ข้อมูล 
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    })

    // เพิ่มฟังก์ชันต้นแบบสำหรับเปรียบเทียบรหัสผ่านตอน Login 
    User.prototype.comparePassword = async function (password) {
        return await bcrypt.compare(password, this.password) // ตรวจสอบรหัสผ่านที่รับมากับรหัสที่ถูก Hash ไว้ 
    }

    return User
}