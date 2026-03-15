<template>
    <div class="max-w-3xl">
        <!-- Header -->
        <div class="mb-6">
            <router-link :to="{ name: 'posts' }"
                class="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-600 text-sm font-medium mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clip-rule="evenodd" />
                </svg>
                กลับไป
            </router-link>
        </div>

        <!-- Main Card -->
        <div class="card p-8">
            <!-- Title Section -->
            <div class="mb-8">
                <div class="flex items-center gap-3 mb-3">
                    <div
                        class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="12" cy="5" r="3" />
                            <path d="M12 8 L8 20" />
                            <path d="M12 8 L16 20" />
                            <path d="M12 8 L12 20" />
                            <path d="M7 17 Q12 15 17 17" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="page-title">
                            {{ post.title || 'ไม่ระบุสนาม' }}
                        </h1>
                        <p class="page-subtitle mt-0.5">
                            โดย {{ post.owner?.name || 'ผู้เล่น' }}
                            <span v-if="isAdmin && post.owner_email" class="text-xs text-slate-400 ml-1">({{
                                post.owner_email }})</span>
                            <span v-if="post.owner" class="ml-2 font-medium"
                                :class="post.owner.gender === 'ชาย' ? 'text-blue-400' : post.owner.gender === 'หญิง' ? 'text-pink-400' : 'text-slate-400'">
                                {{ post.owner.gender === 'ชาย' ? 'ชาย' : post.owner.gender === 'หญิง' ? 'หญิง' :
                                    'ไม่ระบุ' }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 pb-8 border-b border-slate-200">
                <div class="bg-slate-50 rounded-lg p-4">
                    <p class="text-xs text-slate-500 font-medium mb-1">เวลาเล่น</p>
                    <p class="text-base font-semibold text-slate-800">{{ formatDate(post.date_time) }}</p>
                </div>
                <div class="bg-slate-50 rounded-lg p-4">
                    <p class="text-xs text-slate-500 font-medium mb-1">ระดับทักษะ</p>
                    <p class="text-base font-semibold text-slate-800">{{ post.skill_required || 'ทุกระดับ' }}</p>
                </div>
                <div class="bg-slate-50 rounded-lg p-4">
                    <p class="text-xs text-slate-500 font-medium mb-1">สถานะ</p>
                    <p v-if="((post.current_players || 0) >= post.target_players)"
                        class="text-base font-semibold text-red-500">เต็มแล้ว</p>
                    <p v-else class="text-base font-semibold text-emerald-500">รับสมัครอยู่</p>
                </div>
                <div v-if="post.owner" class="bg-slate-50 rounded-lg p-4">
                    <p class="text-xs text-slate-500 font-medium mb-1">เพศเจ้าของ</p>
                    <p class="text-base font-semibold"
                        :class="post.owner.gender === 'ชาย' ? 'text-blue-500' : post.owner.gender === 'หญิง' ? 'text-pink-500' : 'text-slate-400'">
                        {{ post.owner.gender === 'ชาย' ? 'ชาย' : post.owner.gender === 'หญิง' ? 'หญิง' : 'ไม่ระบุ' }}
                    </p>
                </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-slate-800 mb-3">รายละเอียด</h2>
                <p class="text-slate-600 leading-relaxed whitespace-pre-line">
                    {{ post.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
                </p>
            </div>

            <!-- Players Section -->
            <div class="mb-8 pb-8 border-b border-slate-200">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold text-slate-800">ผู้เล่น</h2>
                    <span class="text-sm font-medium">
                        <span class="text-slate-600">{{ post.current_players || 0 }}/{{ post.target_players }}</span>
                        <span v-if="((post.current_players || 0) >= post.target_players)"
                            class="text-red-500 ml-2">เต็ม</span>
                        <span v-else class="text-emerald-500 ml-2">ขาด {{ post.target_players - (post.current_players ||
                            0) }} คน</span>
                    </span>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-6">
                    <div class="h-3 rounded-full transition-all duration-500"
                        :class="((post.current_players || 0) >= post.target_players) ? 'bg-red-400' : 'bg-emerald-500'"
                        :style="{ width: `${Math.min(100, ((post.current_players || 0) / (post.target_players || 1)) * 100)}%` }">
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
                <!-- Guest: ยังไม่ได้ล็อกอิน -->
                <template v-if="!authenStore.isUserLoggedIn">
                    <div class="flex flex-col flex-1 gap-2">
                        <div
                            class="bg-emerald-50 border border-emerald-200 text-emerald-600 font-medium py-3 rounded-lg text-center w-full text-sm">
                            เข้าสู่ระบบเพื่อเข้าร่วมเล่น
                        </div>
                        <div class="flex gap-2">
                            <button @click="$router.push({ name: 'login' })"
                                class="btn btn-primary flex-1 py-2.5 text-sm">
                                เข้าสู่ระบบ
                            </button>
                            <button @click="$router.push({ name: 'register' })"
                                class="btn btn-outline-secondary flex-1 py-2.5 text-sm">
                                สมัครสมาชิก
                            </button>
                        </div>
                    </div>
                </template>

                <!-- เจ้าของ: แสดงปุ่มแก้ไข/ลบ -->
                <template v-else-if="isOwner">
                    <button @click="$router.push({ name: 'posts.edit', params: { id: post.id } })"
                        class="btn btn-primary flex-1">
                        แก้ไขโพสต์
                    </button>
                    <button @click="handleDelete" class="btn btn-outline-danger flex-1">
                        ลบโพสต์
                    </button>
                </template>

                <!-- ไม่ใช่เจ้าของ: แสดงปุ่มเข้าร่วม -->
                <template v-else>
                    <!-- เข้าร่วมแล้ว -->
                    <div v-if="hasJoined" class="flex flex-col flex-1 gap-2">
                        <div
                            class="bg-green-50 border border-green-200 text-green-600 font-medium py-3 rounded-lg text-center w-full">
                            คุณเข้าร่วมแล้ว
                        </div>
                        <button @click="handleLeave" :disabled="leaving"
                            class="bg-white border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2 rounded-lg transition-colors disabled:opacity-60 text-sm">
                            <span v-if="leaving" class="flex items-center justify-center gap-2">
                                <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                กำลังยกเลิก...
                            </span>
                            <span v-else>ยกเลิกการเข้าร่วม</span>
                        </button>
                    </div>
                    <!-- เต็มแล้ว -->
                    <button v-else-if="((post.current_players || 0) >= post.target_players)" disabled
                        class="flex-1 bg-slate-100 text-slate-400 font-medium py-3 rounded-lg cursor-not-allowed">
                        ปิดรับแล้ว
                    </button>
                    <!-- สามารถเข้าร่วมได้ -->
                    <button v-else @click="handleJoin" :disabled="joining"
                        class="btn btn-primary flex-1 py-3 disabled:opacity-60">
                        <span v-if="joining" class="flex items-center justify-center gap-2">
                            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            กำลังเข้าร่วม...
                        </span>
                        <span v-else>เข้าร่วมเล่น</span>
                    </button>

                    <!-- Admin: ลบโพสต์ของคนอื่นได้ -->
                    <button v-if="isAdmin" @click="handleDelete" class="btn btn-outline-danger px-5">
                        ลบ
                    </button>
                </template>
            </div>

            <!-- Error Message -->
            <p v-if="actionError" class="text-red-500 text-sm text-center mt-3">{{ actionError }}</p>
        </div>

        <!-- ========= JOIN SUCCESS MODAL ========= -->
        <Transition name="fade-up">
            <div v-if="showJoinSteps" class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
                style="background: rgba(0,0,0,0.4);" @click.self="closeSteps">

                <div class="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                    <div class="text-center mb-8">

                        <h2 class="text-2xl font-bold text-slate-800">เข้าร่วมสำเร็จ!</h2>
                        <p class="text-slate-500 text-sm mt-1">ขั้นตอนการเตรียมตัวของคุณ</p>
                    </div>

                    <!-- Steps -->
                    <div class="space-y-4 mb-8">
                        <div v-for="(step, i) in joinSteps" :key="i"
                            class="flex items-start gap-4 p-4 rounded-xl transition-all duration-500"
                            :class="currentStep >= i ? 'bg-emerald-500/10' : 'bg-slate-50 opacity-40'">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
                                :class="currentStep >= i ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'">
                                <span v-if="currentStep > i">✓</span>
                                <span v-else>{{ i + 1 }}</span>
                            </div>
                            <div>
                                <p class="font-semibold text-slate-800 text-sm">{{ step.title }}</p>
                                <p class="text-slate-500 text-xs mt-0.5">{{ step.desc }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Venue Details (shown at step 2) -->
                    <div v-if="currentStep >= 1"
                        class="bg-slate-50 rounded-xl p-4 mb-6 text-sm text-slate-700 space-y-2">
                        <div>{{ post.title ? post.title.split('_DESC_')[0] : 'ไม่ระบุสนาม' }}</div>
                        <div>{{ formatDate(post.date_time) }}</div>
                        <div>{{ post.skill_required || 'ทุกระดับ' }}
                        </div>
                    </div>

                    <button @click="closeSteps" class="btn btn-primary w-full py-3">
                        {{ currentStep >= 2 ? 'พร้อมแล้ว! ปิด' : 'ถัดไป' }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthenStore } from '../../stores/authen'
import PostsService from '../../services/PostsService'

const route = useRoute()
const router = useRouter()
const authenStore = useAuthenStore()
const post = ref({})
const joining = ref(false)
const leaving = ref(false)
const actionError = ref('')
const showJoinSteps = ref(false)
const currentStep = ref(0)

const isOwner = computed(() => post.value.user_id === authenStore.user?.id)
const isAdmin = computed(() => authenStore.user?.role === 'admin')

const hasJoined = computed(() => {
    if (!post.value.joined_user_ids || !authenStore.user) return false
    try {
        const joinedIds = JSON.parse(post.value.joined_user_ids)
        return joinedIds.includes(authenStore.user.id)
    } catch {
        return false
    }
})

const joinSteps = [
    { title: 'ยืนยันการเข้าร่วม', desc: 'ระบบบันทึกชื่อของคุณในก๊วนแล้ว' },
    { title: 'ดูรายละเอียด', desc: 'เช็คสนาม เวลา และระดับทักษะที่ต้องการ' },
    { title: 'พร้อมลงสนาม!', desc: 'เจอกันวันนัดตีนะ อย่าลืมนำไม้แบดมาเอง' }
]

const formatDate = (dateTime) => {
    if (!dateTime) return 'ไม่ระบุเวลา'
    const date = new Date(dateTime)
    return date.toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const fetchPost = async () => {
    try {
        const response = await PostsService.show(route.params.id)
        post.value = response.data
    } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลโพสต์ได้:', error)
    }
}

const handleJoin = async () => {
    if (!confirm('ยืนยันที่จะเข้าร่วมโพสต์นี้หรือไม่?')) return

    joining.value = true
    actionError.value = ''
    try {
        const res = await PostsService.join(route.params.id)
        post.value = res.data
        showJoinSteps.value = true
        currentStep.value = 0
        // เลื่อน step อัตโนมัติ
        setTimeout(() => { currentStep.value = 1 }, 800)
        setTimeout(() => { currentStep.value = 2 }, 1800)
    } catch (err) {
        actionError.value = err.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
    } finally {
        joining.value = false
    }
}

const handleLeave = async () => {
    if (!confirm('ยืนยันที่จะยกเลิกการเข้าร่วมโพสต์นี้หรือไม่? (ระบบจะส่งอีเมลแจ้งเตือนเจ้าของก๊วน)')) return

    leaving.value = true
    actionError.value = ''
    try {
        const res = await PostsService.leave(route.params.id)
        post.value = res.data
    } catch (err) {
        actionError.value = err.response?.data?.error || 'เกิดข้อผิดพลาดในการยกเลิก'
    } finally {
        leaving.value = false
    }
}

const closeSteps = () => {
    showJoinSteps.value = false
}

const handleDelete = async () => {
    if (!confirm('ยืนยันลบโพสต์นี้?')) return
    try {
        await PostsService.delete(post.value)
        router.push({ name: 'posts' })
    } catch {
        alert('ลบไม่สำเร็จ')
    }
}

onMounted(() => {
    fetchPost()
})
</script>
