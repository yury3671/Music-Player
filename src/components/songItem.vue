<script setup>
const props = defineProps({ song: Object })
console.log(props.song.name)
const [artist, title] = props.song.name
  ? props.song.name.split(' - ').map((item) => item.trim())
  : ['', '']
</script>

<template>
  <div class="song">
    <div class="num">1</div>
    <div class="info">
      <div>{{ title }}</div>
      <div class="name">{{ artist }}</div>
    </div>
    <van-icon name="play-circle-o" />
  </div>
</template>

<style scoped>
.song {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* background-color: aqua; */
  padding: 10px 20px;
}
.song:hover {
  background-color: #eee;
}
.info {
  /* background-color: aqua; */
  width: 270px;
}
.name {
  margin-top: 5px;
  font-size: 12px;
  color: grey;
}
</style>
