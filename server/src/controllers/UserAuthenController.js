const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

// ฟังก์ชันสร้าง Token
function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    // ระบบสมัครสมาชิก (แบบตรวจสอบความปลอดภัย)
    async register(req, res) {
        try {
            const user = await User.create(req.body)
            const userJson = user.toJSON()
            res.send({
                user: userJson,
                token: jwtSignUser(userJson)
            })
        } catch (err) {
            res.status(400).send({
                error: 'อีเมลนี้มีอยู่ในระบบแล้ว'
            })
        }
    },
    // ระบบ Login
    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({
                where: { email: email }
            })

            if (!user) {
                return res.status(403).send({ error: 'ข้อมูลการลงชื่อเข้าใช้ไม่ถูกต้อง' })
            }

            // ใช้ comparePassword ที่ defined ไว้ใน User model
            const isPasswordValid = await user.comparePassword(password)
            if (!isPasswordValid) {
                return res.status(403).send({ error: 'ข้อมูลการลงชื่อเข้าใช้ไม่ถูกต้อง' })
            }

            const userJson = user.toJSON()
            res.send({
                user: userJson,
                token: jwtSignUser(userJson)
            })
        } catch (err) {
            res.status(500).send({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' })
        }
    }
}