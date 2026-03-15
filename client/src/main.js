import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // ปลั๊กอินกัน Login หลุด 
import App from './App.vue'
import router from './router/index'
import './style.css' // เรียกใช้ Tailwind CSS

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate) // ให้น้องสับปะรดรู้จักปลั๊กอิน 

app.use(pinia)   // ใช้ Store 
app.use(router)  // ใช้ Router 

app.mount('#app')