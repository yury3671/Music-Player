<script setup>
import { nextTick, ref } from 'vue'
import { useAudioStore } from '@/stores'
import { showConfirmDialog } from 'vant'
const audioStore = useAudioStore()
const dialogVisible = ref(false)
const show = ref(false)
const songsRef = ref([])
const open = async () => {
  show.value = true
  const index = audioStore.musicList.findIndex((item) => item.hash === audioStore.hash)
  await nextTick()
  if (songsRef.value[index]) {
    songsRef.value[index].$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}

defineExpose({ open })
</script>

<template>
  <van-popup v-model:show="show" position="bottom" :style="{ height: '466px' }" teleport="body">
    <div class="content">
      <header>
        <span>播放列表</span>
        <div>
          <span
            class="iconfont icon-danquxunhuan icon"
            v-if="audioStore.model === 1"
            @click="audioStore.changeModel()"
          ></span>
          <span
            class="iconfont icon-shunxubofang icon"
            v-if="audioStore.model === 2"
            @click="audioStore.changeModel()"
          ></span>
          <span
            class="iconfont icon-suijibofang icon"
            v-if="audioStore.model === 3"
            @click="audioStore.changeModel()"
          ></span>
          <van-icon name="delete-o" @click="dialogVisible = true" style="margin-left: 15px" />
        </div>
      </header>
      <van-dialog
        v-model:show="dialogVisible"
        title="清空当前列表"
        show-cancel-button
        @confirm="audioStore.setList([])"
      >
      </van-dialog>
      <one-song
        ref="songsRef"
        v-for="item in audioStore.musicList"
        :key="item.hash"
        :hash="item.hash"
        :flag="3"
        :mixsongid="item.mixsongid"
      ></one-song>
      <van-empty
        v-show="!audioStore.musicList.length"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="80"
        description="没有正在播放的歌曲"
      />
    </div>
  </van-popup>
</template>

<style scoped>
.content {
  box-sizing: border-box;
  padding-top: 50px;
  height: 466px;
  overflow-y: auto; /* 内容溢出时显示滚动条，用于触发滚动功能 */
  scrollbar-width: none; /* Firefox 专属属性，隐藏滚动条 */
  -ms-overflow-style: none; /* IE 和 Edge 专属，隐藏滚动条 */
}
/* Webkit 内核浏览器（Chrome、Safari 等）隐藏滚动条的伪元素设置 */
.content::-webkit-scrollbar {
  display: none;
}

header {
  position: absolute;
  top: 0;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
  width: 100%;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
