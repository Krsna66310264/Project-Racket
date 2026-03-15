// src/routes.js
const PostController = require('./controllers/PostController')
const UserController = require('./controllers/UserController')
const CourtController = require('./controllers/CourtController')
const UserAuthenController = require('./controllers/UserAuthenController')
const NotificationController = require('./controllers/NotificationController')
const isAuthen = require('./controllers/isAuthenController')

module.exports = (app) => {
    /* --- หมวด: ระบบยืนยันตัวตน (Authentication) --- */
    // สมัครสมาชิกและ Login เพื่อรับ Token
    app.post('/register', UserAuthenController.register)
    app.post('/login', UserAuthenController.login)

    /* --- หมวด: จัดการผู้ใช้งาน (User) --- */
    // เฉพาะคนที่ Login แล้วเท่านั้นถึงจะดูรายชื่อหรือจัดการ User ได้ (ใส่ isAuthen)
    app.get('/user/me', isAuthen, UserController.getMe)
    app.put('/user/me', isAuthen, UserController.updateMe)
    app.get('/users', isAuthen, UserController.index)
    app.get('/user/:userId', isAuthen, UserController.show)
    app.put('/user/:userId', isAuthen, UserController.put)
    app.delete('/user/:userId', isAuthen, UserController.remove)

    /* --- หมวด: จัดการสนาม (Court) --- */
    // รายชื่อสนามให้ทุกคนดูได้ แต่การ เพิ่ม/แก้ไข/ลบ ต้อง Login ก่อน
    app.get('/courts', CourtController.index)
    app.post('/court', isAuthen, CourtController.create)
    app.put('/court/:courtId', isAuthen, CourtController.put)
    app.delete('/court/:courtId', isAuthen, CourtController.remove)
    app.get('/court/:courtId', CourtController.show)

    /* --- หมวด: จัดการโพสต์ (Post) --- */
    // หน้าบอร์ดให้ทุกคนดูได้ แต่ถ้าจะสร้างโพสต์หาเพื่อนต้อง Login ก่อน
    app.get('/posts', PostController.index)
    app.post('/post', isAuthen, PostController.create)
    app.put('/post/:postId', isAuthen, PostController.put)
    app.delete('/post/:postId', isAuthen, PostController.remove)
    app.get('/post/:postId', PostController.show)

    app.post('/post/:postId/join', isAuthen, PostController.join)
    app.post('/post/:postId/leave', isAuthen, PostController.leave)

    /* --- หมวด: การแจ้งเตือน (Notifications) --- */
    app.get('/notifications', isAuthen, NotificationController.index)
    app.put('/notifications/read', isAuthen, NotificationController.markAllRead)
    app.delete('/notification/:id', isAuthen, NotificationController.remove)
}