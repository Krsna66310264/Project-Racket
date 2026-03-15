// ไฟล์: src/controllers/UserController.js
const { User } = require('../models') // นำเข้าตาราง User จากฐานข้อมูล

module.exports = {
    // 1. ฟังก์ชันดึงข้อมูลผู้ใช้งานทั้งหมด (GET)
    async index(req, res) {
        try {
            const users = await User.findAll({
                attributes: req.user && req.user.role === 'admin'
                    ? { exclude: ['password'] }
                    : ['id', 'name', 'skill_level', 'gender', 'role']
            })
            res.send(users)
        } catch (error) {
            res.status(500).send({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' })
        }
    },

    // 2. ฟังก์ชันสร้างผู้ใช้งานใหม่ / สมัครสมาชิก (POST)
    async create(req, res) {
        try {
            const user = await User.create(req.body)
            res.send({
                message: 'สร้างผู้ใช้งานสำเร็จ!',
                user: user
            })
        } catch (error) {
            res.status(400).send({ error: 'ไม่สามารถสร้างผู้ใช้งานได้ (อีเมลนี้อาจถูกใช้งานไปแล้ว)' })
        }
    },

    // 3. ฟังก์ชันแก้ไขข้อมูลผู้ใช้ (PUT)
    async put(req, res) {
        try {
            await User.update(req.body, {
                where: { id: req.params.userId }
            })
            res.send({ message: 'แก้ไขข้อมูลผู้ใช้สำเร็จ!' })
        } catch (error) {
            res.status(500).send({ error: 'อัปเดตข้อมูลไม่สำเร็จ' })
        }
    },

    // 4. ฟังก์ชันลบผู้ใช้งาน (DELETE)
    async remove(req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.params.userId }
            })
            if (!user) {
                return res.status(403).send({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
            }
            await user.destroy()
            res.send({ message: 'ลบผู้ใช้งานสำเร็จ!' })
        } catch (error) {
            res.status(500).send({ error: 'ลบข้อมูลไม่สำเร็จ' })
        }
    },

    // 5. ฟังก์ชันดูข้อมูลผู้ใช้งานรายคน (GET by ID)
    async show(req, res) {
        try {
            const user = await User.findByPk(req.params.userId, {
                attributes: req.user && (req.user.role === 'admin' || req.user.id == req.params.userId)
                    ? { exclude: ['password'] }
                    : ['id', 'name', 'skill_level', 'gender', 'role']
            })
            res.send(user)
        } catch (error) {
            res.status(500).send({ error: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้' })
        }
    },

    // 6. ดึงโปรไฟล์ของตัวเอง (GET /user/me)
    async getMe(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            })
            if (!user) return res.status(404).send({ error: 'ไม่พบผู้ใช้งาน' })
            res.send(user)
        } catch (error) {
            res.status(500).send({ error: 'ดึงโปรไฟล์ไม่สำเร็จ' })
        }
    },

    // 7. อัปเดตโปรไฟล์ของตัวเอง (PUT /user/me)
    async updateMe(req, res) {
        try {
            const user = await User.findByPk(req.user.id)
            if (!user) return res.status(404).send({ error: 'ไม่พบผู้ใช้งาน' })

            const { name, skill_level, gender, password } = req.body
            const updateData = { name, skill_level, gender }

            // เปลี่ยนรหัสผ่านเฉพาะเมื่อส่งมา
            if (password && password.trim() !== '') {
                updateData.password = password
            }

            await user.update(updateData)
            const updated = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            })
            res.send({ message: 'บันทึกข้อมูลสำเร็จ!', user: updated })
        } catch (error) {
            console.error('UPDATE PROFILE ERROR:', error.message)
            res.status(500).send({ error: 'บันทึกไม่สำเร็จ' })
        }
    }
}