<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchComplex, search, searchLyric } from '@/api/search'
import { debounce } from 'lodash'
import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()
audioStore.setPos(0)
const route = useRoute()

const isHide = ref(true)
const info = ref([])
const page = ref(1)
const getInfo = async () => {
  const res = await search(route.params.keywords, page.value)
  console.log(res)
  info.value.push(...res.data.data.lists)
  page.value += 1
}
getInfo()
//懒加载
const handleScroll = debounce(async (event) => {
  const bottomReached =
    event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight
  if (bottomReached) {
    await getInfo()
  }
}, 200)
</script>

<template>
  <div class="container box" @scroll="handleScroll">
    <search-bar
      @hide="isHide = false"
      @show="isHide = true"
      :content="route.params.keywords"
    ></search-bar>
    <div class="content" v-show="isHide">
      <one-song
        v-for="(item, index) in info"
        :key="index"
        :songInfo="item"
        :flag="2"
        v-show="item.OriSongName"
      ></one-song>
    </div>
  </div>
</template>

<style scoped>
.box {
  background-color: rgb(227, 238, 243);
  padding-bottom: 50px;
}
.content {
  margin-top: 60px;
  height: 500px;
}
</style>
