<script setup>
import { ref, onMounted } from 'vue'
import { audioMv, videoDetail, videoUrl } from '@/api/music'
import { useAudioStore } from '@/stores'
import { useRouter } from 'vue-router'
const emit = defineEmits(['close', 'toggle'])

const router = useRouter()

const audioStore = useAudioStore()
const videoRef = ref(null)
const url = ref('')
let mixsongid = audioStore.mixsongid
const getInfo = async () => {
  audioStore.pausePlay()
  const res = await audioMv(mixsongid)
  const res1 = await videoDetail(res.data.data[0][0].video_id)
  // console.log(res1)
  const res2 = await videoUrl(res1.data.data[0].hd_hash_265)
  url.value = Object.values(res2.data.data)[0].downurl
}
getInfo()
const initInfo = () => {
  if (mixsongid !== audioStore.mixsongid) {
    mixsongid = audioStore.mixsongid
    getInfo()
  } else {
    audioStore.pausePlay()

    videoRef.value.play()
  }
}
defineExpose({ initInfo })
const close = () => {
  videoRef.value.pause()
  audioStore.startPlay()

  emit('close')
}
</script>

<template>
  <div class="box">
    <van-icon name="arrow-left" color="white" class="back" size="20" @click="close" />
    <video ref="videoRef" :src="url" autoplay controls loop class="video"></video>
  </div>
</template>

<style scoped>
.back {
  position: absolute;
  top: 20px;
  left: 15px;
  z-index: 10;
}
.box {
  background-color: black;
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.video {
  width: 100%;
}
</style>
