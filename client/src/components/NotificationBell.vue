<template>
    <div class="relative" ref="bellRef">
        <!-- Bell styled as a nav-item row (same as other sidebar links) -->
        <button @click="toggleDropdown" id="notification-bell-btn" class="nav-item w-full text-left"
            :class="isOpen ? 'active-nav' : ''">
            <!-- Bell icon with unread badge -->
            <div class="relative shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="unreadCount > 0"
                    class="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
            </div>
            <span>แจ้งเตือน</span>
        </button>

        <!-- Dropdown -->
        <transition name="dropdown">
            <div v-if="isOpen" id="notification-dropdown"
                class="absolute left-full top-0 ml-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">

                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-slate-800 text-sm">การแจ้งเตือน</span>
                        <span v-if="unreadCount > 0"
                            class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {{ unreadCount }} ใหม่
                        </span>
                    </div>
                    <button v-if="unreadCount > 0" @click="markAllRead"
                        class="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                        อ่านทั้งหมด
                    </button>
                </div>

                <!-- Notification list -->
                <div class="max-h-96 overflow-y-auto">
                    <!-- Loading -->
                    <div v-if="loading" class="flex items-center justify-center py-10">
                        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin">
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="notifications.length === 0"
                        class="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-300" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p class="text-slate-500 text-sm font-medium">ไม่มีการแจ้งเตือน</p>
                        <p class="text-slate-400 text-xs mt-0.5">เมื่อมีคนเข้าร่วมก๊วนคุณ จะแจ้งที่นี่</p>
                    </div>

                    <!-- Notification items -->
                    <div v-else>
                        <div v-for="notif in notifications" :key="notif.id"
                            class="group flex items-start gap-3 px-4 py-3 border-b border-slate-50 transition-colors hover:bg-slate-50/60"
                            :class="{ 'bg-emerald-50/40': !notif.is_read }">
                            <!-- Icon by type -->
                            <div class="shrink-0 mt-0.5">
                                <div v-if="notif.type === 'join'"
                                    class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div v-else-if="notif.type === 'full'"
                                    class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <div v-else class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                    </svg>
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                                <p class="text-xs text-slate-700 leading-relaxed"
                                    :class="{ 'font-semibold': !notif.is_read }">
                                    {{ notif.message }}
                                </p>
                                <p class="text-[10px] text-slate-400 mt-1">{{ formatTime(notif.createdAt) }}</p>
                            </div>

                            <!-- Unread dot + delete btn -->
                            <div class="flex flex-col items-end gap-1.5 shrink-0">
                                <div v-if="!notif.is_read" class="w-2 h-2 bg-emerald-500 rounded-full mt-1"></div>
                                <button @click.stop="deleteNotif(notif.id)"
                                    class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="notifications.length > 0" class="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                    <p class="text-[10px] text-slate-400 text-center">แสดง {{ notifications.length }} รายการล่าสุด</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NotificationsService from '../services/NotificationsService'

const isOpen = ref(false)
const loading = ref(false)
const notifications = ref([])
const bellRef = ref(null)

let pollInterval = null

const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)

const toggleDropdown = async () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        await fetchNotifications()
    }
}

const fetchNotifications = async () => {
    loading.value = true
    try {
        const res = await NotificationsService.getAll()
        notifications.value = res.data
    } catch (err) {
        console.error('ดึงการแจ้งเตือนไม่สำเร็จ:', err)
    } finally {
        loading.value = false
    }
}

const markAllRead = async () => {
    try {
        await NotificationsService.markAllRead()
        notifications.value = notifications.value.map(n => ({ ...n, is_read: true }))
    } catch (err) {
        console.error('mark as read ไม่สำเร็จ:', err)
    }
}

const deleteNotif = async (id) => {
    try {
        await NotificationsService.deleteOne(id)
        notifications.value = notifications.value.filter(n => n.id !== id)
    } catch (err) {
        console.error('ลบการแจ้งเตือนไม่สำเร็จ:', err)
    }
}

const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'เมื่อสักครู่'
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
    if (bellRef.value && !bellRef.value.contains(e.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    fetchNotifications()
    // Poll every 30 seconds for new notifications
    pollInterval = setInterval(fetchNotifications, 30000)
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    clearInterval(pollInterval)
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateX(-6px) scale(0.97);
}
</style>
