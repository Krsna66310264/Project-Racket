<template>
    <div class="max-w-2xl mx-auto">

        <div class="mb-8">
            <h1 class="page-title">โปรไฟล์ของฉัน</h1>
            <p class="page-subtitle">ข้อมูลส่วนตัวและการตั้งค่าบัญชี</p>
        </div>

        <div class="card-body">

            <!-- Avatar + ชื่อ + ปุ่มแก้ไข -->
            <div class="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div
                    class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-2xl font-semibold shrink-0">
                    {{ authenStore.user?.name?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div class="flex-1 min-w-0">
                    <h2 class="font-semibold text-slate-800 text-lg truncate">{{ authenStore.user?.name }}</h2>
                    <p class="text-slate-500 text-sm truncate">{{ authenStore.user?.email }}</p>
                    <span class="badge badge-primary mt-1">
                        {{ authenStore.user?.role === 'admin' ? 'Admin' : 'นักกีฬา' }}
                    </span>
                </div>
                <!-- ปุ่มแก้ไข / ยกเลิก -->
                <div class="shrink-0">
                    <button v-if="!isEditing" @click="startEdit"
                        class="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-500 text-sm font-medium hover:bg-emerald-50 transition-colors">
                        แก้ไข
                    </button>
                    <button v-else @click="cancelEdit"
                        class="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">
                        ยกเลิก
                    </button>
                </div>
            </div>

            <!-- Form -->
            <div class="flex flex-col gap-5">

                <div>
                    <label class="form-label">ชื่อ</label>
                    <input v-model="form.name" type="text" :disabled="!isEditing" class="form-input" />
                </div>

                <div>
                    <label class="form-label">อีเมล</label>
                    <input v-model="form.email" type="email" disabled class="form-input" />
                    <p class="text-xs text-slate-400 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
                </div>

                <div>
                    <label class="form-label">ระดับฝีมือ</label>
                    <select v-model="form.skill_level" :disabled="!isEditing" class="form-select">
                        <option value="">-- เลือกระดับ --</option>
                        <option value="มือใหม่">มือใหม่</option>
                        <option value="กลาง">กลาง</option>
                        <option value="สูง">สูง</option>
                    </select>
                </div>


                <div>
                    <label class="form-label">เพศ</label>
                    <select v-model="form.gender" :disabled="!isEditing" class="form-select">
                        <option value="">ไม่ระบุ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                    </select>
                </div>

                <div v-if="isEditing">
                    <label class="form-label">
                        รหัสผ่านใหม่ <span class="text-slate-400 font-normal">(ถ้าต้องการเปลี่ยน)</span>
                    </label>
                    <input v-model="form.password" type="password" placeholder="เว้นว่างถ้าไม่ต้องการเปลี่ยน"
                        class="form-input" />
                </div>

                <p v-if="successMsg" class="alert-success">{{ successMsg }}</p>
                <p v-if="errorMsg" class="alert-error">{{ errorMsg }}</p>

                <!-- ปุ่มบันทึก (เฉพาะโหมดแก้ไข) -->
                <button v-if="isEditing" @click="handleSave" :disabled="loading" class="btn btn-primary w-full py-3">
                    {{ loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthenStore } from '../../stores/authen'
import UsersService from '../../services/UsersService'

const authenStore = useAuthenStore()
const loading = ref(false)
const isEditing = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = ref({ name: '', email: '', skill_level: '', gender: '', password: '' })
// snapshot สำหรับ cancel
const snapshot = ref({})

const fillForm = (user) => {
    form.value.name = user.name || ''
    form.value.email = user.email || ''
    form.value.skill_level = user.skill_level || ''
    form.value.gender = user.gender || ''
    form.value.password = ''
}

onMounted(async () => {
    try {
        const res = await UsersService.getMe()
        fillForm(res.data)
        authenStore.setUser({ ...authenStore.user, ...res.data })
    } catch {
        fillForm(authenStore.user || {})
    }
})

const startEdit = () => {
    snapshot.value = { ...form.value }
    isEditing.value = true
    successMsg.value = ''
    errorMsg.value = ''
}

const cancelEdit = () => {
    fillForm(snapshot.value)
    isEditing.value = false
    errorMsg.value = ''
}

const handleSave = async () => {
    successMsg.value = ''
    errorMsg.value = ''
    try {
        loading.value = true
        const payload = { ...form.value }
        if (!payload.password) delete payload.password

        const response = await UsersService.updateMe(payload)
        authenStore.setUser({ ...authenStore.user, ...response.data.user })
        fillForm(response.data.user)
        isEditing.value = false
        successMsg.value = 'บันทึกข้อมูลสำเร็จ'
    } catch (error) {
        errorMsg.value = error.response?.data?.error || 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
    } finally {
        loading.value = false
    }
}
</script>