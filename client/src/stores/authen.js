import { defineStore } from 'pinia'

export const useAuthenStore = defineStore('authen', {
    state: () => ({
        token: null, // กล่องเก็บ JWT Token [cite: 365]
        user: null   // กล่องเก็บข้อมูลผู้ใช้ [cite: 366]
    }),
    getters: {
        isUserLoggedIn: (state) => !!state.token // เช็คว่า Login อยู่ไหม [cite: 372-373]
    },
    actions: {
        setToken(token) { this.token = token }, // [cite: 389]
        setUser(user) { this.user = user },     // [cite: 389]
        logout() {                              // ล้างข้อมูลตอนกดออกระบบ [cite: 390]
            this.token = null
            this.user = null
        }
    },
    persist: true // สำคัญ! ให้ Token ฝังลง Local Storage อัตโนมัติ [cite: 392-394]
})