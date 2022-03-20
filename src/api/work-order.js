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
export function getWorkOrderDetail(data) {
  return request({
    url: '/workOrder/getDetail/' + data,
    method: 'get'
  })
}
export function checkWorkOrder(data) {
  return request({
    url: '/workOrder/check',
    method: 'post',
    data
  })
}
export function finishWorkOrder(data) {
  return request({
    url: '/workOrder/finish/' + data,
    method: 'get'
  })
}
