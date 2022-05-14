import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/ycb/sys/login',
    method: 'post',
    data
  })
}

export function getCheckCodePicture(key) {
  return request({
    url: '/ycb/sys/randomImage/' + key,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/ycb/sys/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/ycb/sys/logout',
    method: 'post'
  })
}

export function getRepairman(username) {
  return request({
    url: '/ycb/user/getRepairman',
    method: 'get',
    params: { userName: username }
  })
}

export function getUserList(data) {
  return request({
    url: '/ycb/user/getUserList',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/ycb/user/addUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/ycb/user/updateUser',
    method: 'post',
    data
  })
}

export function checkAccount(account) {
  return request({
    url: '/ycb/user/checkAccount',
    method: 'get',
    params: { account: account }
  })
}

export function getProperty(username) {
  return request({
    url: '/ycb/user/getProperty',
    method: 'get',
    params: { userName: username }
  })
}
