<template>
    <div>
        <!-- Hamburger (mobile) -->
        <button @click="isOpen = !isOpen"
            class="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-600 shadow-sm">
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- Overlay (mobile) -->
        <div v-if="isOpen" @click="isOpen = false" class="md:hidden fixed inset-0 bg-black/20 z-30" />

        <!-- Sidebar -->
        <aside :class="[
            'w-56 bg-white border-r border-slate-100 flex flex-col justify-between h-screen z-40',
            'fixed md:sticky top-0 transition-transform duration-200',
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]">

            <div>

                <!-- Nav -->
                <nav class="px-3 py-4 space-y-0.5">
                    <router-link :to="{ name: 'posts' }"
                        :class="['nav-item', route.name === 'posts' && !route.query.filter ? 'active-nav' : '']"
                        @click="isOpen = false">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>โพสต์ทั้งหมด</span>
                    </router-link>

                    <router-link v-if="authenStore.isUserLoggedIn" :to="{ name: 'posts', query: { filter: 'mine' } }"
                        :class="['nav-item', route.query.filter === 'mine' ? 'active-nav' : '']"
                        @click="isOpen = false">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>โพสต์ของฉัน</span>
                    </router-link>

                    <router-link v-if="isAdmin" :to="{ name: 'courts' }"
                        :class="['nav-item', route.name === 'courts' ? 'active-nav' : '']" @click="isOpen = false">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>สนามแบดมินตัน</span>
                    </router-link>

                    <router-link v-if="authenStore.isUserLoggedIn" :to="{ name: 'profile' }"
                        :class="['nav-item', route.name === 'profile' ? 'active-nav' : '']" @click="isOpen = false">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>โปรไฟล์</span>
                    </router-link>

                    <!-- Notification Bell — อยู่ระดับเดียวกับเมนูอื่น -->
                    <NotificationBell v-if="authenStore.isUserLoggedIn" />
                </nav>
            </div>

            <!-- Logout -->
            <!-- Logged-in: user info + logout -->
            <div v-if="authenStore.isUserLoggedIn" class="px-3 py-4 border-t border-slate-100">
                <div class="px-3 py-2 mb-3">
                    <p class="text-xs font-medium text-slate-800 truncate">{{ authenStore.user?.name }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ authenStore.user?.email }}</p>
                </div>
                <button @click="logout"
                    class="flex items-center gap-2 text-slate-500 hover:text-red-500 w-full px-3 py-2.5 rounded-lg transition-colors text-sm hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>ออกจากระบบ</span>
                </button>
            </div>


        </aside>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NotificationBell from './NotificationBell.vue'
import { useAuthenStore } from '../stores/authen'

const router = useRouter()
const route = useRoute()
const authenStore = useAuthenStore()
const isOpen = ref(false)

const isAdmin = computed(() => authenStore.user?.role === 'admin')

const logout = () => {
    authenStore.logout()
    router.push({ name: 'login' })
}
</script>
