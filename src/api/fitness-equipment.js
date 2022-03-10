import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/fitnessEquipment/list',
    method: 'post',
    data
  })
}
