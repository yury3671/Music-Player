import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://localhost:3000/'
const instance = axios.create({
  baseURL, //基地址
  timeout: 10000, //超时时间
  withCredentials: true,
})

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  function (res) {
    //处理业务成功
    // 业务失败
    // ElMessage.error(res.data.message || '服务器异常')
    return res
  },
  function (err) {
    //特殊（401） => 权限不足或token过期
    if (err.response?.status === 401) {
      router.push('/login')
    }
    //默认错误提示
    // ElMessage.error(err.response.data.message || '服务器异常')
    ElMessage.error('服务器异常')
    return Promise.reject(err)
  },
)
export default instance //默认导出
export { baseURL } //按需导出
