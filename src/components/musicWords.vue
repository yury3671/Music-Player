<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detailInfo, favoriteCount, lyricSearch, lyricGet, artistImage } from '@/api/music'
import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()
const emit = defineEmits(['close', 'toggle'])

const route = useRoute()
const router = useRouter()
const songName = ref('')
const authorName = ref('')
const likeCount = ref('')
const decodeContent = ref('')
const getUrl = async () => {
  const res = await favoriteCount(audioStore.mixsongid)
  if (res.data.data.list[0]) {
    likeCount.value = res.data.data.list[0].count_text
  }
  const res1 = await lyricSearch(audioStore.hash)
  songName.value = res1.data.candidates[0].song
  authorName.value = res1.data.candidates[0].singer
  // console.log(res1)
  const res2 = await lyricGet(res1.data.candidates[0].id, res1.data.candidates[0].accesskey)
  console.log(res2)
  decodeContent.value = res2.data.decodeContent
  await nextTick()
  if (songRef.value.clientWidth > 270) {
    isMove1.value = false
  }
  if (authorRef.value.clientWidth > 270) {
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

const songRef = ref()
const authorRef = ref()
const isMove1 = ref(true)
const isMove2 = ref(true)
//点击收藏
const isLike = ref(false)

const like = () => {
  isLike.value = !isLike.value
}
//展示歌手
const singerRef = ref(null)
const showSinger = async () => {
  const res = await artistImage(audioStore.hash)
  console.log(res)
  singerRef.value.open(res.data.data[0])
}
</script>

<template>
  <div class="box">
    <div class="nav">
      <van-icon name="arrow-down" size="20" @click="emit('close')" />
    </div>
    <div class="song" @click="emit('toggle')">
      <div class="left">
        <Vue3Marquee
          class="songName name"
          :duration="15"
          direction="left"
          :delay="0"
          :gap="20"
          :pause="isMove1"
          style="width: 270px"
          ><span ref="songRef">{{ songName }}</span></Vue3Marquee
        >
        <Vue3Marquee
          class="authorName name"
          :duration="15"
          direction="left"
          :delay="0"
          :gap="20"
          :pause="isMove2"
          style="width: 270px"
          ><span ref="authorRef" @click.stop="showSinger">{{ authorName }}</span></Vue3Marquee
        >
      </div>
      <singer-list ref="singerRef"></singer-list>
      <div class="right">
        <van-icon
          name="like"
          size="25"
          :color="isLike ? 'rgb(241, 79, 79)' : '#bebbbb'"
          @click.stop="like"
          style="margin-right: 20px"
        />
        <span class="count">{{ likeCount }}</span>
      </div>
    </div>

    <krc-lyric
      :decodeContent="decodeContent"
      v-if="decodeContent"
      @activeLine="showLine"
    ></krc-lyric>

    <div class="bot">
      <van-icon
        name="pause"
        size="35"
        v-if="audioStore.isPlaying"
        class="play"
        @click="audioStore.togglePlay"
      />
      <van-icon name="play" size="35" v-else class="play" @click="audioStore.togglePlay" />
    </div>
  </div>
</template>

<style scoped>
.count {
  position: absolute;
  font-size: 10px;
  color: #bebbbb;
  left: 315px;
  /* left: 335px; */
  top: 14px;
  /* background-color: aqua; */
}
.box {
  height: 500px;
  height: 100vh;
  padding: 15px 20px;
  box-sizing: border-box;
  /* overflow: hidden; */
}
.song {
  width: 335px;
  position: fixed;
  top: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* box-shadow: 0 40px 10px 0px white; */
  box-shadow: 0 10px 20px 15px white;
}

.name {
  width: 270px;
}
.songName {
  font-size: 23px;
  margin: 5px 0;
}
.play {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.bot {
  /* position: absolute; */

  text-align: right;

  /* box-shadow: 0 -10px 20px 15px white; */
  /* bottom: 15px; */
}
</style>
