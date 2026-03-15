import Api from './Api'

export default {
    getMe() {
        return Api().get('user/me')
    },
    updateMe(data) {
        return Api().put('user/me', data)
    }
}