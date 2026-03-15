import Api from './Api'

export default {
    // ดึง notifications ทั้งหมดของ user ที่ login
    getAll() {
        return Api().get('notifications')
    },
    // mark ทุก notification ว่าอ่านแล้ว
    markAllRead() {
        return Api().put('notifications/read')
    },
    // ลบ notification เดี่ยว
    deleteOne(id) {
        return Api().delete('notification/' + id)
    }
}
