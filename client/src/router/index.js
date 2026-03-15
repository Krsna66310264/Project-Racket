import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenStore } from '../stores/authen'

import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

import PostIndex from '../components/Posts/Index.vue'
import PostCreate from '../components/Posts/Create.vue'
import PostEdit from '../components/Posts/Edit.vue'
import PostShow from '../components/Posts/Show.vue'

import CourtIndex from '../components/Courts/Index.vue'

import UserProfile from '../components/Users/Profile.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },
        { path: '/posts', name: 'posts', component: PostIndex },
        { path: '/posts/create', name: 'posts.create', component: PostCreate, meta: { requiresAuth: true } },
        { path: '/posts/:id', name: 'posts.show', component: PostShow },
        { path: '/posts/:id/edit', name: 'posts.edit', component: PostEdit, meta: { requiresAuth: true } },
        { path: '/courts', name: 'courts', component: CourtIndex, meta: { requiresAuth: true } },
        { path: '/profile', name: 'profile', component: UserProfile, meta: { requiresAuth: true } },
        { path: '/', redirect: '/posts' }
    ]
})

router.beforeEach((to) => {
    const authenStore = useAuthenStore()
    if (to.meta.requiresAuth && !authenStore.isUserLoggedIn) {
        return '/login'
    }
    if ((to.name === 'login' || to.name === 'register') && authenStore.isUserLoggedIn) {
        return '/posts'
    }
    if (to.name === 'courts' && authenStore.user?.role !== 'admin') {
        return '/posts'
    }
})

export default router