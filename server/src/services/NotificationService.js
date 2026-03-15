const { Notification } = require('../models')

/**
 * สร้าง notification ใหม่ในฐานข้อมูล
 */
const create = async (userId, type, message, postId = null) => {
    try {
        await Notification.create({ user_id: userId, type, message, post_id: postId })
    } catch (err) {
        console.error('NotificationService create error:', err.message)
    }
}

module.exports = {
    /**
     * แจ้งเตือนเมื่อมีคนเข้าร่วมก๊วน
     * - แจ้งเจ้าของโพสต์
     * - แจ้งสมาชิกที่อยู่ในก๊วนอยู่ก่อนหน้า
     */
    async notifyJoin(ownerId, joinerName, postTitle, current, target, postId, prevMemberIds = []) {
        const isFull = current >= target

        // แจ้งเจ้าของ
        const ownerMsg = isFull
            ? `${joinerName} เพิ่งเข้าร่วมเป็นคนสุดท้าย! ก๊วน "${postTitle}" ครบ ${target} คนแล้ว 🎉`
            : `${joinerName} เข้าร่วมก๊วน "${postTitle}" (${current}/${target} คน)`
        const ownerType = isFull ? 'full' : 'join'
        await create(ownerId, ownerType, ownerMsg, postId)

        // แจ้งสมาชิกคนอื่น
        if (prevMemberIds.length > 0) {
            const memberMsg = isFull
                ? `${joinerName} เข้าร่วมก๊วน "${postTitle}" และตอนนี้ก๊วนครบแล้ว! (${current}/${target} คน) 🎉`
                : `${joinerName} เข้าร่วมก๊วน "${postTitle}" (${current}/${target} คน)`
            const memberType = isFull ? 'full' : 'join'
            for (const memberId of prevMemberIds) {
                // ไม่ส่งถึงเจ้าของซ้ำ
                if (memberId !== ownerId) {
                    await create(memberId, memberType, memberMsg, postId)
                }
            }
        }
    },

    /**
     * แจ้งเตือนเมื่อมีคนออกจากก๊วน (แจ้งเฉพาะเจ้าของ)
     */
    async notifyLeave(ownerId, leaverName, postTitle, current, target, postId) {
        const msg = `${leaverName} ยกเลิกการเข้าร่วมก๊วน "${postTitle}" (${current}/${target} คน)`
        await create(ownerId, 'leave', msg, postId)
    }
}
