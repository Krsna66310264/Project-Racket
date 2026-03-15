<template>
    <div id="app" class="flex min-h-screen bg-slate-50 font-sans">

        <app-sidebar v-if="!isLoginPage" />

        <main class="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full pt-16 md:pt-10">
            <router-view />
        </main>

    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/Sidebar.vue'

const route = useRoute()

const isLoginPage = computed(() => {
    return route.name === 'login' || route.name === 'register'
})
</script>