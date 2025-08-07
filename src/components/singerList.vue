<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()
//去掉图片url中的/{size}
const processCoverUrl = (url) => {
  if (url) {
    return url.replace('/{size}', '')
  }
}
const show = ref(false)
const info = ref([])
const open = (list) => {
  info.value = list

  show.value = true
}
defineExpose({ open })
</script>

<template>
  <van-popup v-model:show="show" position="bottom" teleport="body">
    <div class="content">
      <header>查看歌手</header>
      <div class="item" v-if="info" v-for="item in info" :key="item.author_id">
        <van-image round width="40px" height="40px" :src="processCoverUrl(item.sizable_avatar)" />
        <span>{{ item.author_name }}</span>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.content {
  box-sizing: border-box;
  padding-top: 43px;
  max-height: 500px;
  overflow-y: auto; /* 内容溢出时显示滚动条，用于触发滚动功能 */
  scrollbar-width: none; /* Firefox 专属属性，隐藏滚动条 */
  -ms-overflow-style: none; /* IE 和 Edge 专属，隐藏滚动条 */
}
/* Webkit 内核浏览器（Chrome、Safari 等）隐藏滚动条的伪元素设置 */
.content::-webkit-scrollbar {
  display: none;
}

header {
  font-weight: bold;
  position: absolute;
  top: 0;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
  width: 100%;
  z-index: 5;
}
.item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  gap: 15px;
}
</style>
