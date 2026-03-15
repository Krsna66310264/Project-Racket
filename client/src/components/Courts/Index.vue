<template>
    <div class="max-w-5xl">

        <div class="flex justify-between items-center mb-10">
            <div>
                <h1 class="page-title">สนามแบดมินตัน</h1>
                <p class="page-subtitle">รายการสนามทั้งหมดในระบบ</p>
            </div>
            <span v-if="isAdmin" class="badge badge-primary px-3 py-1.5 rounded-lg">
                โหมด Admin
            </span>
        </div>

        <div v-if="courts.length === 0" class="text-center py-16 card">
            <h3 class="text-lg font-semibold text-slate-700">ยังไม่มีสนามในระบบ</h3>
            <p class="text-slate-500 mt-1 text-sm">ยังไม่มีสนามที่ถูกเพิ่มเข้ามา</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="court in courts" :key="court.id" class="card-interactive">

                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 class="font-semibold text-slate-800 text-base leading-tight truncate">{{ court.name }}</h2>
                    </div>
                </div>

                <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <span>{{ court.location || 'ไม่ระบุที่ตั้ง' }}</span>
                </div>

                <!-- ปุ่มลบ เฉพาะ Admin -->
                <button v-if="isAdmin" @click="handleDelete(court)"
                    class="w-full border border-red-200 text-red-500 text-sm font-medium py-2 rounded-lg hover:bg-red-50 transition-colors">
                    ลบสนาม
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthenStore } from '../../stores/authen'
import CourtsService from '../../services/CourtsService'

const authenStore = useAuthenStore()
const courts = ref([])
const isAdmin = computed(() => authenStore.user?.role === 'admin')

const fetchCourts = async () => {
    try {
        const response = await CourtsService.index()
        courts.value = response.data
    } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลสนามได้:', error)
    }
}

const handleDelete = async (court) => {
    if (!confirm(`ยืนยันลบสนาม "${court.name}"?`)) return
    try {
        await CourtsService.delete(court)
        await fetchCourts()
    } catch (error) {
        alert(error.response?.data?.error || 'ลบไม่สำเร็จ')
    }
}

onMounted(() => {
    fetchCourts()
})
</script>