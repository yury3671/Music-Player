<script setup>
import { ref, watch } from 'vue'

import { useAudioStore } from '@/stores'
import { onMounted } from 'vue'
import { songUrl } from '@/api/music'
import emitter from '@/utils/eventBus'
const musicRef = ref(null)
const listRef = ref(null)
emitter.on('showMusic', () => {
  musicRef.value.open()
})
emitter.on('showList', () => {
  listRef.value.open()
})
const audioStore = useAudioStore()
const audioRef = ref(null)
const url = ref('')

onMounted(async () => {
  audioStore.setAudioRef(audioRef.value)
  if (audioStore.hash) {
    const res = await songUrl(audioStore.hash)
    url.value = res.data.url[0]
  }
})
watch(
  () => audioStore.hash,
  async () => {
    if (audioStore.hash) {
      const res = await songUrl(audioStore.hash)

      url.value = res.data.url[0]
    } else {
      url.value = ''
    }
  },
)
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['Collection']">
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <audio
    :src="url"
    autoplay
    ref="audioRef"
    @timeupdate="audioStore.updateSlider"
    @loadedmetadata="audioStore.setDuration"
    @play="audioStore.setIsPlaying(true)"
    @pause="audioStore.setIsPlaying(false)"
    @ended="audioStore.handleAudioEnd"
  ></audio>
  <show-player></show-player>
  <music-play ref="musicRef"></music-play>
  <my-list ref="listRef"></my-list>
</template>

<style scoped></style>
