import request from '@/utils/request'

export function getFitnessEquipmentList(data) {
  return request({
    url: '/ycb/fitnessEquipment/list',
    method: 'post',
    data
  })
}

export function addFitnessEquipment(data) {
  return request({
    url: '/ycb/fitnessEquipment/add',
    method: 'post',
    data
  })
}

export function updateFitnessEquipment(data) {
  return request({
    url: '/ycb/fitnessEquipment/update',
    method: 'post',
    data
  })
}

export function getFitnessEquipmentDetail(data) {
  return request({
    url: '/ycb/fitnessEquipment/getDetail/' + data,
    method: 'get'
  })
}

export function deleteFitnessEquipment(data) {
  return request({
    url: '/ycb/fitnessEquipment/delete/' + data,
    method: 'get'
  })
}
