<script setup>
import { ref, nextTick, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  songUrl,
  favoriteCount,
  commentCount,
  musicInfo,
  detailInfo,
  lyricSearch,
  lyricGet,
  artistSongs,
  artistImage,
  songClimax,
} from '@/api/music'
import { useAudioStore } from '@/stores'
import { parseKrc } from '@/utils/krcParser'
import emitter from '@/utils/eventBus'

const emit = defineEmits(['close', 'toggle'])
const audioStore = useAudioStore()
const show = ref(false)
const route = useRoute()
const router = useRouter()
const songRef = ref()
const isComment = ref(true)
const authorRef = ref()
const isMove1 = ref(true)
const isMove2 = ref(true)
//去掉图片url中的/{size}
const processCoverUrl = (url) => {
  return url.replace('/{size}', '')
}
const songName = ref('')
const authorName = ref('')
const cover = ref('')
//喜欢数量
const likeCount = ref('')
const comments = ref(0)
const decodeContent = ref('')
const marqueeKey = ref(1)
const hotTime = ref(0)
const getUrl = async () => {
  decodeContent.value = ''
  isMove1.value = true
  isMove2.value = true
  marqueeKey.value = Math.random()
  const res = await songClimax(audioStore.hash)

  hotTime.value = +res.data.data[0].start_time / 1000
  const res1 = await favoriteCount(audioStore.mixsongid)
  if (res1.data.data.list[0]) {
    likeCount.value = res1.data.data.list[0].count_text
  }

  const res2 = await commentCount(audioStore.hash)

  // console.log(Object.values(res2.data)[0])
  comments.value = Object.values(res2.data)[0]
  const res3 = await detailInfo(audioStore.hash)
  if (res3.data.data[0].info.image) {
    cover.value = processCoverUrl(res3.data.data[0].info.image)
  } else {
    cover.value = processCoverUrl(res3.data.data[0].trans_param.union_cover)
  }
  const idx = res3.data.data[0].name.indexOf(' - ')
  authorName.value = res3.data.data[0].name.slice(0, idx)
  songName.value = res3.data.data[0].name.slice(idx + 3)
  const res4 = await lyricSearch(audioStore.hash)
  const res5 = await lyricGet(res4.data.candidates[0].id, res4.data.candidates[0].accesskey)
  decodeContent.value = res5.data.decodeContent
  await nextTick()

  if (songRef.value.clientWidth > 330) {
    isMove1.value = false
  }
  if (authorRef.value.clientWidth > 330) {
    isMove2.value = false
  }
}
getUrl()
watch(
  () => audioStore.hash,
  () => {
    getUrl()
  },
)

//格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return mins + ':' + secs
}

//点击收藏
const isLike = ref(false)

const like = () => {
  isLike.value = !isLike.value
}
const parsedLyrics = computed(() => {
  if (!decodeContent.value) return []
  // console.log(parseKrc(props.decodeContent))
  return parseKrc(decodeContent.value)
})
//获取正在播放的lineIndex
const currentLine = computed(() => {
  if (!parsedLyrics.value.length) return -1

  const currentMs = audioStore.currentTime * 1000

  const line = parsedLyrics.value.find((line) => currentMs >= line.start && currentMs < line.end)

  return line
})
//展示歌手
const singerRef = ref(null)
const showSinger = async () => {
  const res = await artistImage(audioStore.hash)
  console.log(res)
  singerRef.value.open(res.data.data[0])
}
const commentRef = ref(null)
const videoRef = ref(null)
const toggle = async (num) => {
  show.value = true
  if (num) {
    isComment.value = true
    await nextTick()
    if (commentRef.value) {
      commentRef.value.initInfo()
    }
  } else {
    isComment.value = false
    await nextTick()

    if (videoRef.value) {
      videoRef.value.initInfo()
    }
  }
}
</script>

<template>
  <div class="box">
    <div class="nav">
      <van-icon name="arrow-down" size="20" @click="emit('close')" />
    </div>
    <div class="cover" :style="{ backgroundImage: `url(${cover})` }"></div>
    <div class="info">
      <div class="word" @click="emit('toggle')">
        <div>
          <one-word :line="currentLine" v-if="currentLine"></one-word>
        </div>
      </div>
      <div class="song">
        <div class="left">
          <Vue3Marquee
            class="songName name"
            :key="marqueeKey"
            :duration="15"
            direction="left"
            :delay="0"
            :gap="20"
            :pause="isMove1"
            style="width: 330px"
            ><span ref="songRef">{{ songName }}</span></Vue3Marquee
          >
          <Vue3Marquee
            class="authorName name"
            :key="marqueeKey"
            :duration="15"
            direction="left"
            :delay="0"
            :gap="20"
            :pause="isMove2"
            style="width: 330px"
            ><span ref="authorRef" @click="showSinger">{{ authorName }}</span></Vue3Marquee
          >
        </div>
        <singer-list ref="singerRef"></singer-list>
      </div>
      <div class="right">
        <van-icon
          name="like"
          size="25"
          :color="isLike ? 'rgb(241, 79, 79)' : '#bebbbb'"
          @click="like"
        />
        <span class="count count1">{{ likeCount }}</span>
        <van-icon name="chat" size="25" color="#bebbbb" @click="toggle(1)" />
        <span class="count count2">{{ comments }}</span>
        <van-icon name="video" size="25" color="#bebbbb" @click="toggle(0)" />
      </div>
      <div class="slide">
        <div
          class="dot"
          :style="{ left: `${(hotTime / audioStore.duration) * 335}px` }"
          @click="audioStore.setCurrentTime(hotTime)"
        ></div>
        <van-slider
          v-model="audioStore.currentTime"
          :max="audioStore.duration"
          class="slider"
          @drag-start="audioStore.handleDragStart"
          @drag-end="audioStore.handleDragEnd"
          active-color="black"
          @change="audioStore.handleClick"
        />
        <div class="time">
          <div>{{ formatTime(audioStore.currentTime) }}</div>
          <div>{{ formatTime(audioStore.duration) }}</div>
        </div>
      </div>
      <div class="control">
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
        <span class="iconfont icon-pre icon" @click="audioStore.toggleMusic(1)"></span>
        <van-icon
          name="pause"
          size="35"
          v-if="audioStore.isPlaying"
          class="play"
          @click="audioStore.togglePlay"
        />
        <van-icon name="play" size="35" v-else class="play" @click="audioStore.togglePlay" />
        <span class="iconfont icon-previousasd icon" @click="audioStore.toggleMusic(-1)"></span>
        <van-icon name="wap-nav" size="30" @click="emitter.emit('showList')" />
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="show"
    position="right"
    :style="{ height: '664px', width: '375px' }"
    teleport="body"
    class="pop"
    :overlay="false"
  >
    <music-comments @close="show = false" v-if="isComment" ref="commentRef"></music-comments>
    <music-video @close="show = false" v-else ref="videoRef"></music-video>
  </van-popup>
</template>

<style scoped>
.slide {
  position: relative;
}
.dot {
  top: -1px;
  width: 3px;
  height: 5px;
  background-color: black;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
}
.word {
  height: 50px;
  /* margin: 5px 0; */
  /* background-color: aqua; */
  /* padding: 10px 10px; */
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* background-color: aqua; */
}
.nav {
  padding-left: 15px;
  padding-top: 10px;
}
.count {
  position: absolute;
  font-size: 10px;
  color: #bebbbb;
}
.right {
  position: relative;
  display: flex;
  gap: 50px;
  margin-right: 5px;
  /* background-color: aqua; */
  margin: 20px 0;
}
.count1 {
  left: 25px;
  top: -5px;
}
.count2 {
  left: 96px;
  top: -5px;
}
.song {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.songName {
  font-size: 23px;
  margin: 5px 0;
}

.cover {
  height: 375px;
  background-position: center;
  background-size: cover;
  box-shadow:
    0 -25px 20px -5px white inset,
    0 25px 20px -5px white inset;
  overflow: hidden;
}
.play {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.info {
  padding: 0 20px;
}
.control {
  /* margin-top: 10px; */
  /* background-color: burlywood; */
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.icon {
  font-size: 25px;
}
.slider {
  margin: 0 auto;
}
::v-deep .van-slider__button {
  width: 7px;
  height: 7px;
  background-color: black;
}
.time {
  margin-top: 10px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}
</style>
