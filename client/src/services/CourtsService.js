import Api from './Api'

export default {
    index() {
        return Api().get('courts')
    },
    post(court) {
        return Api().post('court', court)
    },
    put(court) {
        return Api().put('court/' + court.id, court)
    },
    delete(court) {
        return Api().delete('court/' + court.id)
    }
}