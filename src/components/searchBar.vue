<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchSuggest, searchDefault } from '@/api/search'
import { useHistoryStore } from '@/stores'

const historyStore = useHistoryStore()
const router = useRouter()
const defaultKey = ref('')
//父传子
const props = defineProps({
  content: String,
})
const content = ref(props.content ? props.content : '')

onMounted(async () => {
  // const res = await searchDefault()
  // defaultKey.value = res.data.data.fallback[0].main_title
})
const suggestList = ref([])

//子传父
const emit = defineEmits(['hide', 'show'])
const isShow = ref(false)
//搜索建议
const suggest = async () => {
  if (content.value) {
    isShow.value = true
    emit('hide')
    const res = await searchSuggest(content.value)
    suggestList.value = res.data.data[0].RecordDatas
  } else {
    emit('show')
    router.push('/search')
  }
}
//点击搜索

const onClickButton = () => {
  if (!content.value) {
    content.value = defaultKey.value
  }
  if (content.value) {
    if (!historyStore.list.find((item) => item === content.value)) {
      historyStore.add(content.value)
    }
    router.push(`/results/${content.value}`)
    isShow.value = false
    emit('show')
  }
}

const setContent = (key) => {
  content.value = key
  onClickButton()
}
defineExpose({ setContent })
</script>

<template>
  <div class="search">
    <van-search
      v-model="content"
      show-action
      placeholder="请输入搜索关键词"
      shape="round"
      clearable
      autofocus
      @search="onClickButton"
      @update:model-value="suggest"
      @focus="suggest"
    >
      <template #action>
        <div @click="onClickButton">搜索</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" class="back" @click="router.back()" />
      </template>
    </van-search>
    <div class="suggest" v-show="content && isShow">
      <div
        class="key"
        v-for="item in suggestList"
        :key="item.HintInfo"
        @click="setContent(item.HintInfo)"
      >
        <van-icon name="search" />

        <van-highlight
          :keywords="item.HintInfo.includes(content) ? content : ''"
          :source-string="item.HintInfo"
          class="word"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep .van-search {
  /* position: relative !important; */
  z-index: 100 !important;
}
.back {
  margin-right: 5px;
}
.search {
  background-color: rgb(227, 238, 243);
}
.van-search {
  background-color: rgb(227, 238, 243);
  position: fixed;
  top: 0;
  width: 100%;
}
.suggest {
  min-height: 613px;
  margin-top: 54px;
  padding: 0 15px;
}
.key {
  line-height: 40px;
}
.word {
  margin-left: 10px;
  display: inline;
}
</style>
