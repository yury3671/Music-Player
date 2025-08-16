<script setup>
import { last } from 'lodash'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  list: Array,
  itemHeight: Number,
  buffer: Number,
})
const containerRef = ref(null)
const containerHeight = ref(0)
const scrollTop = ref(0)

onMounted(() => {
  containerHeight.value = containerRef.value?.clientHeight
})

const startIndex = computed(() => {
  return Math.floor(scrollTop.value / props.itemHeight)
})
//动态设置内容容器的高度，让滚动条能保持正常比例，transform让可视区域的数据出现在正确位置
const scrollStyle = computed(() => {
  // 总内容高度 = 数据总条数 × 每项固定高度（关键修正）
  const totalHeight = props.list.length * props.itemHeight
  // 可视区域外的偏移高度 = 起始索引 × 每项高度
  const offsetTop = Math.max(0, startIndex.value - props.buffer) * props.itemHeight
  return {
    height: `${totalHeight - offsetTop}px`, // 剩余内容高度 = 总高度 - 已偏移高度
    transform: `translateY(${offsetTop}px)`, // 偏移到可视区域
  }
})
const virtualList = computed(() => {
  // console.log(startIndex.value)
  const finialStart = Math.max(0, startIndex.value - props.buffer)
  const numVisible = Math.floor(containerHeight.value / props.itemHeight)
  const finialEnd = Math.min(props.list.length, startIndex.value + numVisible + props.buffer)
  // console.log(props.list.slice(finialStart, finialEnd))
  // console.log(finialEnd)
  return props.list.slice(finialStart, finialEnd)
})

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
  // console.log(scrollTop.value)
}
</script>

<template>
  <div class="container" @scroll="handleScroll" ref="containerRef">
    <div :style="scrollStyle">
      <slot :items="virtualList"></slot>
    </div>
  </div>
</template>

<style scoped></style>
