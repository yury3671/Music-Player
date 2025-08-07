<script setup>
import { ref, computed } from 'vue'

import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()
const props = defineProps({
  line: Object,
})

//检查字是否激活
const progress = ref(0)
const isWordActive = (wordIndex) => {
  // const line = parsedLyrics.value[lineIndex]
  // console.log(line)
  const word = props.line.words[wordIndex]
  const currentMs = audioStore.currentTime * 1000
  return currentMs > word.end && currentMs < props.line.end
}
const isWordActiving = (wordIndex) => {
  // const line = parsedLyrics.value[lineIndex]
  // console.log(line)
  const word = props.line.words[wordIndex]
  const currentMs = audioStore.currentTime * 1000
  //逐字卡拉OK样式
  const isProgress = (currentMs - word.start) / word.duration
  if (isProgress <= 1 && isProgress > 0) {
    progress.value = isProgress * 100
    // console.log(progress.value)
  }

  return currentMs >= word.start && currentMs < word.end
}
</script>

<template>
  <span
    v-for="(word, wordIndex) in props.line.words"
    :class="{
      activing: isWordActiving(wordIndex),
      active: isWordActive(wordIndex),
    }"
    :key="wordIndex"
    :style="{
      '--progress': `${progress}%`,
    }"
    >{{ word.word }}</span
  >
</template>

<style scoped>
.active {
  color: skyblue;
}
.activing {
  /* color: skyblue; */
  transition: color 0.1s;
  background: linear-gradient(to right, skyblue var(--progress), black);
  -webkit-background-clip: text; /* Safari/Chrome 兼容性 */
  background-clip: text; /* 标准语法 */
  color: transparent; /* 关键：使文本颜色透明，显示背景渐变 */
}
</style>
