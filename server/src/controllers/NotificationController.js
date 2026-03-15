const { Notification } = require('../models')

module.exports = {
    // GET /notifications — ดึง notifications ของ user ที่ login อยู่
    async index(req, res) {
        try {
            const notifications = await Notification.findAll({
                where: { user_id: req.user.id },
                order: [['createdAt', 'DESC']],
                limit: 50
            })
            res.send(notifications)
        } catch (err) {
            console.error('Notification index error:', err.message)
            res.status(500).send({ error: 'ดึงการแจ้งเตือนไม่สำเร็จ' })
        }
    },

    // PUT /notifications/read — mark ทุก notification ของ user ว่าอ่านแล้ว
    async markAllRead(req, res) {
        try {
            await Notification.update(
                { is_read: true },
                { where: { user_id: req.user.id, is_read: false } }
            )
            res.send({ message: 'อ่านการแจ้งเตือนทั้งหมดแล้ว' })
        } catch (err) {
            console.error('Notification markAllRead error:', err.message)
            res.status(500).send({ error: 'อัปเดตการแจ้งเตือนไม่สำเร็จ' })
        }
    },

    // DELETE /notification/:id — ลบ notification เดี่ยว
    async remove(req, res) {
        try {
            const notification = await Notification.findByPk(req.params.id)
            if (!notification) return res.status(404).send({ error: 'ไม่พบการแจ้งเตือน' })
            if (notification.user_id !== req.user.id) {
                return res.status(403).send({ error: 'ไม่มีสิทธิ์ลบการแจ้งเตือนนี้' })
            }
            await notification.destroy()
            res.send({ message: 'ลบการแจ้งเตือนสำเร็จ' })
        } catch (err) {
            console.error('Notification remove error:', err.message)
            res.status(500).send({ error: 'ลบการแจ้งเตือนไม่สำเร็จ' })
        }
    }
}
