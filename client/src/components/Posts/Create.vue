<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-8">
            <h1 class="page-title">สร้างโพสต์หาเพื่อนตีแบด</h1>
            <p class="page-subtitle">กรอกรายละเอียดเพื่อหาเพื่อนร่วมก๊วน</p>
        </div>

        <div class="card-body">
            <div class="flex flex-col gap-5">

                <!-- ชื่อสนาม + Autocomplete -->
                <div class="relative">
                    <label class="form-label">ชื่อสนาม</label>
                    <input v-model="form.court_name" type="text" placeholder="เช่น สนามแบดมินตัน ABC" autocomplete="off"
                        @input="onCourtInput" @blur="hideSuggestions" class="form-input" />

                    <!-- Dropdown suggestions -->
                    <ul v-if="showSuggestions && filteredCourts.length > 0"
                        class="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 shadow-lg overflow-hidden">
                        <li v-for="court in filteredCourts" :key="court.id" @mousedown.prevent="selectCourt(court)"
                            class="px-4 py-2.5 text-sm cursor-pointer hover:bg-emerald-500/5 transition-colors">
                            <p class="text-slate-700 font-medium">{{ court.name }}</p>
                            <p v-if="court.location" class="text-xs text-slate-400 mt-0.5">{{ court.location }}</p>
                        </li>
                    </ul>
                </div>

                <!-- ที่ตั้งสนาม — แสดงเฉพาะตอนพิมชื่อสนามใหม่ -->
                <div v-if="isNewCourt && form.court_name">
                    <label class="form-label">ที่ตั้งสนาม <span
                            class="text-slate-400 font-normal">(ไม่บังคับ)</span></label>
                    <input v-model="form.court_location" type="text" placeholder="เช่น ซอยสุขุมวิท 101"
                        class="form-input" />
                </div>

                <!-- เวลาเริ่ม-เลิก -->
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="form-label">วันและเวลาที่เล่น</label>
                        <input v-model="form.play_time" type="datetime-local" :min="todayMin" class="form-input" />
                    </div>
                    <div>
                        <label class="form-label">เวลาเลิกเล่น</label>
                        <input v-model="form.end_time" type="time" class="form-input" />
                    </div>
                </div>

                <div>
                    <label class="form-label">ระดับฝีมือ</label>
                    <select v-model="form.skill_level" class="form-select">
                        <option value="">-- เลือกระดับ --</option>
                        <option value="มือใหม่">มือใหม่</option>
                        <option value="กลาง">กลาง</option>
                        <option value="เก่ง">เก่ง</option>
                        <option value="ทุกระดับ">ทุกระดับ</option>
                    </select>
                </div>

                <div>
                    <label class="form-label">จำนวนผู้เล่นที่ต้องการ</label>
                    <input v-model.number="form.target_players" type="number" min="2" max="20" placeholder="เช่น 4"
                        class="form-input" />
                </div>

                <div>
                    <label class="form-label">รายละเอียดเพิ่มเติม</label>
                    <textarea v-model="form.description" rows="4" placeholder="เช่น ค่าสนาม, อุปกรณ์, เงื่อนไขอื่นๆ"
                        class="form-textarea"></textarea>
                </div>

                <p v-if="errorMsg" class="alert-error">{{ errorMsg }}</p>

                <div class="flex gap-3 pt-2">
                    <button @click="$router.push({ name: 'posts' })" class="btn btn-outline-secondary flex-1">
                        ยกเลิก
                    </button>
                    <button @click="handleSubmit" :disabled="loading" class="btn btn-primary flex-1">
                        {{ loading ? 'กำลังสร้าง...' : 'สร้างโพสต์' }}
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenStore } from '../../stores/authen'
import PostsService from '../../services/PostsService'
import CourtsService from '../../services/CourtsService'

const router = useRouter()
const authenStore = useAuthenStore()

// วันนี้ขั้นต่ำสำหรับ datetime-local
const todayMin = new Date().toISOString().slice(0, 16)

const loading = ref(false)
const errorMsg = ref('')
const courts = ref([])
const showSuggestions = ref(false)

const form = ref({
    court_name: '',
    court_location: '',
    play_time: '',
    end_time: '',
    skill_level: '',
    target_players: null,
    description: ''
})

onMounted(async () => {
    try {
        const res = await CourtsService.index()
        courts.value = res.data
    } catch (e) {
        console.error('โหลดสนามไม่สำเร็จ', e)
    }
})

const isNewCourt = computed(() => {
    if (!form.value.court_name) return false
    return !courts.value.some(
        c => c.name.toLowerCase() === form.value.court_name.toLowerCase()
    )
})

const filteredCourts = computed(() => {
    if (!form.value.court_name) return courts.value
    return courts.value.filter(c =>
        c.name.toLowerCase().includes(form.value.court_name.toLowerCase())
    )
})

const onCourtInput = () => {
    showSuggestions.value = true
    form.value.court_location = ''
}

const selectCourt = (court) => {
    form.value.court_name = court.name
    form.value.court_location = ''
    showSuggestions.value = false
}

const hideSuggestions = () => {
    setTimeout(() => { showSuggestions.value = false }, 150)
}

const handleSubmit = async () => {
    errorMsg.value = ''

    if (!form.value.court_name || !form.value.play_time || !form.value.target_players) {
        errorMsg.value = 'กรุณากรอกข้อมูลให้ครบ (ชื่อสนาม, เวลา, จำนวนผู้เล่น)'
        return
    }

    try {
        loading.value = true

        if (isNewCourt.value) {
            const newCourt = await CourtsService.post({
                name: form.value.court_name,
                location: form.value.court_location || null
            })
            courts.value.push(newCourt.data)
        }

        const dateOnly = form.value.play_time ? form.value.play_time.split('T')[0] : null
        const combinedEndTime = dateOnly && form.value.end_time ? `${dateOnly}T${form.value.end_time}` : null

        const payload = {
            title: form.value.court_name,
            description: form.value.description,
            date_time: form.value.play_time,
            end_time: combinedEndTime,
            target_players: form.value.target_players,
            current_players: 1,
            skill_required: form.value.skill_level,
            status: 'open',
            owner_email: authenStore.user?.email || 'ไม่ระบุอีเมล'
        }

        await PostsService.post(payload)
        router.push({ name: 'posts' })
    } catch (error) {
        errorMsg.value = 'สร้างโพสต์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>