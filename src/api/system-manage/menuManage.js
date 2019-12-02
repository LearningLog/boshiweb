/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 菜单管理接口
* @remarks:
*/

import request from '@/utils/request'

// 获取左侧所有菜单
export function getAllMenuList() {
  return request({
    url: '/system/menuV2/findAllMenus',
    method: 'post',
    data: {}
  })
}
// 获取右侧菜单列表
export function findMenuList(data) {
  return request({
    url: '/system/menuV2/findMenuList',
    method: 'post',
    data
  })
}
// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menuV2/addmenu',
    method: 'post',
    data
  })
}
// 获取单个菜单数据
export function getMenu(data) {
  return request({
    url: '/system/menuV2/findMenuById',
    method: 'post',
    data
  })
}
// 编辑菜单
export function editMenu(data) {
  return request({
    url: '/system/menuV2/updatemenu',
    method: 'post',
    data
  })
}
// 删除菜单
export function delMenu(data) {
  return request({
    url: '/system/menuV2/deletemenu',
    method: 'post',
    data
  })
}
// 移动菜单
export function moveMenu(data) {
  return request({
    url: '/system/menuV2/updownmenu',
    method: 'post',
    data
  })
}
