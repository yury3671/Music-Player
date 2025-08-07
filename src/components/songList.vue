<script setup>
import { onMounted, ref } from 'vue'
import { songRecommend } from '@/api/recommend'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()

const router = useRouter()

const props = defineProps({ flag: Number })
const info = ref({
  song_list: [],
})
onMounted(async () => {
  const res = await songRecommend(props.flag)
  // console.log(res)
  info.value = res.data.data
  // console.log(info.value.song_list[1])
})
//设置播放列表
const setList = () => {
  const newList = info.value.song_list
    .filter((item) => item.hash && item.mixsongid)
    .map((item) => ({ hash: item.hash, mixsongid: item.mixsongid }))

  audioStore.setList(newList)
}
</script>

<template>
  <div class="list">
    <div class="head">{{ info.rec_desc }}</div>
    <div class="content" @click="setList">
      <van-swipe :loop="false" :width="350" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in 5" :key="index">
          <div v-for="num in [0, 1, 2]">
            <one-song
              v-if="info.song_list && info.song_list[index * 3 + num]"
              :key="num"
              :flag="1"
              :songInfo="info.song_list[index * 3 + num]"
            ></one-song>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style scoped>
.head {
  font-size: 15px;
  padding: 10px;
}
</style>
