<script setup>
import { useAudioStore } from '@/stores'
import { useRouter } from 'vue-router'
const router = useRouter()

const audioStore = useAudioStore()
audioStore.setPos(50)
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['Home']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <van-tabbar route>
    <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item replace @click="router.push('/search')" icon="search">搜索</van-tabbar-item>
    <van-tabbar-item replace to="/me" icon="contact-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped></style>
