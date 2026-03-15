import axios from 'axios'
import { useAuthenStore } from '../stores/authen'

export default () => {
    const authenStore = useAuthenStore()
    return axios.create({
        baseURL: 'http://localhost:8081/', // ชี้ไปที่ Backend ของเรา
        headers: {
            Authorization: `Bearer ${authenStore.token}` // แนบ Token อัตโนมัติ [cite: 503]
        }
    })
}