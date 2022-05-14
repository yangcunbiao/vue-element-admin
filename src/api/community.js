import request from '@/utils/request'

export function getCommunityList(data) {
  return request({
    url: '/ycb/community/list',
    method: 'post',
    data
  })
}

export function addCommunity(data) {
  return request({
    url: '/ycb/community/add',
    method: 'post',
    data
  })
}

export function updateCommunity(data) {
  return request({
    url: '/ycb/community/update',
    method: 'post',
    data
  })
}

export function deleteCommunity(data) {
  return request({
    url: '/ycb/community/delete/' + data,
    method: 'get'
  })
}
