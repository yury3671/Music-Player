<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { parseKrc } from '@/utils/krcParser'
import { useAudioStore } from '@/stores'

const audioStore = useAudioStore()
const props = defineProps({ decodeContent: String })
// console.log(props.decodeContent)
// 解析歌词
const parsedLyrics = computed(() => {
  return parseKrc(props.decodeContent)
})
const containerRef = ref(null)
const isScroll = ref(false)
const useScroll = ref(false)
const scrollEndTimer = ref(null)
// 处理滚动事件
const handleScroll = () => {
  //如果自动滚动
  if (isScroll.value) return
  //手动滚动
  useScroll.value = true

  // 清除之前的定时器
  if (scrollEndTimer.value) {
    clearTimeout(scrollEndTimer.value)
  }

  // 设置新的定时器
  scrollEndTimer.value = setTimeout(() => {
    useScroll.value = false
  }, 1500)
  updateCenterIndex()
}
const isLineActive = (lineIndex) => {
  const line = parsedLyrics.value[lineIndex]
  const currentMs = audioStore.currentTime * 1000
  //如果正在播放当前行并且没有手动滑动
  if (currentMs >= line.start && currentMs < line.end && !useScroll.value) {
    scrollToLine(lineIndex) //自动往下滚动
  }
  return currentMs >= line.start && currentMs < line.end
}
//滚动函数
const linesRef = ref(null)
const scrollToLine = (index) => {
  //自动滚动
  isScroll.value = true
  nextTick(() => {
    if (linesRef.value[index]) {
      //执行平滑滚动到中央
      linesRef.value[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  })
  // 滚动结束后重置状态
  setTimeout(() => {
    isScroll.value = false
  }, 500)
  // console.log(linesRef.value)
}
// 处理歌词行点击
const handleLineClick = (index) => {
  const line = parsedLyrics.value[index]
  audioStore.setCurrentTime(line.start / 1000)
  useScroll.value = false //手动滚动结束立即跳转
}
//更新中间行时间
const centerLineIndex = ref()
const updateCenterIndex = () => {
  const container = containerRef.value

  const containerRect = container.getBoundingClientRect()

  const containerHeight = container.clientHeight
  // 找出最接近中间的行
  let closestLine = null
  let minDistance = Infinity
  //遍历每行计算每行到可视区域中央的距离
  linesRef.value.forEach((line, index) => {
    const lineRect = line.getBoundingClientRect()
    //计算行中央到可视区域顶部的距离
    const lineCenter = lineRect.top + lineRect.height / 2 - containerRect.top
    const distance = Math.abs(lineCenter - containerHeight / 2)

    if (distance < minDistance) {
      minDistance = distance
      closestLine = index
    }
  })
  centerLineIndex.value = closestLine
}
// 格式化时间显示 (ms -> 00:00.000)
const formatTime = (ms) => {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="words" @scroll="handleScroll" ref="containerRef">
    <div
      class="box"
      v-for="(line, index) in parsedLyrics"
      :key="index"
      ref="linesRef"
      @click="handleLineClick(index)"
      :class="{ scroll: index === centerLineIndex && useScroll }"
      :style="{ fontWeight: isLineActive(index) ? 'bold' : 'normal' }"
    >
      <div>
        <one-word :line="line"></one-word>
      </div>

      <div class="play" v-show="index === centerLineIndex && useScroll">
        <van-icon name="play" />
        <div style="font-size: 10px">{{ formatTime(line.start) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll {
  background-color: #eee;
}

/* 隐藏滚动条，但内容可滚动（适配 Chrome、Safari、Opera 等webkit内核浏览器 ） */
.words {
  scroll-behavior: smooth;
  height: 500px;
  /* margin: 15px 0; */

  margin-top: 75px;
  padding-bottom: 260px;
  padding-top: 30px;
  box-sizing: border-box;
  overflow-y: auto; /* 内容溢出时显示滚动条，用于触发滚动功能 */
  scrollbar-width: none; /* Firefox 专属属性，隐藏滚动条 */
  -ms-overflow-style: none; /* IE 和 Edge 专属，隐藏滚动条 */
}
/* Webkit 内核浏览器（Chrome、Safari 等）隐藏滚动条的伪元素设置 */
.words::-webkit-scrollbar {
  display: none;
}
.play {
  display: flex;
  flex-direction: column;
  /* height: 20px; */
  line-height: 10px;
  align-items: center;
  color: #bebbbb;
}
.box {
  /* background-color: pink; */
  border-radius: 10px;
  padding: 10px 10px;
  /* margin: 5px 0; */
  /* height: 40px; */
  /* line-height: 40px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bold {
  font-weight: normal;
}
.active {
  color: skyblue;
  font-weight: bold;
}
.activing {
  /* color: skyblue; */
  transition: color 0.1s;
  font-weight: bold;
  background: linear-gradient(to right, skyblue var(--progress), black);
  -webkit-background-clip: text; /* Safari/Chrome 兼容性 */
  background-clip: text; /* 标准语法 */
  color: transparent; /* 关键：使文本颜色透明，显示背景渐变 */
}
</style>
