import request from '@/utils/request'

export function getFitnessEquipmentList(data) {
  return request({
    url: '/fitnessEquipment/list',
    method: 'post',
    data
  })
}

export function addFitnessEquipment(data) {
  return request({
    url: '/fitnessEquipment/add',
    method: 'post',
    data
  })
}

export function updateFitnessEquipment(data) {
  return request({
    url: '/fitnessEquipment/update',
    method: 'post',
    data
  })
}
