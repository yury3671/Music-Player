<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

import { searchHot } from '@/api/search'
import { useHistoryStore } from '@/stores'
import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()
audioStore.setPos(0)
const historyStore = useHistoryStore()

const list = ref([])

const getInfo = async () => {
  const res = await searchHot()
  list.value = res.data.data.list
}
getInfo()

//删除历史记录
const isFold = ref(true)
const flag = ref(1)
const del = () => {
  flag.value = 2
  isShow.value = false
  isFold.value = false
}
const delAll = () => {
  historyStore.delAll()
  flag.value = 1
}
//点击历史记录
const searchRef = ref()
const act = (index, value) => {
  //删除
  if (flag.value === 2) {
    historyStore.del(index)
  } else {
    searchRef.value.setContent(value)
  }
}
const isShow = ref(false)
const hisRef = ref()
const showMore = async () => {
  await nextTick()
  if (hisRef.value && hisRef.value.clientHeight > 40) {
    isShow.value = true // 更新响应式状态
  } else {
    isShow.value = false
  }
}
onMounted(() => {
  showMore()
})
watch(
  () => historyStore.list,
  () => {
    showMore()
  },
  { deep: true },
)
//显示弹出框
const show = ref(false)
const recover = () => {
  flag.value = 1
  isFold.value = true
  showMore()
}
const isHide = ref(true)
</script>

<template>
  <div class="container box">
    <search-bar @hide="isHide = false" @show="isHide = true" ref="searchRef"></search-bar>
    <div class="content" v-show="isHide">
      <div class="history" v-show="historyStore.list.length">
        <div class="head">
          <header>搜索历史</header>
          <van-icon name="delete-o" @click="del" v-if="flag === 1" />
          <div class="work" v-else>
            <span @click="show = true">全部删除</span>
            <span class="complete" @click="recover">完成</span>
          </div>
          <van-dialog
            v-model:show="show"
            show-cancel-button
            message="是否清空所有历史内容？"
            @confirm="delAll"
          ></van-dialog>
        </div>
        <div class="hiss" :class="{ fold: isFold }">
          <div class="his" ref="hisRef">
            <span class="item" v-for="(item, index) in historyStore.list" @click="act(index, item)">
              <span>{{ item }}</span>
              <van-icon name="cross" class="del" v-show="flag === 2" />
            </span>
          </div>
        </div>
        <van-icon
          name="arrow-down"
          class="bot"
          v-show="isShow"
          @click="isFold = false"
          v-if="isFold === true"
        />
        <van-icon name="arrow-up" class="bot" v-show="isShow" @click="isFold = true" v-else />
      </div>
      <div class="hot">
        <van-swipe :loop="false" :width="260" :show-indicators="false">
          <van-swipe-item v-for="item in list" :key="item.name">
            <div class="list">
              <header class="title">{{ item.name }}</header>
              <div
                class="song"
                v-for="(item1, index) in item.keywords"
                :key="index"
                v-show="index < 20"
                @click="searchRef.setContent(item1.keyword)"
              >
                <span class="num" :class="{ red: index < 3 }">{{ index + 1 }}</span>
                <span>{{ item1.keyword }}</span>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.complete {
  color: rgb(76, 170, 247);
  margin-left: 10px;
}
.work {
  font-size: 14px;
}
.del {
  color: gray;
  margin-left: 10px;
}
.head {
  /* background-color: aqua; */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content {
  margin-top: 54px;
  padding: 0 15px;
}

.box {
  background-color: rgb(227, 238, 243);
  padding-bottom: 50px;
}

header {
  font-weight: bold;
}
.hiss {
  margin-top: 10px;
  overflow: hidden;
}
.fold {
  height: 35px;
}
.item {
  display: inline-block;
  margin: 5px;
  font-size: 13px;
  background-color: white;
  padding: 5px 10px;
  border-radius: 100px;
}
.bot {
  margin: 5px;
  background-color: white;
  padding: 5px;
  border-radius: 50%;
}
.song {
  padding: 7px 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  line-height: 20px;
}
.num {
  margin-right: 10px;
  font-weight: bold;
  color: grey;
}

.list {
  overflow: hidden;
  border-radius: 10px;
  width: 250px;
  margin: 10px 0;
  background-color: white;
  border-radius: 10px;
}
.title {
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  background-image: linear-gradient(rgb(193, 227, 240) 0px, white 90%);
}
.red {
  color: red;
}
</style>
