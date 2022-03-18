import request from '@/utils/request'

export function getWorkOrderList(data) {
  return request({
    url: '/workOrder/list',
    method: 'post',
    data
  })
}
export function addWorkOrder(data) {
  return request({
    url: '/workOrder/add',
    method: 'post',
    data
  })
}
export function getWaitHandleWorkOrderList(data) {
  return request({
    url: '/workOrder/getWaitHandleWorkOrderList',
    method: 'post',
    data
  })
}
export function getMyWorkOrderList(data) {
  return request({
    url: '/workOrder/getMyWorkOrderList',
    method: 'post',
    data
  })
}

