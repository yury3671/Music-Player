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
const total = ref(0)
const getInfo = async () => {
  const res = await search(route.params.keywords, page.value)
  console.log(res)
  total.value = res.data.data.total
  info.value.push(...res.data.data.lists)
  page.value += 1
}
getInfo()
//懒加载
const handleScroll = debounce(async (event) => {
  const bottomReached =
    event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight
  if (bottomReached && info.value.length < total.value) {
    await getInfo()
  }
}, 200)
</script>

<template>
  <div class="box">
    <search-bar
      @hide="isHide = false"
      @show="isHide = true"
      :content="route.params.keywords"
    ></search-bar>
    <div class="content" v-show="isHide">
      <virtual-list1 :list="info" :itemHeight="60" :buffer="2" @scroll="handleScroll">
        <template #default="{ items }">
          <one-song
            v-for="item in items"
            :key="item.FileHash"
            :songInfo="item"
            :flag="2"
          ></one-song>
        </template>
      </virtual-list1>
    </div>
  </div>
</template>

<style scoped>
.box {
  background-color: rgb(227, 238, 243);
  padding-bottom: 50px;
}
.content {
  margin-top: 54px;
}
.item {
  height: 60px;
  line-height: 60px;
  text-align: center;
  border: 1px solid #000;
}
</style>
