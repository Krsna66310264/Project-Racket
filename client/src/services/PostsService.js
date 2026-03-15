import Api from './Api'

export default {
    // ดึงโพสต์ทั้งหมด (หรือค้นหา)
    index(search) {
        return Api().get('posts', {
            params: { search: search }
        })
    },
    // ดึงโพสต์เดี่ยวๆ ตาม ID
    show(postId) {
        return Api().get('post/' + postId)
    },
    // สร้างโพสต์นัดตีแบดใหม่
    post(post) {
        return Api().post('post', post)
    },
    // แก้ไขโพสต์
    put(post) {
        return Api().put('post/' + post.id, post)
    },
    // ลบโพสต์
    delete(post) {
        return Api().delete('post/' + post.id)
    },
    // เข้าร่วมโพสต์
    join(postId) {
        return Api().post('post/' + postId + '/join')
    },
    // ยกเลิกเข้าร่วมโพสต์
    leave(postId) {
        return Api().post('post/' + postId + '/leave')
    }
}