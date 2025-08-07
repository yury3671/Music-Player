import request from '@/utils/request'
//获取热搜列表
export const searchHot = () => {
  return request.post('/search/hot')
}
//默认搜索关键词
export const searchDefault = () => {
  return request.post('/search/default')
}
//搜索建议
export const searchSuggest = (key) => {
  return request.post(`/search/suggest?keywords=${key}`)
}
//搜索
export const search = (key, page) => {
  return request.post(`/search?keywords=${key}&page=${page}`)
}
//综合搜索
export const searchComplex = (key) => {
  return request.post(`/search/complex?keywords=${key}`)
}
//歌词搜索
export const searchLyric = (key) => {
  return request.post(`/search/lyric?keywords=${key}`)
}
