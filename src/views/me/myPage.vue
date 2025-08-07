<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { userSong } from '@/api/user'

const userStore = useUserStore()
const router = useRouter()
const login = () => {
  router.push('/login')
}
const likeSongs = ref({})
const getInfo = async () => {
  const res = await userSong()
  likeSongs.value = res.data.data.info[1]
}
const isLogin = ref(false)
onMounted(() => {
  if (document.cookie.split('=')[1] !== 'undefined') {
    isLogin.value = true
    getInfo()
  }
})
//跳转到歌单
const goList = (id) => {
  if (isLogin.value) {
    router.push(`/playlist/${id}`)
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="box">
    <header>我的</header>
    <van-search placeholder="请输入搜索关键词" shape="round" @focus="router.push('/search')" />

    <div class="head" @click="login">
      <van-image
        round
        width="50px"
        height="50px"
        :src="
          isLogin
            ? userStore.pic
            : 'https://img1.baidu.com/it/u=2223092495,2890927007&fm=253&fmt=auto&app=138&f=PNG?w=304&h=304'
        "
      />
      <div v-if="isLogin">{{ userStore.name }}</div>
      <div v-else><span>立即登录</span><van-icon name="arrow" /></div>
    </div>
    <div class="list">我的歌单</div>
    <div class="like" @click="goList(likeSongs.global_collection_id)">
      <div class="icon icon1">
        <van-icon name="like" size="30" color="white" />
      </div>
      <div>
        <div>我喜欢</div>
        <div class="num">{{ isLogin ? likeSongs.count : 0 }}首</div>
      </div>
    </div>
    <div class="like" @click="goList(0)">
      <div class="icon icon2">
        <van-icon name="clock" size="30" color="white" />
      </div>
      <div>
        <div>最近播放</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  background-image: linear-gradient(skyblue 0px, rgb(239, 248, 252) 40%);
  min-height: 567px;
}
.van-search {
  background-color: transparent;
}
header {
  font-weight: bold;
  padding: 15px;
}
.head {
  margin: 0 20px;
  background-color: white;
  padding: 15px;
  text-align: center;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  gap: 20px;
  border-radius: 10px;
}
.list {
  margin: 10px 20px;
}
.like {
  padding: 5px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.icon {
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}
.icon1 {
  background-color: rgb(255, 181, 193);
}
.icon2 {
  background-color: rgb(154, 218, 243);
}
.num {
  font-size: 13px;
  color: grey;
  margin-top: 5px;
}
</style>
