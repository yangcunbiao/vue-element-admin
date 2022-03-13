import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/community/list',
    method: 'post',
    data
  })
}

export function addCommunity(data) {
  return request({
    url: '/community/add',
    method: 'post',
    data
  })
}

export function updateCommunity(data) {
  return request({
    url: '/community/update',
    method: 'post',
    data
  })
}

export function deleteCommunity(data) {
  return request({
    url: '/community/delete/' + data,
    method: 'get'
  })
}
