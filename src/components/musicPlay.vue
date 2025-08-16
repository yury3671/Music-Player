<script setup>
import { ref } from 'vue'
const show = ref(false)
const isPage = ref(true)
const open = () => {
  show.value = true
}

defineExpose({ open })
</script>

<template>
  <van-popup v-model:show="show" position="bottom" class="pop" :overlay="false">
    <music-page v-if="isPage" @close="show = false" @toggle="isPage = !isPage"></music-page>
    <music-words v-else @close="show = false" @toggle="isPage = !isPage"></music-words>
  </van-popup>
</template>

<style scoped>
.pop {
  height: 667px;
  /* 使用CSS变量存储角度 */
  /* --angle: 200deg; */
  background-image: linear-gradient(white 70%, #dfc2eb 100%);
  /* transition: --angle 0.1s ease; /* 平滑过渡角度变化  */
  /* animation: bgmove 4s infinite ease-in-out;  */
}

@keyframes bgmove {
  0%,
  100% {
    --angle: 200deg;
  }
  30% {
    --angle: 180deg; /* 中间点使用0度（水平） */
  }
  60% {
    --angle: 160deg;
  }
}

/* 确保CSS变量动画能正常工作的兼容性处理 */
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
</style>
