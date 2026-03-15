<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div class="w-full max-w-md">

            <div class="text-center mb-8">
                <img src="../assets/logo.png" alt="racket" class="w-14 h-14 object-contain mx-auto mb-4" />
                <h1 class="text-2xl font-semibold text-slate-800">เข้าสู่ระบบ</h1>
                <p class="text-slate-500 text-sm mt-1">ยินดีต้อนรับกลับสู่ racket</p>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <form @submit.prevent="onLogin" class="flex flex-col gap-4">

                    <div>
                        <label class="form-label">อีเมล</label>
                        <input type="email" v-model="email" required placeholder="your@email.com" class="form-input" />
                    </div>

                    <div>
                        <label class="form-label">รหัสผ่าน</label>
                        <input type="password" v-model="password" required placeholder="••••••••" class="form-input" />
                    </div>

                    <div v-if="error" class="alert-error">
                        {{ error }}
                    </div>

                    <button type="submit" class="btn btn-primary w-full py-3 mt-1">
                        เข้าสู่ระบบ
                    </button>

                    <p class="text-center text-sm text-slate-500">
                        ยังไม่มีบัญชี?
                        <router-link to="/register"
                            class="text-emerald-600 hover:underline font-medium">สมัครสมาชิก</router-link>
                    </p>

                </form>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthenService from '../services/AuthenService'
import { useAuthenStore } from '../stores/authen'

const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()
const authenStore = useAuthenStore()

const onLogin = async () => {
    try {
        error.value = null
        const response = await AuthenService.login({ email: email.value, password: password.value })
        authenStore.setToken(response.data.token)
        authenStore.setUser(response.data.user)
        router.push({ path: '/posts' })
    } catch (err) {
        error.value = err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ'
    }
}
</script>