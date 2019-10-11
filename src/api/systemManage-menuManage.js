import request from '@/utils/request'

export function getAllMenuList() {
  return request({
    url: '/system/menuV2/findAllMenus',
    method: 'post',
    data: {}
  })
}

export function findMenuList(data) {
  return request({
    url: '/system/menuV2/findMenuList',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/system/menuV2/addmenu',
    method: 'post',
    data
  })
}

export function getMenu(data) {
  return request({
    url: '/system/menuV2/findMenuById',
    method: 'post',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/system/menuV2/updatemenu',
    method: 'post',
    data
  })
}

export function delMenu(data) {
  return request({
    url: '/system/menuV2/deletemenu',
    method: 'post',
    data
  })
}
