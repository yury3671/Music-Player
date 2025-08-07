<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useAudioStore } from '@/stores'
const emit = defineEmits(['clickImg'])
const isLike = ref(false)
//点赞
const like = () => {
  isLike.value = !isLike.value
}
const props = defineProps({ info: Object, flag: Number, name: String })
const contentRef = ref(null)

const isFold = ref(false)
const isPack = ref(false)
onMounted(() => {
  isFold.value = contentRef.value.clientHeight > 76
})
const expand = () => {
  isFold.value = false
  isPack.value = true
}
const shrink = () => {
  isFold.value = true
  isPack.value = false
}
const replyName = ref('')
const transform = (content) => {
  if (props.flag) {
    const match = content.match(/(.*?)\/\/@([^:]+):/)
    if (match[2] !== props.name) {
      replyName.value = match[2]
    }

    return match[1]
  } else {
    return content
  }
}
</script>

<template>
  <div class="comment" :class="{ child: props.flag }">
    <div class="left">
      <van-image
        round
        :width="props.flag ? '30px' : '35px'"
        :height="props.flag ? '30px' : '35px'"
        :src="props.info.user_pic"
      />
    </div>
    <div class="right">
      <div class="head">
        <div class="name">{{ props.info.user_name }}</div>
      </div>
      <div :class="{ box: isFold }" ref="contentRef">
        <span v-if="props.flag && replyName">
          回复<span style="color: grey; margin-left: 3px"> {{ replyName }}</span
          >:
        </span>
        {{ transform(props.info.content) }}
      </div>
      <div class="fold" v-show="isFold" @click="expand">全文</div>
      <div class="fold" v-show="isPack" @click="shrink">收起</div>

      <van-image
        :width="props.info.images[0].width / 9"
        :height="props.info.images[0].height / 9"
        :src="props.info.images[0].url"
        v-if="props.info.images"
        radius="5"
        class="image"
        @click="emit('clickImg')"
      />

      <div class="bottom">
        <div>
          <span>{{ props.info.addtime.substring(0, 9) }} </span>
          <span v-if="props.info.location"> · </span>
          <span> {{ props.info.location }}</span>
        </div>
        <div>
          <van-icon
            name="good-job"
            size="17"
            :color="isLike ? 'rgb(241, 79, 79)' : '#bebbbb'"
            @click="like"
          />
          <span>{{ props.info.like.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.right {
  width: 100%;
}
hr {
  width: 30px;
  display: inline-block;
  border: 0;
  border-top: 1px solid rgb(219, 214, 214);
  margin-right: 5px;
}
.img {
  position: absolute;
  width: 100%;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: black;
}
.fold {
  color: rgb(16, 82, 168);
  text-align: end;
}
.box {
  overflow: hidden;
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-line-clamp: 4; /* 行数，值可以改，表示展示X行后多余的缩略展示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  word-break: break-all;
}
.image {
  margin-top: 5px;
}
.head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.child {
  margin-left: 40px;
}
.comment {
  padding: 10px 15px;
  /* width: 80%; */
  font-size: 14px;
  display: flex;
  gap: 10px;
}

.name {
  height: 30px;
  line-height: 30px;
}
.bottom {
  margin-top: 5px;
  font-size: 12px;
  color: grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
