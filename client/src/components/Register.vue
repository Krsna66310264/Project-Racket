<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div class="w-full max-w-md">

            <div class="text-center mb-8">
                <img src="../assets/logo.png" alt="racket" class="w-14 h-14 object-contain mx-auto mb-4" />
                <h1 class="text-2xl font-semibold text-slate-800">สมัครสมาชิก</h1>
                <p class="text-slate-500 text-sm mt-1">สร้างบัญชี racket ของคุณ</p>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <form @submit.prevent="onRegister" class="flex flex-col gap-4">

                    <div>
                        <label class="form-label">ชื่อผู้ใช้</label>
                        <input type="text" v-model="name" required placeholder="ชื่อของคุณ" class="form-input" />
                    </div>

                    <div>
                        <label class="form-label">อีเมล</label>
                        <input type="email" v-model="email" required placeholder="your@email.com" class="form-input" />
                    </div>

                    <div>
                        <label class="form-label">รหัสผ่าน</label>
                        <input type="password" v-model="password" required placeholder="••••••••" class="form-input" />
                    </div>

                    <div>
                        <label class="form-label">ระดับทักษะ</label>
                        <select v-model="skill_level" required class="form-select bg-white appearance-none">
                            <option value="" disabled selected>เลือกระดับ</option>
                            <option value="มือใหม่">มือใหม่</option>
                            <option value="กลาง">กลาง</option>
                            <option value="สูง">สูง</option>
                        </select>
                    </div>

                    <div>
                        <label class="form-label">เพศ</label>
                        <select v-model="gender" required class="form-select bg-white appearance-none">
                            <option value="" disabled selected>เลือกเพศ</option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                            <option value="ไม่ระบุ">ไม่ระบุ</option>
                        </select>
                    </div>

                    <div v-if="error" class="alert-error">
                        {{ error }}
                    </div>
                    <div v-if="successMsg" class="alert-success">
                        {{ successMsg }}
                    </div>

                    <button type="submit" class="btn btn-primary w-full py-3 mt-1">
                        สมัครสมาชิก
                    </button>

                    <p class="text-center text-sm text-slate-500">
                        มีบัญชีอยู่แล้ว?
                        <router-link to="/login"
                            class="text-emerald-600 hover:underline font-medium">เข้าสู่ระบบ</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const skill_level = ref('')
const gender = ref('')
const error = ref(null)
const successMsg = ref(null)

const router = useRouter()

const onRegister = async () => {
    try {
        error.value = null
        await AuthenService.register({
            name: name.value,
            email: email.value,
            password: password.value,
            skill_level: skill_level.value,
            gender: gender.value,
            role: 'user'
        })
        successMsg.value = 'สมัครสมาชิกสำเร็จ!'
        setTimeout(() => { router.push({ path: '/login' }) }, 2000)
    } catch (err) {
        error.value = err.response?.data?.error || 'การสมัครสมาชิกล้มเหลว'
    }
}
</script>