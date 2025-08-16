<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAudioStore } from '@/stores'
import { update } from 'lodash'
import { valueEquals } from 'element-plus'

const audioStore = useAudioStore()
const props = defineProps({
  list: Array,
  estimatedHeight: Number,
  buffer: Number,
})
const containerRef = ref(null)
const listRef = ref(null)
const containerHeight = ref(0)
const listHeight = ref(0)
//存储每个元素位置信息
const positions = ref([])
const scrollTop = ref(0)
const maxCount = ref(0)
const preLen = ref(0) //之前处理的数据长度
//初始化数据
const initPositions = () => {
  if (props.list.length <= preLen.value) return
  const newItems = props.list.slice(preLen.value)
  newItems.forEach((item, index) => {
    const currentIndex = preLen.value + index
    const prevBottom = !currentIndex ? 0 : positions.value[currentIndex - 1].bottom
    positions.value.push({
      top: prevBottom, // 当前项top = 上一项bottom
      bottom: prevBottom + props.estimatedHeight, // 当前项bottom = top + 预估高度
      height: props.estimatedHeight, // 预估高度（后续可通过实际测量更新）
    })
  })
  preLen.value = props.list.length
}
//更新数据
const updatePositions = () => {
  // const nodes = listRef.value.children
  const nodes = Array.from(listRef.value.children)
  let needsUpdate = false
  nodes.forEach((node, index) => {
    const rect = node.getBoundingClientRect()
    //找到元素再positions中的位置
    const posIndex = Math.max(0, startIndex.value - props.buffer) + index
    const position = positions.value[posIndex]

    const heightDiff = rect?.height - position?.height
    if (heightDiff > 0) {
      position.height = rect.height
      position.bottom += heightDiff
      needsUpdate = true
      //更新后续所有位置
      for (let i = posIndex + 1; i < positions.value.length; i++) {
        positions.value[i].top = positions.value[i - 1].bottom
        positions.value[i].bottom = positions.value[i].top + positions.value[i].height
      }
    }
  })
  if (needsUpdate) {
    listHeight.value = positions.value[positions.value.length - 1].bottom
  }
}
onMounted(async () => {
  containerHeight.value = containerRef.value?.clientHeight

  //预测容器最多显示元素个数
  maxCount.value = Math.ceil(containerHeight.value / props.estimatedHeight) + 1
  initData()
})

const initData = async () => {
  initPositions()
  await nextTick()
  updatePositions() // 初始渲染后更新实际高度
}
defineExpose({ initData })
//动态设置内容容器的高度，让滚动条能保持正常比例，transform让可视区域的数据出现在正确位置
const scrollStyle = computed(() => {
  const finialStart = Math.max(0, startIndex.value - props.buffer)

  //距离顶部的高度
  const offsetTop = finialStart === 0 ? 0 : positions.value[finialStart - 1]?.bottom || 0
  return {
    height: `${listHeight.value - offsetTop}px`,
    transform: `translateY(${offsetTop}px)`,
  }
})
//二分查找获得起始索引
const startIndex = computed(() => {
  if (!positions.value.length) return 0

  let left = 0
  let right = positions.value.length - 1
  let res = 0
  //result保存了最后一个满足bottom>scrollTop的索引
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (positions.value[mid].bottom > scrollTop.value) {
      right = mid - 1
      res = mid
    } else {
      left = mid + 1
    }
  }

  return res
})
watch(
  () => startIndex.value,
  () => {
    nextTick(() => updatePositions())
  },
)
const virtualList = computed(() => {
  // console.log(startIndex.value)
  if (!positions.value.length) return []

  const finialStart = Math.max(0, startIndex.value - props.buffer)
  const finialEnd = Math.min(props.list.length, startIndex.value + maxCount.value + props.buffer)

  // console.log(props.list.slice(finialStart, finialEnd))
  return props.list.slice(finialStart, finialEnd)
})
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>

<template>
  <div class="content" @scroll="handleScroll" ref="containerRef">
    <div :style="scrollStyle" ref="listRef">
      <slot :items="virtualList"></slot>
    </div>
  </div>
</template>

<style scoped>
.content {
  box-sizing: border-box;
  padding-top: 46px;
  letter-spacing: 1px;
  /* background-color: aqua; */
  margin-top: 0px;
}
.content {
  height: 665px;

  overflow-y: auto; /* 内容溢出时显示滚动条，用于触发滚动功能 */
  scrollbar-width: none; /* Firefox 专属属性，隐藏滚动条 */
  -ms-overflow-style: none; /* IE 和 Edge 专属，隐藏滚动条 */
}
.content::-webkit-scrollbar {
  display: none;
}
</style>
