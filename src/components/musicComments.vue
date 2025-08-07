<script setup>
import { nextTick, ref } from 'vue'
import { useAudioStore } from '@/stores'
import { musicComment, floorComment } from '@/api/music'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

const router = useRouter()
const emit = defineEmits(['close', 'toggle'])

const audioStore = useAudioStore()

const activeURL = ref('')
const list = ref([])
const page = ref(1)
const total = ref(0)
let mixsongid = audioStore.mixsongid
//是否折叠

const getInfo = async () => {
  const res = await musicComment(mixsongid, page.value)

  total.value = res.data.count
  // 正确使用map返回新对象
  const newItems = res.data.list.map((item) => ({
    ...item, // 展开原item的所有属性
    childList: [], // 添加新属性
    childPage: 1, // 添加新属性
  }))
  page.value += 1
  list.value.push(...newItems)
}
getInfo()
const initInfo = () => {
  if (audioStore.mixsongid !== mixsongid) {
    total.value = 0
    list.value = []
    page.value = 1
    mixsongid = audioStore.mixsongid
    getInfo()
  }
}
defineExpose({ initInfo })
const showReply = async (index) => {
  const res = await floorComment(
    list.value[index].special_child_id,
    mixsongid,
    list.value[index].id,
    list.value[index].childPage,
    5,
  )
  console.log(res)
  list.value[index].childPage += 1
  list.value[index].childList.push(...res.data.list)
}
//懒加载
const handleScroll = debounce(async (event) => {
  const bottomReached =
    event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1
  if (bottomReached) {
    await getInfo()
  }
}, 200)
</script>

<template>
  <div class="img" v-show="activeURL" @click="activeURL = ''">
    <van-image :src="activeURL" radius="5" />
  </div>

  <div v-show="!activeURL" class="content" @scroll="handleScroll">
    <van-nav-bar :title="`评论(${total})`" left-arrow @click-left="emit('close')" fixed />
    <div>
      <div v-for="(item, index) in list" :key="item.id">
        <one-comment
          :info="item"
          @clickImg="activeURL = item.images[0].url"
          :flag="0"
        ></one-comment>

        <one-comment
          v-for="child in item.childList"
          :key="child.id"
          :info="child"
          :name="item.user_name"
          @clickImg="activeURL = child.images[0].url"
          :flag="1"
        ></one-comment>
        <div class="reply" v-if="item.reply_num && item.childList.length < item.reply_num">
          <hr />
          <span style="line-height: 1" @click="showReply(index)"
            >展开{{ item.childList.length ? '更多' : `${item.reply_num}条` }}回复<van-icon
              name="arrow-down"
          /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
hr {
  width: 30px;
  display: inline-block;
  border: 0;
  border-top: 1px solid rgb(219, 214, 214);
  margin-right: 5px;
}
.reply {
  margin-top: 5px;
  margin-left: 60px;
  font-size: 13px;
  color: rgb(16, 82, 168);
  display: flex;
  align-items: center;
}
.img {
  position: absolute;
  width: 100%;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: black;
}

.box {
  overflow: hidden;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-line-clamp: 4; /* 行数，值可以改，表示展示X行后多余的缩略展示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  word-break: break-all;
}

.content {
  box-sizing: border-box;
  padding-top: 46px;
  letter-spacing: 1px;
  /* background-color: aqua; */
  margin-top: 0px;
}
.content {
  height: 664px;

  overflow-y: auto; /* 内容溢出时显示滚动条，用于触发滚动功能 */
  scrollbar-width: none; /* Firefox 专属属性，隐藏滚动条 */
  -ms-overflow-style: none; /* IE 和 Edge 专属，隐藏滚动条 */
}
.content::-webkit-scrollbar {
  display: none;
}
::v-deep .van-icon-arrow-left {
  color: black;
}
</style>
