import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getCheckCodePicture(key) {
  return request({
    url: '/sys/randomImage/' + key,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/sys/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
