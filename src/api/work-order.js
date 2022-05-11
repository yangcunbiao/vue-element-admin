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

export function finishWorkOrderAndDamage(data) {
  return request({
    url: '/workOrder/finishAndDamage/' + data,
    method: 'get'
  })
}

export function quotation(data) {
  return request({
    url: '/workOrder/quotation',
    method: 'post',
    data
  })
}

export function financeCheck(data) {
  return request({
    url: '/workOrder/financeCheck/' + data,
    method: 'get'
  })
}

export function repaired(data) {
  return request({
    url: '/workOrder/repaired/' + data,
    method: 'get'
  })
}
