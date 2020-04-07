import axios from 'axios'
import { local_get, es_get } from './store'

const baseURL = '/api'

export default (needLogin, config) => {
  let option = {
    baseURL, //设置默认api路径
    timeout: 6000, //设置超时时间
    transformResponse: [ function(data) {
      const res = JSON.parse(data)
      const { state } = res
      if (state === 1004) {
        location.href = '/'
      }
      return res
    } ],
  }
  let header = config
  let token = null
  if (needLogin) {
    token = local_get('access_token')
    if (token) {
      header = Object.assign({}, header, {
        authorization: `Bearer ${token}`
      })
    }
  }
  const csrftoken = es_get('csrfToken')
  header = Object.assign({}, header, {
    'x-csrf-token': csrftoken
  })
  option.headers = header
  return axios.create(option)
}
