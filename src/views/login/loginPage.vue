<script setup>
import { ref } from 'vue'
import { userLogin, codeSend } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores'
const audioStore = useAudioStore()
audioStore.setPos(-50)

//获取路由对象
const router = useRouter()

const userStore = useUserStore()

const form = ref({
  mobile: '',
  code: '',
})
const rules = {
  mobile: [
    { required: true, message: '请输入手机号' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式',
    },
  ],
  code: [
    { required: true, message: '请输入验证码' },
    {
      pattern: /^\d{6}$/,
      message: '验证码必须为6位数字',
    },
  ],
}
//获取验证码倒计时
const formRef = ref()
const getRef = ref()
let flag = true
let timer = 0
const confirm = async () => {
  if (flag) {
    // await formRef.value.validate('mobile')
    console.log(form.value.mobile)
    const res = await codeSend(form.value.mobile)
    console.log(res)
    let num = 60
    if (getRef.value) {
      getRef.value.innerHTML = `${num}后重新获取`
    }

    flag = false
    if (getRef.value) {
      getRef.value.style.color = 'grey'
    }

    timer = setInterval(() => {
      num--

      if (getRef.value) {
        getRef.value.innerHTML = `${num}后重新获取`
      }
      if (num === 0) {
        clearInterval(timer)
        if (getRef.value) {
          getRef.value.innerHTML = '获取验证码'
        }

        getRef.value.style.color = 'rgb(79, 117, 241)'
        flag = true
        num = 60
      }
    }, 1000)
  }
}
const login = async () => {
  const res = await userLogin(form.value)
  console.log(res)
  userStore.setToken(res.data.data.token)
  userStore.setName(res.data.data.nickname)
  userStore.setPic(res.data.data.pic)
  router.push('/')
}
</script>

<template>
  <div class="box">
    <div class="head" @click="router.back()">立即体验</div>
    <van-form :model="form" :rules="rules" class="form" ref="formRef">
      <van-cell-group inset style="background-color: rgba(255, 255, 255, 0.5)" class="cells">
        <van-field
          clearable="true"
          label-width="50px"
          class="cell"
          v-model="form.mobile"
          label="手机号"
          placeholder="请输入手机号"
          :rules="rules.mobile"
        >
        </van-field>
        <van-field
          clearable="true"
          label-width="50px"
          class="cell"
          v-model="form.code"
          label="验证码"
          placeholder="请输入6位验证码"
          :rules="rules.code"
        >
          <template #button>
            <span class="confirm" @click="confirm" ref="getRef" :class="{ active: form.mobile }"
              >获取验证码
            </span>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" class="btn" @click="login">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
.head {
  position: absolute;
  top: 10px;
  right: 20px;
  color: grey;
}

.cells {
  position: relative;
}
.cell {
  background-color: rgba(255, 255, 255, 0.5);
}
.box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: linear-gradient(125deg, skyblue, pink, #8fe6cb, rgb(157, 193, 223), #dfc2eb);
  background-size: 400%;
  animation: bgmove 17s infinite;
}
@keyframes bgmove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.form {
  margin-top: 300px;
  /* background-color: aqua; */
}
.btn {
  background-color: rgb(99, 210, 243);
  border: 0;
  height: 40px;
}

.active {
  color: rgb(79, 117, 241);
}
</style>
