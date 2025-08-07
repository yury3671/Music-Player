import { createApp } from 'vue'

import pinia from '@/stores/index'

import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import VueTouch from 'vue-touch'
import Vue3Marquee from 'vue3-marquee'
// 全局引入
import AudioPlayer from '@liripeng/vue-audio-player'

const app = createApp(App)
app.component('AudioPlayer', AudioPlayer)
app.use(VueTouch, { name: 'v-touch' })
app.use(Vue3Marquee)
app.use(router)
app.use(pinia)
app.mount('#app')
