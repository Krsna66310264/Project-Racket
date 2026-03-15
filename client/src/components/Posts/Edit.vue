<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-8">
            <h1 class="page-title">แก้ไขโพสต์</h1>
            <p class="page-subtitle">แก้ไขรายละเอียดโพสต์ของคุณ</p>
        </div>

        <div v-if="loadingPost" class="text-center py-16 text-slate-400">กำลังโหลด...</div>

        <div v-else class="card-body">
            <div class="flex flex-col gap-5">

                <!-- ชื่อสนาม + Autocomplete -->
                <div class="relative">
                    <label class="form-label">ชื่อสนาม</label>
                    <input v-model="form.court_name" type="text" placeholder="เช่น สนามแบดมินตัน ABC" autocomplete="off"
                        @input="onCourtInput" @blur="hideSuggestions" class="form-input" />

                    <ul v-if="showSuggestions && filteredCourts.length > 0"
                        class="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 shadow-lg overflow-hidden">
                        <li v-for="court in filteredCourts" :key="court.id" @mousedown.prevent="selectCourt(court)"
                            class="px-4 py-2.5 text-sm cursor-pointer hover:bg-emerald-500/5 transition-colors">
                            <p class="text-slate-700 font-medium">{{ court.name }}</p>
                            <p v-if="court.location" class="text-xs text-slate-400 mt-0.5">{{ court.location }}</p>
                        </li>
                    </ul>
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
                    <button @click="$router.push({ name: 'posts' })"
                        class="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                        ยกเลิก
                    </button>
                    <button @click="handleSubmit" :disabled="loading"
                        class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50">
                        {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PostsService from '../../services/PostsService'
import CourtsService from '../../services/CourtsService'

const router = useRouter()
const route = useRoute()

// วันนี้ขั้นต่ำสำหรับ datetime-local
const todayMin = new Date().toISOString().slice(0, 16)

const loading = ref(false)
const loadingPost = ref(true)
const errorMsg = ref('')
const courts = ref([])
const showSuggestions = ref(false)

const form = ref({
    court_name: '',
    play_time: '',
    end_time: '',
    skill_level: '',
    target_players: null,
    description: ''
})

// แปลง datetime สำหรับ input type="datetime-local"
const toLocalDatetime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
}

onMounted(async () => {
    try {
        const [postRes, courtRes] = await Promise.all([
            PostsService.show(route.params.id),
            CourtsService.index()
        ])
        courts.value = courtRes.data

        const post = postRes.data

        form.value = {
            court_name: post.title || '',
            play_time: toLocalDatetime(post.date_time),
            end_time: post.end_time ? toLocalDatetime(post.end_time).slice(11, 16) : '',
            skill_level: post.skill_required || '',
            target_players: post.target_players,
            description: post.description || ''
        }
    } catch (e) {
        errorMsg.value = 'โหลดข้อมูลไม่สำเร็จ'
    } finally {
        loadingPost.value = false
    }
})

const filteredCourts = computed(() => {
    if (!form.value.court_name) return courts.value
    return courts.value.filter(c =>
        c.name.toLowerCase().includes(form.value.court_name.toLowerCase())
    )
})

const onCourtInput = () => { showSuggestions.value = true }
const selectCourt = (court) => {
    form.value.court_name = court.name
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
        const dateOnly = form.value.play_time ? form.value.play_time.split('T')[0] : null
        const combinedEndTime = dateOnly && form.value.end_time ? `${dateOnly}T${form.value.end_time}` : null

        const payload = {
            id: route.params.id,
            title: form.value.court_name,
            description: form.value.description,
            date_time: form.value.play_time,
            end_time: combinedEndTime,
            target_players: form.value.target_players,
            skill_required: form.value.skill_level,
            status: 'open'
        }
        await PostsService.put(payload)
        router.push({ name: 'posts' })
    } catch (error) {
        errorMsg.value = 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>