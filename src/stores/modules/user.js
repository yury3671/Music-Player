import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const name = ref('')
    const pic = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const setName = (newName) => {
      name.value = newName
    }
    const setPic = (newPic) => {
      pic.value = newPic
    }
    // 修正返回，直接返回对象，持久化配置作为第三个参数（可选）
    return {
      token,
      setToken,
      name,
      setName,
      pic,
      setPic,
    }
  },
  {
    persist: true, // 持久化配置放在 defineStore 第三个参数
  },
)
