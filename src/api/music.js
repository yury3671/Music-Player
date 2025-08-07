import request from '@/utils/request'
//获取音乐相关信息
export const musicInfo = (hash) => {
  return request.post(`/audio?hash=${hash}`)
}
//获取音乐详情
export const detailInfo = (hash) => {
  return request.post(`/privilege/lite?hash=${hash}`)
}
//获取用户听歌历史
export const historySongs = (page) => {
  return request.post(`/user/history?page=${page}`)
}
//获取歌单所有歌曲
export const songsGet = (id, page) => {
  return request.post(`/playlist/track/all?id=${id}&page=${page}`)
}
//获取音乐URL
export const songUrl = (hash) => {
  return request.post(`/song/url?hash=${hash}&free_part=true`)
}
//获取音乐收藏数
export const favoriteCount = (mixsongids) => {
  return request.post(`/favorite/count?mixsongids=${mixsongids}`)
}
//获取音乐评论数
export const commentCount = (hash) => {
  return request.post(`/comment/count?hash=${hash}`)
}
//获取音乐评论
export const commentMusic = (mixsongids) => {
  return request.post(`/comment/music?mixsongid=${mixsongids}`)
}
//歌词搜索
export const lyricSearch = (hash) => {
  return request.post(`/search/lyric?hash=${hash}`)
}
//获取歌词
export const lyricGet = (id, accesskey) => {
  return request.post(`/lyric?id=${id}&accesskey=${accesskey}&fmt=krc&decode=true`)
}
//获取歌手单曲
export const artistSongs = (id) => {
  return request.post(`/artist/audios?id=${id}`)
}

//获取歌手图片
export const artistImage = (hash) => {
  return request.post(`/images/audio?hash=${hash}`)
}
//获取歌曲评论
export const musicComment = (mixsongid, page) => {
  return request.post(`/comment/music?mixsongid=${mixsongid}&page=${page}`)
}
//获取楼层评论
export const floorComment = (special_id, mixsongid, tid, page, pagesize) => {
  return request.post(
    `/comment/floor?special_id=${special_id}&mixsongid=${mixsongid}&tid=${tid}&page=${page}&pagesize=${pagesize}`,
  )
}
//获取音乐高潮时间
export const songClimax = (hash) => {
  return request.post(`/song/climax?hash=${hash}`)
}
//获取歌曲MV
export const audioMv = (mixsongid) => {
  return request.post(`/kmr/audio/mv?album_audio_id=${mixsongid}`)
}
//获取视频详情
export const videoDetail = (id) => {
  return request.post(`/video/detail?id=${id}`)
}
//获取视频url
export const videoUrl = (hash) => {
  return request.post(`/video/url?hash=${hash}`)
}
