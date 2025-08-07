<script setup>
import { onMounted, ref } from 'vue'
import { useAudioStore } from '@/stores'
import { useRouter } from 'vue-router'
import { detailInfo } from '@/api/music'
import { showToast } from 'vant'
import emitter from '@/utils/eventBus'

const router = useRouter()

const audioStore = useAudioStore()
const isLike = ref(false)
//去掉图片url中的/{size}
const processCoverUrl = (url) => {
  if (url) {
    return url.replace('/{size}', '')
  }
}
//点击收藏
const like = () => {
  isLike.value = !isLike.value
}
const songName = ref('')
const authorName = ref('')
const cover = ref('')
const props = defineProps({ songInfo: Object, flag: Number, hash: String, mixsongid: String })
const hash = ref('')
const mixsongid = ref('')
const showLike = ref(false)
const showPlay = ref(false)
const songRef = ref(null)
// console.log(props.songInfo)
if (props.flag === 1) {
  if (props.songInfo.songname) {
    songName.value = props.songInfo.songname
  }
  if (props.songInfo.author_name) {
    authorName.value = props.songInfo.author_name
  }
  if (props.songInfo.name) {
    showPlay.value = true
    songName.value = props.songInfo.name
  }
  if (props.songInfo.singername) {
    authorName.value = props.songInfo.singername
  }
  hash.value = props.songInfo.hash
  mixsongid.value = props.songInfo.mixsongid
  if (props.songInfo.sizable_cover) {
    cover.value = processCoverUrl(props.songInfo.sizable_cover)
  }
  if (props.songInfo.album_sizable_cover) {
    cover.value = processCoverUrl(props.songInfo.album_sizable_cover)
  }

  if (props.songInfo.cover || props.songInfo.trans_param.union_cover) {
    cover.value = props.songInfo.cover
      ? processCoverUrl(props.songInfo.cover)
      : processCoverUrl(props.songInfo.trans_param.union_cover)
  }
} else if (props.flag === 2) {
  if (props.songInfo.name) {
    const idx = props.songInfo.name.indexOf(' - ')
    authorName.value = props.songInfo.name.slice(0, idx)
    songName.value = props.songInfo.name.slice(idx + 3)
    cover.value = props.songInfo.cover ? processCoverUrl(props.songInfo.cover) : ''
    hash.value = props.songInfo.hash
    mixsongid.value = props.songInfo.mixsongid
  }
  if (props.songInfo.FileName) {
    showLike.value = true
    const idx = props.songInfo.FileName.indexOf(' - ')
    authorName.value = props.songInfo.FileName.slice(0, idx)
    songName.value = props.songInfo.FileName.slice(idx + 3)
    cover.value = props.songInfo.Image
      ? processCoverUrl(props.songInfo.Image)
      : processCoverUrl(props.songInfo.trans_param.union_cover)
    hash.value = props.songInfo.FileHash
    mixsongid.value = props.songInfo.MixSongID
  }
} else {
  onMounted(async () => {
    hash.value = props.hash
    mixsongid.value = props.mixsongid
    const res = await detailInfo(props.hash)
    if (res.data.data[0].info.image) {
      cover.value = processCoverUrl(res.data.data[0].info.image)
    } else {
      cover.value = processCoverUrl(res.data.data[0].trans_param.union_cover)
    }
    const idx = res.data.data[0].name.indexOf(' - ')
    authorName.value = res.data.data[0].name.slice(0, idx)
    songName.value = res.data.data[0].name.slice(idx + 3)
  })
}

const handleClick = () => {
  // audioStore.addList(hash.value, mixsongid.value)
  audioStore.setHash(hash.value)
  audioStore.setMixsongid(mixsongid.value)
  if (props.flag === 2 || showPlay.value) {
    // router.push('/music')

    emitter.emit('showMusic') // 触发事件
  }
}
const addList = () => {
  showToast({
    message: '已添加到播放队列',
    icon: 'passed',
    iconSize: '30',
    className: 'toast', // 自定义类名
  })
  audioStore.addList(hash, mixsongid)
}
</script>

<template>
  <div class="song" @click="handleClick" v-if="hash && mixsongid" ref="songRef">
    <div class="box">
      <van-image
        width="50px"
        height="50px"
        fit="cover"
        :src="cover ? cover : 'https://wx3.sinaimg.cn/orj360/0086aulaly1i3xi3knql2j30sg0sg4g7.jpg'"
        radius="5px"
      />
      <div class="play" v-show="hash === audioStore.hash">
        <div class="play1"></div>
        <div class="play2"></div>
        <div class="play1"></div>
      </div>
    </div>

    <div class="name">
      <div class="songName" :class="{ active: hash === audioStore.hash }">{{ songName }}</div>
      <div class="author" :class="{ active: hash === audioStore.hash }">{{ authorName }}</div>
    </div>

    <van-icon
      name="like"
      :color="isLike ? 'rgb(241, 79, 79)' : '#bebbbb'"
      @click.stop="like"
      v-if="props.flag === 1 || showLike"
    />
    <van-icon
      name="play-circle-o"
      size="20px"
      color="grey"
      @click.stop="addList"
      v-if="props.flag === 2 || showPlay"
    />
    <van-icon
      name="cross"
      size="20px"
      color="grey"
      v-if="props.flag === 3"
      @click.stop="audioStore.delMusic(props.hash)"
    />
  </div>
</template>

<style scoped>
.box {
  position: relative;
}
.play {
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 0px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.play div {
  width: 2px;
  border-radius: 10px;
  background-color: white;
}
.play1 {
  animation: play1 1s linear infinite;
}
.play2 {
  animation: play2 1s linear infinite;
}
@keyframes play1 {
  0%,
  100% {
    height: 15px;
  }
  50% {
    height: 5px;
  }
}
@keyframes play2 {
  0%,
  100% {
    height: 5px;
  }
  50% {
    height: 15px;
  }
}
.song {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-right: 10px;
  margin-bottom: 10px;

  width: 100%;
}

.name {
  width: 60%;
  /* background-color: aqua; */
}
.author {
  font-size: 14px;
  color: grey;
}
.songName,
.author {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.active {
  color: rgb(60, 169, 212);
}
</style>
