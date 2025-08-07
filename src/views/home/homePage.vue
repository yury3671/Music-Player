<script setup>
import { ref, onActivated } from 'vue'
const scrollPos = ref(0)
defineOptions({
  name: 'Home', // 必须设置
})
onActivated(() => {
  if (containerRef.value) {
    containerRef.value.scrollTop = scrollPos.value
  }
})
const containerRef = ref(null)

const handleScroll = (event) => {
  scrollPos.value = event.target.scrollTop
}
</script>

<template>
  <div class="container box" @scroll="handleScroll" ref="containerRef">
    <recommend-page></recommend-page>
  </div>
</template>

<style scoped>
.box {
  background-image: linear-gradient(skyblue 0px, rgb(239, 248, 252) 40%);
  padding-bottom: 100px;
  min-height: 567px;
}
</style>
