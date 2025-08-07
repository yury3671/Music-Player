<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dayRecommend, styleRecommend, newSong } from '@/api/recommend'

import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()
audioStore.setPos(0)
const info = ref([])
const route = useRoute()
const router = useRouter()
const cover = ref('')
const month = ref('')
const day = ref('')
//去掉图片url中的/{size}
const processCoverUrl = (url) => {
  return url.replace('/{size}', '')
}
const getAll = async () => {
  const date = new Date()
  month.value = (date.getMonth() + 1).toString().padStart(2, '0')
  if (+route.query.flag === 2) {
    const res = await dayRecommend()
    cover.value = res.data.data.cover_img_url
    // console.log(res)
    info.value = res.data.data.song_list
  } else if (+route.query.flag === 3) {
    const res = await styleRecommend()
    // console.log(res)
    info.value = res.data.data.song_list
    cover.value = processCoverUrl(res.data.data.song_list[0].sizable_cover)
  }
}
getAll()
const bacc = ref(0)
const handelScroll = (event) => {
  if (event.target.scrollTop >= 180) {
    bacc.value = 1
  } else {
    bacc.value = 0
  }
}
//设置播放列表
const setList = (num) => {
  const newList = info.value
    .filter((item) => item.hash && item.mixsongid)
    .map((item) => ({ hash: item.hash, mixsongid: item.mixsongid }))

  audioStore.setList(newList, num)
}
</script>

<template>
  <div class="container box" @scroll="handelScroll">
    <div class="nav" :style="{ backgroundColor: `rgba(255, 255, 255, ${bacc})` }">
      <van-icon name="arrow-left" :color="bacc === 0 ? 'white' : 'black'" @click="router.back()" />
      <div class="title" v-show="bacc" v-if="+route.query.flag === 2">每日推荐</div>
      <div class="title" v-show="bacc" v-if="+route.query.flag === 3">风格推荐</div>
    </div>
    <div class="cover" :style="{ backgroundImage: `url(${cover})` }">
      <div class="date" v-if="+route.query.flag === 2">
        <span class="day">{{ day }}</span>
        <span style="margin: 5px">/</span>
        <span>{{ month }}</span>
      </div>
    </div>
    <van-sticky :offset-top="51">
      <div class="bar">
        <van-icon name="play-circle" size="25" color="skyblue" @click="setList(1)" />
        <span>全部播放 30</span>
      </div>
    </van-sticky>

    <div class="songs" @click="setList(0)">
      <one-song
        v-for="(item, index) in info"
        :key="index"
        :songInfo="item"
        :flag="1"
        v-show="item.filename"
      ></one-song>
    </div>
  </div>
</template>

<style scoped>
.date {
  color: white;
  margin-top: 160px;
  margin-left: 20px;
}
.day {
  font-weight: 500;
  font-size: 30px;
}
.nav {
  position: fixed;
  top: 0;
  display: flex;
  gap: 130px;
  padding: 15px 10px;
  width: 100%;
  z-index: 100;
  transition: 0.1s linear all;
}
.title {
  font-weight: bold;
}
.cover {
  height: 230px;
  background-position: center;
  background-size: cover;
  box-shadow: 0px -20px 20px white inset;
  overflow: hidden;
}
.bar {
  background-color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
}
.songs {
  margin-top: 10px;
}
.box {
  padding-bottom: 50px;
}
</style>
