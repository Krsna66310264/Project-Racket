const { Court } = require('../models')

module.exports = {
    // ดึงข้อมูลสนามทั้งหมด
    async index(req, res) {
        try {
            const courts = await Court.findAll()
            res.send(courts)
        } catch (error) {
            res.status(500).send({ error: 'ดึงข้อมูลสนามไม่สำเร็จ' })
        }
    },

    // สร้างข้อมูลสนามใหม่ (Admin)
    async create(req, res) {
        try {
            const court = await Court.create(req.body)
            res.send(court)
        } catch (error) {
            res.status(500).send({ error: 'สร้างข้อมูลสนามไม่สำเร็จ' })
        }
    },

    // แก้ไขข้อมูลสนาม (Admin)
    async put(req, res) {
        try {
            await Court.update(req.body, {
                where: { id: req.params.courtId }
            })
            res.send({ message: 'อัปเดตข้อมูลสนามสำเร็จ' })
        } catch (error) {
            res.status(500).send({ error: 'อัปเดตข้อมูลไม่สำเร็จ' })
        }
    },

    // ลบข้อมูลสนาม (Admin เท่านั้น)
    async remove(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).send({ error: 'เฉพาะ Admin เท่านั้นที่ลบสนามได้' })
            }
            const court = await Court.findOne({
                where: { id: req.params.courtId }
            })
            if (!court) {
                return res.status(404).send({ error: 'ไม่พบสนามนี้' })
            }
            await court.destroy()
            res.send({ message: 'ลบข้อมูลสนามสำเร็จ' })
        } catch (error) {
            res.status(500).send({ error: 'ลบข้อมูลไม่สำเร็จ' })
        }
    },

    // ดึงข้อมูลสนามเดียว
    async show(req, res) {
        try {
            const court = await Court.findByPk(req.params.courtId)
            res.send(court)
        } catch (error) {
            res.status(500).send({ error: 'ไม่พบข้อมูลสนาม' })
        }
    }
}