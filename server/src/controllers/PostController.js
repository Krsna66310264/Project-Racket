const { Post, User, Court } = require('../models')
const NotificationService = require('../services/NotificationService')


module.exports = {
    // 1. ดึงข้อมูลประกาศทั้งหมด (Match Board)
    async index(req, res) {
        try {
            const posts = await Post.findAll({
                include: [{ model: User, as: 'owner', attributes: ['name', 'gender'] }]
            })
            res.send(posts)
        } catch (error) {
            res.status(500).send({ error: 'ดึงข้อมูลโพสต์ไม่สำเร็จ' })
        }
    },

    // 2. สร้างประกาศใหม่
    async create(req, res) {
        try {
            const post = await Post.create({
                ...req.body,
                user_id: req.user.id
            })
            res.send({ message: 'สร้างโพสต์หาเพื่อนสำเร็จ!', post: post })
        } catch (error) {
            console.error('CREATE POST ERROR:', error.message)
            res.status(500).send({ error: 'สร้างโพสต์ไม่สำเร็จ ตรวจสอบข้อมูลของคุณให้ครบถ้วน' })
        }
    },

    async put(req, res) {
        try {
            const post = await Post.findByPk(req.params.postId)
            if (!post) return res.status(404).send({ error: 'ไม่พบโพสต์' })

            if (post.user_id !== req.user.id) {
                return res.status(403).send({ error: 'ไม่มีสิทธิ์แก้ไขโพสต์นี้' })
            }

            await post.update(req.body)
            res.send({ message: 'แก้ไขโพสต์สำเร็จ!' })
        } catch (error) {
            res.status(500).send({ error: 'แก้ไขโพสต์ไม่สำเร็จ' })
        }
    },

    async remove(req, res) {
        try {
            const post = await Post.findByPk(req.params.postId)
            if (!post) return res.status(404).send({ error: 'ไม่พบโพสต์' })

            if (req.user.role !== 'admin' && post.user_id !== req.user.id) {
                return res.status(403).send({ error: 'ไม่มีสิทธิ์ลบโพสต์นี้' })
            }

            await post.destroy()
            res.send({ message: 'ลบโพสต์สำเร็จ!' })
        } catch (error) {
            res.status(500).send({ error: 'ลบโพสต์ไม่สำเร็จ' })
        }
    },

    // 5. ดูรายละเอียดประกาศ 1 รายการ
    async show(req, res) {
        try {
            const post = await Post.findByPk(req.params.postId, {
                include: [{ model: User, as: 'owner', attributes: ['name', 'gender'] }]
            })
            res.send(post)
        } catch (error) {
            res.status(500).send({ error: 'ไม่สามารถดึงข้อมูลโพสต์ได้' })
        }
    },

    async join(req, res) {
        try {
            const post = await Post.findByPk(req.params.postId)
            if (!post) return res.status(404).send({ error: 'ไม่พบโพสต์นี้' })

            if (post.user_id === req.user.id) {
                return res.status(403).send({ error: 'คุณเป็นเจ้าของโพสต์นี้ ไม่สามารถเข้าร่วมตัวเองได้' })
            }

            const joinedIds = post.joined_user_ids ? JSON.parse(post.joined_user_ids) : []
            if (joinedIds.includes(req.user.id)) {
                return res.status(400).send({ error: 'คุณเข้าร่วมโพสต์นี้แล้ว' })
            }

            if (post.status === 'full' || post.current_players >= post.target_players) {
                return res.status(400).send({ error: 'ก๊วนนี้คนเต็มแล้ว!' })
            }

            const prevJoinedIds = [...joinedIds]

            joinedIds.push(req.user.id)
            post.joined_user_ids = JSON.stringify(joinedIds)
            post.current_players += 1

            if (post.current_players >= post.target_players) {
                post.status = 'full'
            }

            await post.save()

            // ===== แจ้งเตือนภายในแอป =====
            const joinerName = req.user.name
            const postTitle = post.title ? post.title.split('_DESC_')[0] : 'ไม่ระบุ'

            await NotificationService.notifyJoin(
                post.user_id,
                joinerName,
                postTitle,
                post.current_players,
                post.target_players,
                post.id,
                prevJoinedIds
            )

            res.send(post)
        } catch (err) {
            console.error('JOIN ERROR:', err.message)
            res.status(500).send({ error: 'เกิดข้อผิดพลาดในการเข้าร่วม' })
        }
    },

    async leave(req, res) {
        try {
            const post = await Post.findByPk(req.params.postId)
            if (!post) return res.status(404).send({ error: 'ไม่พบโพสต์นี้' })

            if (post.user_id === req.user.id) {
                return res.status(403).send({ error: 'เจ้าของโพสต์ไม่สามารถยกเลิกการเข้าร่วมตัวเองได้' })
            }

            let joinedIds = post.joined_user_ids ? JSON.parse(post.joined_user_ids) : []
            if (!joinedIds.includes(req.user.id)) {
                return res.status(400).send({ error: 'คุณยังไม่ได้เข้าร่วมโพสต์นี้' })
            }

            // นำ User ID ออกจาก Array
            joinedIds = joinedIds.filter(id => id !== req.user.id)
            post.joined_user_ids = JSON.stringify(joinedIds)

            // ลดจำนวนคน
            post.current_players = Math.max(1, post.current_players - 1)

            // ถ้าก่อนหน้าสถานะเต็ม และตอนนี้คนน้อยกว่า target ให้เปลี่ยนเป็น open
            if (post.status === 'full' && post.current_players < post.target_players) {
                post.status = 'open'
            }

            await post.save()

            // ===== แจ้งเตือนภายในแอป =====
            const leaverName = req.user.name
            const postTitle = post.title ? post.title.split('_DESC_')[0] : 'ไม่ระบุ'

            await NotificationService.notifyLeave(
                post.user_id,
                leaverName,
                postTitle,
                post.current_players,
                post.target_players,
                post.id
            )

            res.send(post)
        } catch (err) {
            console.error('LEAVE ERROR:', err.message)
            res.status(500).send({ error: 'เกิดข้อผิดพลาดในการยกเลิกเข้าร่วม' })
        }
    }
}
