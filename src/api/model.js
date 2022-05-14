import request from '@/utils/request'

export function getModelList(data) {
  return request({
    url: '/ycb/model/list',
    method: 'post',
    data
  })
}

export function updateModel(data) {
  return request({
    url: '/ycb/model/update',
    method: 'post',
    data
  })
}

export function addModel(data) {
  return request({
    url: '/ycb/model/add',
    method: 'post',
    data
  })
}

export function deleteModel(data) {
  return request({
    url: '/ycb/model/delete/' + data,
    method: 'get'
  })
}

export function getRecommendModel(data) {
  return request({
    url: '/ycb/model/getRecommendModel/' + data.id,
    method: 'get',
    params: { pageNum: data.pageNum, pageSize: data.pageSize }
  })
}
