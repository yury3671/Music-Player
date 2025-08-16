<script setup>
import { ref, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { songsGet, historySongs } from '@/api/music'
import { debounce } from 'lodash'
import { useAudioStore } from '@/stores'

const audioStore = useAudioStore()
audioStore.setPos(0)

const info = ref([])
const route = useRoute()
const router = useRouter()
const page = ref(1)

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

//加载更多数据
const handleScroll = debounce(async (event) => {
  const bottomReached =
    event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight
  if (bottomReached) {
    if (route.params.id !== '0') {
      if (info.value.length < total.value) {
        await getAll()
      }
    } else {
      await getAll()
    }
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
  <div class="box">
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

    <virtual-list1
      :list="info"
      :itemHeight="60"
      :buffer="2"
      @scroll="handleScroll"
      @click="setList(0)"
    >
      <template #default="{ items }">
        <one-song
          v-for="item in items"
          :key="item.hash"
          :songInfo="item"
          :flag="route.params.id !== '0' ? 2 : 1"
        ></one-song>
      </template>
    </virtual-list1>
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
.item {
  height: 54px;
  line-height: 54px;
  text-align: center;
  border: 1px solid #000;
}
</style>
