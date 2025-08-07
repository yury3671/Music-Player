<script setup>
import { ref, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { songsGet, historySongs } from '@/api/music'
import { debounce } from 'lodash'
import { useAudioStore } from '@/stores'

const audioStore = useAudioStore()
defineOptions({
  name: 'Collection', // 必须设置
})
const info = ref([])
const route = useRoute()
const router = useRouter()
const page = ref(1)
let lastId = route.params.id
const scrollPos = ref(0)
const total = ref(0)
const getAll = async () => {
  if (route.params.id !== '0') {
    const res = await songsGet(route.params.id, page.value)
    total.value = res.data.data.count
    console.log(res)
    info.value.push(...res.data.data.songs)
  } else {
    const res = await historySongs(page.value)
    console.log(res)

    info.value.push(...res.data.data.songs.map((item) => item.info))
  }

  page.value += 1
}
getAll()
// 恢复滚动位置
const containerRef = ref(null)
onActivated(() => {
  if (route.params.id !== lastId) {
    total.value = 0
    lastId = route.params.id
    scrollPos.value = 0
    page.value = 1
    info.value = []
    getAll()
  } else {
    if (containerRef.value) {
      containerRef.value.scrollTop = scrollPos.value
    }
  }
  audioStore.setPos(0)
})

//懒加载
const handleScroll = debounce(async (event) => {
  scrollPos.value = event.target.scrollTop
  const bottomReached =
    event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight
  if (bottomReached) {
    await getAll()
  }
}, 200)
//设置播放列表
const setList = (num) => {
  const newList = info.value
    .filter((item) => item.hash && item.mixsongid)
    .map((item) => ({ hash: item.hash, mixsongid: item.mixsongid }))
  audioStore.setList(newList, num)
}
</script>

<template>
  <div class="container box" @scroll="handleScroll" ref="containerRef">
    <van-nav-bar
      :title="route.params.id !== '0' ? '我的收藏' : '最近播放'"
      left-arrow
      fixed="true"
      @click-left="router.back()"
      @click-right="router.push('/search')"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="bar">
      <van-icon name="play-circle" size="25" color="skyblue" @click="setList(1)" />
      <span>全部播放 {{ total ? `(${total})` : '' }}</span>
    </div>
    <div @click="setList(0)">
      <one-song
        v-for="(item, index) in info"
        :key="index"
        :songInfo="item"
        :flag="route.params.id !== '0' ? 2 : 1"
        v-show="item.name"
      ></one-song>
    </div>
  </div>
</template>

<style scoped>
.bar {
  background-color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
}
.box {
  margin-top: 46px;
  padding-bottom: 50px;
}
</style>
