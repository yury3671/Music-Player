<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useAudioStore } from '@/stores'
import { useRouter } from 'vue-router'
import { detailInfo } from '@/api/music'
import emitter from '@/utils/eventBus'

//去掉图片url中的/{size}
const processCoverUrl = (url) => {
  return url.replace('/{size}', '')
}
const router = useRouter()

const audioStore = useAudioStore()
const songRef = ref(null)
const isMove = ref(true)
const name = ref('')
const cover = ref('')
const marqueeKey = ref(1)
watch(
  () => audioStore.hash,
  async () => {
    if (audioStore.hash) {
      isMove.value = true
      marqueeKey.value = Math.random()
      const res = await detailInfo(audioStore.hash)

      if (res.data.data[0].info.image) {
        cover.value = processCoverUrl(res.data.data[0].info.image)
      } else {
        cover.value = processCoverUrl(res.data.data[0].trans_param.union_cover)
      }
      name.value = res.data.data[0].name
      await nextTick()
      if (songRef.value.clientWidth > 240) {
        isMove.value = false
      }
    } else {
      cover.value = ''
      name.value = ''
      isMove.value = true
      audioStore.pausePlay()
    }
  },
)
onMounted(async () => {
  if (audioStore.hash) {
    const res = await detailInfo(audioStore.hash)
    // console.log(res3)
    if (res.data.data[0].info.image) {
      cover.value = processCoverUrl(res.data.data[0].info.image)
    } else {
      cover.value = processCoverUrl(res.data.data[0].trans_param.union_cover)
    }
    name.value = res.data.data[0].name
    await nextTick()

    if (songRef.value.clientWidth > 240) {
      isMove.value = false
    }
  }
})
const showPlay = () => {
  if (audioStore.hash) {
    emitter.emit('showMusic')
  }
}
</script>

<template>
  <div class="show" :style="{ bottom: `${audioStore.pos}px` }">
    <div class="info" @click="showPlay">
      <van-image
        width="45px"
        height="45px"
        fit="cover"
        :src="cover ? cover : 'https://wx3.sinaimg.cn/orj360/0086aulaly1i3xi3knql2j30sg0sg4g7.jpg'"
        radius="5px"
      />
      <div class="name">
        <Vue3Marquee
          :key="marqueeKey"
          class="songName"
          :duration="15"
          direction="left"
          :delay="0"
          :gap="20"
          :pause="isMove"
          ><span ref="songRef">{{ name ? name : '快来听歌吧🎵' }}</span></Vue3Marquee
        >
      </div>
    </div>

    <van-icon name="pause" size="30" v-if="audioStore.isPlaying" @click="audioStore.togglePlay" />

    <van-icon name="play" size="30" v-else @click="audioStore.togglePlay" />
    <van-icon name="wap-nav" size="30" @click.stop="emitter.emit('showList')" />
  </div>
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
.info {
  display: flex;
  align-items: center;
  gap: 5px;
}
.show {
  position: fixed;
  /* bottom: -100px; */
  display: flex;
  background-color: white;
  width: 100vw;
  align-items: center;
  padding: 0 10px;
  gap: 5px;
  transition: 0.1s linear all;
}
.name {
  width: 240px;
}

header {
  position: absolute;
  top: 0;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
  width: 100%;
  z-index: 5;
}
</style>
