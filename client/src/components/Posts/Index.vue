<template>
    <div class="max-w-5xl">

        <div class="flex justify-between items-center mb-10">
            <div>
                <h1 class="page-title flex items-center gap-3">
                    <img src="../../assets/logo.png" alt="Racket Logo" class="w-9 h-9 object-contain" />
                    สวัสดี, {{ authenStore.user?.name || 'นักกีฬา' }}
                </h1>
                <p class="page-subtitle">พร้อมที่จะลงสนามวันนี้หรือยัง?</p>
            </div>

            <div v-if="authenStore.isUserLoggedIn" class="flex items-center gap-3">
                <button @click="$router.push({ name: 'posts.create' })"
                    class="btn btn-primary px-6 shadow-sm hover:shadow-md">
                    สร้างโพสต์
                </button>
            </div>
            <div v-else class="flex items-center gap-2">
                <button @click="$router.push({ name: 'login' })"
                    class="btn btn-primary px-5 shadow-sm hover:shadow-md text-sm">
                    เข้าสู่ระบบ
                </button>
                <button @click="$router.push({ name: 'register' })" class="btn btn-outline-secondary px-5 text-sm">
                    สมัครสมาชิก
                </button>
            </div>
        </div>

        <!-- ===== Filter Bar ===== -->
        <div class="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
            <div class="flex flex-wrap gap-3 items-end">

                <!-- เรียงตาม -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-slate-500">เรียงตาม</label>
                    <select v-model="activeSort"
                        class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 bg-white min-w-[130px]">
                        <option value="latest">ล่าสุด</option>
                        <option value="today">สุดวันนี้</option>
                        <option value="popular">ยอดนิยม</option>
                        <option value="needing">ขาดคนมากสุด</option>
                    </select>
                </div>

                <!-- สถานะ -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-slate-500">สถานะ</label>
                    <select v-model="activeStatus"
                        class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 bg-white min-w-[110px]">
                        <option value="all">ทั้งหมด</option>
                        <option value="open">ว่างอยู่</option>
                        <option value="full">เต็มแล้ว</option>
                    </select>
                </div>

                <!-- ระดับทักษะ -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-slate-500">ระดับทักษะ</label>
                    <select v-model="activeSkill"
                        class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 bg-white min-w-[110px]">
                        <option value="all">ทุกระดับ</option>
                        <option value="มือใหม่">มือใหม่</option>
                        <option value="กลาง">กลาง</option>
                        <option value="สูง">สูง</option>
                    </select>
                </div>

                <!-- เพศ -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-slate-500">เพศ</label>
                    <select v-model="activeGender"
                        class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 bg-white min-w-[100px]">
                        <option value="all">ทุกเพศ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        <option value="none">ไม่ระบุ</option>
                    </select>
                </div>

                <!-- reset -->
                <button
                    v-if="activeStatus !== 'all' || activeSkill !== 'all' || activeGender !== 'all' || activeSort !== 'latest'"
                    @click="resetFilters" class="mb-0.5 text-xs text-slate-400 hover:text-red-400 transition-colors">
                    ล้างตัวกรอง
                </button>
            </div>

            <!-- ผลลัพธ์ -->
            <p class="text-xs text-slate-400 mt-3">
                แสดง <span class="font-semibold text-slate-600">{{ displayedPosts.length }}</span> รายการ
                <span v-if="authenStore.isUserLoggedIn && route.query.filter === 'mine'"> · เฉพาะโพสต์ของคุณ</span>
            </p>
        </div>

        <div v-if="displayedPosts.length === 0" class="text-center py-16 card">
            <h3 class="text-lg font-semibold text-slate-700">
                ไม่พบโพสต์ที่ตรงกับตัวกรอง
            </h3>
            <p class="text-slate-500 mt-1 text-sm">ลองเปลี่ยนตัวกรองหรือสร้างโพสต์ใหม่</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">

            <router-link v-for="post in displayedPosts" :key="post.id"
                :to="{ name: 'posts.show', params: { id: post.id } }" class="card-interactive"
                :class="((post.current_players || 0) >= post.target_players) ? 'opacity-60' : ''">

                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-base text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="font-semibold text-slate-800 text-base leading-tight">
                                {{ post.title || 'ไม่ระบุสนาม' }}
                            </h2>
                            <p class="text-xs text-slate-500 mt-0.5">
                                โดย {{ post.owner?.name || 'ผู้เล่น' }}
                                <span v-if="isAdmin && post.owner_email" class="text-[10px] text-slate-400 ml-1">({{
                                    post.owner_email }})</span>
                                <span v-if="post.owner" class="ml-1 font-medium"
                                    :class="post.owner.gender === 'ชาย' ? 'text-blue-400' : post.owner.gender === 'หญิง' ? 'text-pink-400' : 'text-slate-400'">
                                    · {{ post.owner.gender === 'ชาย' ? 'ชาย' : post.owner.gender === 'หญิง' ? 'หญิง' :
                                        'ไม่ระบุเพศ' }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <span v-if="(post.current_players || 0) >= post.target_players"
                        class="bg-red-100 text-red-500 text-[10px] font-semibold px-2 py-1 rounded-md">เต็มแล้ว</span>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    <div
                        class="bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                        {{ formatDate(post.date_time) }}
                        <span v-if="post.end_time"> – {{ formatTime(post.end_time) }}</span>
                    </div>
                    <div
                        class="bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                        {{ post.skill_required || 'ทุกระดับ' }}
                    </div>
                    <div v-if="getCourtLocation(post)"
                        class="bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                        {{ getCourtLocation(post) }}
                    </div>
                </div>

                <p class="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {{ post.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
                </p>

                <div class="mb-4">
                    <div class="flex justify-between text-xs font-medium mb-2">
                        <span class="text-slate-600">ผู้เล่น ({{ post.current_players || 0 }}/{{ post.target_players
                            }})</span>
                        <span
                            :class="((post.current_players || 0) >= post.target_players) ? 'text-red-500' : 'text-emerald-500'">
                            {{ ((post.current_players || 0) >= post.target_players) ? 'เต็ม' : `ขาด
                            ${post.target_players - (post.current_players || 0)} คน` }}
                        </span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div class="h-2 rounded-full transition-all duration-500"
                            :class="((post.current_players || 0) >= post.target_players) ? 'bg-red-400' : 'bg-emerald-500'"
                            :style="{ width: `${Math.min(100, ((post.current_players || 0) / (post.target_players || 1)) * 100)}%` }">
                        </div>
                    </div>
                </div>

                <!-- ปุ่มดูรายละเอียด / สถานะ -->
                <div v-if="hasJoinedPost(post)"
                    class="w-full text-center text-xs font-medium py-2 rounded-lg bg-green-50 text-green-600 border border-green-200">
                    เข้าร่วมแล้ว · ดูรายละเอียด
                </div>
                <div v-else-if="((post.current_players || 0) >= post.target_players)"
                    class="w-full text-center text-xs font-medium py-2 rounded-lg bg-red-50 text-red-500">
                    เต็มแล้ว · ดูรายละเอียด
                </div>
                <div v-else
                    class="w-full text-center text-xs font-medium py-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    ดูรายละเอียดและเข้าร่วม
                </div>

                <!-- ปุ่มแก้ไข + ลบ เฉพาะเจ้าของโพสต์ -->
                <div v-if="post.user_id === authenStore.user?.id" class="flex gap-2 mt-2">
                    <button @click.prevent.stop="$router.push({ name: 'posts.edit', params: { id: post.id } })"
                        class="btn btn-outline-secondary flex-1">
                        แก้ไข
                    </button>
                    <button @click.prevent.stop="handleDelete(post)" class="btn btn-outline-danger flex-1">
                        ลบ
                    </button>
                </div>

                <!-- Admin: ลบโพสต์ของคนอื่นได้ -->
                <div v-else-if="isAdmin" class="mt-2">
                    <button @click.prevent.stop="handleDelete(post)" class="btn btn-outline-danger w-full mt-2">
                        ลบโพสต์นี้
                    </button>
                </div>

            </router-link>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthenStore } from '../../stores/authen'
import { useRouter, useRoute } from 'vue-router'
import PostsService from '../../services/PostsService'
import CourtsService from '../../services/CourtsService'

const authenStore = useAuthenStore()
const router = useRouter()
const route = useRoute()
const posts = ref([])
const courts = ref([])
const isAdmin = computed(() => authenStore.user?.role === 'admin')

// ===== Filters =====
const activeSort = ref('latest')
const activeStatus = ref('all')
const activeSkill = ref('all')
const activeGender = ref('all')

const resetFilters = () => {
    activeSort.value = 'latest'
    activeStatus.value = 'all'
    activeSkill.value = 'all'
    activeGender.value = 'all'
}

const filteredPosts = computed(() => {
    if (route.query.filter === 'mine') {
        return posts.value.filter(p => p.user_id === authenStore.user?.id)
    }
    return posts.value
})

const displayedPosts = computed(() => {
    let result = filteredPosts.value

    if (activeStatus.value === 'open') {
        result = result.filter(p => (p.current_players || 0) < p.target_players)
    } else if (activeStatus.value === 'full') {
        result = result.filter(p => (p.current_players || 0) >= p.target_players)
    }

    if (activeSkill.value !== 'all') {
        result = result.filter(p => p.skill_required === activeSkill.value)
    }

    if (activeGender.value === 'none') {
        result = result.filter(p => !p.owner?.gender)
    } else if (activeGender.value !== 'all') {
        result = result.filter(p => p.owner?.gender === activeGender.value)
    }

    // ===== Sort =====
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    if (activeSort.value === 'today') {
        result = result.filter(p => {
            const d = new Date(p.date_time)
            return d >= todayStart && d <= today
        })
    } else if (activeSort.value === 'popular') {
        result = [...result].sort((a, b) => (b.current_players || 0) - (a.current_players || 0))
    } else if (activeSort.value === 'needing') {
        result = [...result]
            .filter(p => (p.current_players || 0) < p.target_players)
            .sort((a, b) =>
                (b.target_players - (b.current_players || 0)) - (a.target_players - (a.current_players || 0))
            )
    } else {
        // latest: เรียงตาม id มากสุด (ใหม่สุด)
        result = [...result].sort((a, b) => b.id - a.id)
    }

    return result
})

const getCourtLocation = (post) => {
    const courtName = post.title ? post.title.split('_DESC_')[0] : ''
    const court = courts.value.find(c => c.name.toLowerCase() === courtName.toLowerCase())
    return court?.location || null
}

const hasJoinedPost = (post) => {
    if (!post.joined_user_ids || !authenStore.user) return false
    try {
        const joinedIds = JSON.parse(post.joined_user_ids)
        return joinedIds.includes(authenStore.user.id)
    } catch {
        return false
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุเวลา'
    const date = new Date(dateString)
    return date.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' น.'
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

const fetchPosts = async () => {
    try {
        const response = await PostsService.index()
        posts.value = response.data
    } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลโพสต์ได้:', error)
    }
}

const fetchCourts = async () => {
    try {
        const response = await CourtsService.index()
        courts.value = response.data
    } catch (error) {
        console.error('โหลดสนามไม่สำเร็จ:', error)
    }
}

const handleDelete = async (post) => {
    if (!confirm('ยืนยันลบโพสต์นี้?')) return
    try {
        await PostsService.delete(post)
        await fetchPosts()
    } catch (error) {
        alert('ลบไม่สำเร็จ')
    }
}

onMounted(() => {
    fetchPosts()
    fetchCourts()
})
</script>
