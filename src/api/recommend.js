import request from '@/utils/request'
//每日推荐
export const dayRecommend = () => {
  return request.post('/everyday/recommend')
}
//风格推荐
export const styleRecommend = () => {
  return request.post('/everyday/style/recommend')
}
//猜你喜欢
export const personalFm = () => {
  return request.post('personal/fm')
}

//新歌速递
export const newSong = () => {
  return request.post('/top/song')
}
//歌曲推荐
export const songRecommend = (card_id) => {
  return request.post(`/top/card?card_id=${card_id}`)
}
