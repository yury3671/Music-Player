import { isEqual } from 'lodash'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAudioStore = defineStore(
  'audio',
  () => {
    const model = ref(1)
    const hash = ref('')
    const mixsongid = ref('')
    const audioRef = ref(null)
    const musicList = ref([])
    const pos = ref('0')
    //是否暂停
    const isPlaying = ref(true)
    const isDragging = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const setList = (newList, num) => {
      if (newList.length) {
        const isEqual = newList.every((obj, index) => {
          return JSON.stringify(obj) === JSON.stringify(musicList.value[index])
        })

        if (!isEqual) {
          musicList.value = newList
        }
        if (num) {
          hash.value = musicList.value[0].hash
          mixsongid.value = musicList.value[0].mixsongid
        }
      } else {
        musicList.value = []
        hash.value = ''
        mixsongid.value = ''
      }
    }
    const addList = (hash_, mixsongid) => {
      const index = musicList.value.findIndex((item) => item.hash === hash.value)
      if (musicList.value.some((item) => item.hash === hash_)) {
        const pos = musicList.value.findIndex((item) => item.hash === hash_)
        musicList.value.splice(pos, 1)
      }
      musicList.value.splice(index + 1, 0, { hash: hash_, mixsongid })
    }
    const setPos = (value) => {
      pos.value = value
    }
    const setHash = (value) => {
      hash.value = value
    }
    const setMixsongid = (value) => {
      mixsongid.value = value
    }
    const setAudioRef = (value) => {
      audioRef.value = value
    }
    const setCurrentTime = (time) => {
      currentTime.value = time
      audioRef.value.currentTime = time
      isPlaying.value = true
      audioRef.value.play()
    }
    //切换播放模式
    const changeModel = () => {
      model.value = model.value === 3 ? 1 : model.value + 1
    }
    //更新滑块位置
    const updateSlider = () => {
      if (!isDragging.value && audioRef.value) {
        currentTime.value = audioRef.value.currentTime
      }
    }
    //设置总时长
    const setDuration = () => {
      if (audioRef.value) {
        duration.value = audioRef.value.duration
      }
    }
    const setIsPlaying = (value) => {
      isPlaying.value = value
    }

    //点击滑块
    const handleClick = () => {
      audioRef.value.currentTime = currentTime.value
      isPlaying.value = true

      audioRef.value.play()
    }
    //开始滑动滑块
    const handleDragStart = () => {
      isDragging.value = true
    }
    //结束滑动滑块
    const handleDragEnd = () => {
      isDragging.value = false
      audioRef.value.currentTime = currentTime.value
    }
    //切换暂停/播放
    const togglePlay = () => {
      if (hash.value) {
        if (isPlaying.value) {
          audioRef.value.pause()
        } else {
          audioRef.value.play()
        }
        isPlaying.value = !isPlaying.value
      }
    }
    //暂停播放
    const pausePlay = () => {
      isPlaying.value = false

      audioRef.value.pause()
    }
    //开始播放
    const startPlay = () => {
      isPlaying.value = true

      audioRef.value.play()
    }
    //切换下一首或上一首
    const toggleMusic = (num) => {
      let index
      if (model.value === 1 || model.value === 2) {
        index = musicList.value.findIndex((item) => item.hash === hash.value)
        if (num === 1) {
          //切换上一首
          index = index ? index - 1 : musicList.value.length - 1
        } else {
          index = index === musicList.value.length - 1 ? 0 : index + 1
        }
      } else {
        index = Math.floor(Math.random() * musicList.value.length)
      }

      hash.value = musicList.value[index].hash
      mixsongid.value = musicList.value[index].mixsongid
    }
    //音频结束时处理
    const handleAudioEnd = () => {
      currentTime.value = 0
      if (model.value !== 1) {
        toggleMusic(-1)
      }
      audioRef.value.play()
      // isPlaying.value = false
    }
    //删除歌曲
    const delMusic = (hash_) => {
      if (hash.value === hash_) {
        toggleMusic(-1)
      }
      let index = musicList.value.findIndex((item) => item.hash === hash_)
      musicList.value.splice(index, 1)
    }
    return {
      model,
      musicList,
      pos,
      hash,
      mixsongid,
      audioRef,
      isPlaying,
      isDragging,
      currentTime,
      duration,
      setList,
      changeModel,
      delMusic,
      addList,
      handleClick,
      setPos,
      setHash,
      setMixsongid,
      setCurrentTime,
      setAudioRef,
      toggleMusic,
      updateSlider,
      setDuration,
      setIsPlaying,
      handleAudioEnd,
      handleDragStart,
      handleDragEnd,
      togglePlay,
      pausePlay,
      startPlay,
    }
  },
  {
    persist: true, // 持久化配置放在 defineStore 第三个参数
  },
)
