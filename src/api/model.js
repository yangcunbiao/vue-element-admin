import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/model/list',
    method: 'post',
    data
  })
}

export function updateModel(data) {
  return request({
    url: '/model/update',
    method: 'post',
    data
  })
}

export function addModel(data) {
  return request({
    url: '/model/add',
    method: 'post',
    data
  })
}

export function deleteModel(data) {
  return request({
    url: '/model/delete/' + data,
    method: 'get'
  })
}
