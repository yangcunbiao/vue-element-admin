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

export function getRepairman(username) {
  return request({
    url: '/user/getRepairman',
    method: 'get',
    params: { userName: username }
  })
}

export function getUserList(data) {
  return request({
    url: '/user/getUserList',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

export function checkAccount(account) {
  return request({
    url: '/user/checkAccount',
    method: 'get',
    params: { account: account }
  })
}
