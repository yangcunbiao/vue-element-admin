import request from '@/utils/request'

export function getFitnessEquipmentList(data) {
  return request({
    url: '/fitnessEquipment/list',
    method: 'post',
    data
  })
}
