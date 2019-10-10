import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/system/user/onloadByUser',
    method: 'post',
    data: {}
  })
}

export function getMenuList() {
  return request({
    url: '/system/menuV2/initmenu',
    method: 'post',
    data: {}
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
