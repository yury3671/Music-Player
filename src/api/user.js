import request from '@/utils/request'
//登录
export const userLogin = ({ mobile, code }) => {
  return request.post(`/login/cellphone?mobile=${mobile}&code=${code}`)
}
//发送验证码
export const codeSend = (mobile) => {
  return request.post(`/captcha/sent?mobile=${mobile}`)
}
export const userSong = () => {
  return request.post('/user/playlist')
}
