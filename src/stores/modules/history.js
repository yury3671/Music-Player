import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useHistoryStore = defineStore(
  'history',
  () => {
    const list = ref([])
    const add = (key) => {
      list.value.unshift(key)
    }
    const del = (index) => {
      list.value.splice(index, 1)
    }
    const delAll = () => {
      list.value = []
    }
    // 修正返回，直接返回对象，持久化配置作为第三个参数（可选）
    return {
      list,
      add,
      del,
      delAll,
    }
  },
  {
    persist: true, // 持久化配置放在 defineStore 第三个参数
  },
)
