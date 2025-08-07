<script setup>
import { onMounted, ref } from 'vue'
import { dayRecommend, styleRecommend, newSong, personalFm } from '@/api/recommend'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores'
import emitter from '@/utils/eventBus'

const audioStore = useAudioStore()
const router = useRouter()
const cover = ref('')
const song = ref('')
const props = defineProps({ flag: Number })
const info = ref([])
const hash = ref('')
const mixsongid = ref('')
onMounted(async () => {
  if (props.flag === 1) {
    const res = await personalFm()
    info.value = res.data.data.song_list
    // console.log(res)
    cover.value = res.data.data.song_list[0].trans_param.union_cover
    song.value = res.data.data.song_list[0].filename
    hash.value = res.data.data.song_list[0].hash
    mixsongid.value = res.data.data.song_list[0].mixsongid
  } else if (props.flag === 2) {
    const res = await dayRecommend()
    // console.log(res)
    cover.value = res.data.data.song_list[0].sizable_cover
    song.value = res.data.data.song_list[0].filename
  } else if (props.flag === 3) {
    const res = await newSong()
    // console.log(res)
    cover.value = res.data.data[0].album_sizable_cover
    song.value = res.data.data[0].filename
  }
})

//去掉图片url中的/{size}
const processCoverUrl = (url) => {
  return url.replace('/{size}', '')
}
const handleClick = () => {
  if (props.flag === 1) {
    audioStore.setHash(hash.value)
    audioStore.setMixsongid(mixsongid.value)
    const newList = info.value
      .filter((item) => item.hash && item.mixsongid)
      .map((item) => ({ hash: item.hash, mixsongid: item.mixsongid }))

    audioStore.setList(newList)
    emitter.emit('showMusic') // 触发事件
  } else {
    router.push(`/musiclist?flag=${props.flag}`)
  }
}
</script>

<template>
  <div
    class="card"
    :class="{ back1: props.flag === 1, back2: props.flag === 2, back3: props.flag === 3 }"
    @click="handleClick"
  >
    <div class="head"><slot></slot></div>
    <Vue3Marquee class="song" :duration="6"> {{ song }} </Vue3Marquee>
    <van-icon name="play" size="25px" class="play" />
    <div class="cover" :style="`background-image: url('${processCoverUrl(cover)}')`"></div>
  </div>
</template>

<style scoped>
.card {
  padding: 10px;
  width: 110px;
  height: 130px;

  color: white;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.back1 {
  background-image: linear-gradient(
    to right bottom,
    rgb(228, 113, 199),
    rgb(197, 223, 245),
    white 300px
  );
}
.back2 {
  background-image: linear-gradient(
    to right bottom,
    rgb(113, 228, 228),
    rgb(200, 197, 245),
    white 300px
  );
}
.back3 {
  background-image: linear-gradient(
    to right bottom,
    rgb(228, 139, 169),
    rgb(245, 238, 197),
    white 300px
  );
}
.head {
  font-weight: bold;
}
.song {
  font-weight: lighter;
  margin-top: 5px;
  font-size: 11px;
}
.play {
  position: absolute;
  right: 5px;
  bottom: 5px;
  z-index: 1;
}
.cover {
  width: 80px;
  height: 80px;
  background-position: center;
  background-size: cover;
  position: absolute;
  right: 0px;
  bottom: 0px;
}
</style>
