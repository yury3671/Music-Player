import request from '@/utils/request'

//排行榜推荐
export const rankRecommend = () => {
  return request.post('/rank/top')
}
//排行列表
export const rankList = () => {
  return request.post('/rank/list')
}
