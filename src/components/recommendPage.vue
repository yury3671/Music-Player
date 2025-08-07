<script setup>
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'
const router = useRouter()
const greeting = ref('')
const getGreeting = () => {
  const time = new Date()
  const hours = time.getHours()
  if (hours >= 5 && hours < 12) {
    return '早上好'
  } else if (hours >= 12 && hours < 14) {
    return '中午好'
  } else if (hours >= 14 && hours < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
}
onMounted(() => {
  greeting.value = getGreeting()
})
</script>

<template>
  <div class="hi">{{ greeting }} •ᴗ•</div>
  <van-search placeholder="请输入搜索关键词" shape="round" @focus="router.push('/search')" />

  <div
    class="wrapper"
    v-touch:swipeleft="handleSwipeLeft"
    v-touch:swiperight="handleSwipeRight"
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
  >
    <div class="content">
      <!-- 可滑动内容 -->
      <card-page :flag="1">猜你喜欢</card-page>
      <card-page :flag="2">每日推荐</card-page>
      <card-page :flag="3">风格推荐</card-page>
    </div>
  </div>
  <song-list :flag="1"></song-list>
  <song-list :flag="2"></song-list>
  <song-list :flag="3"></song-list>
  <song-list :flag="4"></song-list>
</template>

<style scoped>
.van-search {
  background-color: transparent;
}
.hi {
  padding-top: 20px;
  font-size: 20px;
  padding-left: 15px;
  font-weight: bold;
}
.wrapper {
  touch-action: pan-x; /* 仅允许垂直滚动 */
  overflow: auto;
  width: 100%;
}

.content {
  display: flex;
  /* 宽度等于内容的总宽度 */
  width: max-content; /* 确保内容可横向滚动 */
  padding: 10px;
  gap: 20px;
}

/* 针对不同浏览器隐藏滚动条 */
.wrapper::-webkit-scrollbar {
  display: none;
}
.wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
