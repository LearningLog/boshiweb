import request from '@/utils/request'

export function getCustomResourceList(data) {
  return request({
    url: '/system/customResource/findCustomResourceList',
    method: 'post',
    data
  })
}

export function getCustomResourceDetail(data) {
  return request({
    url: '/system/customResource/getCustomResourceById',
    method: 'post',
    data
  })
}

export function editCustomResource(data) {
  return request({
    url: '/system/customResource/getCustomResourceById',
    method: 'post',
    data
  })
}
