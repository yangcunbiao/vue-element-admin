import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/model/list',
    method: 'post',
    data
  })
}
