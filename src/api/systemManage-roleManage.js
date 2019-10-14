/**
 * @Author: WangLiMei
 * @Date: 2019/10/14
 * @Description: 角色管理的所有接口
 * @remarks:
 */
import request from '@/utils/request'
// 获取列表
export function role_list(data) {
  return request({
    url: '/system/roleV2/findRoleList',
    method: 'post',
    data
  })
}
// 添加
export function role_add(data) {
  return request({
    url: '/system/roleV2/addrole',
    method: 'post',
    data
  })
}
// 修改
export function role_edit(data) {
  return request({
    url: '/system/roleV2/upateRole',
    method: 'post',
    data
  })
}
// 删除
export function role_delet(data) {
  return request({
    url: '/system/roleV2/deleterole',
    method: 'post',
    data
  })
}
// 企业列表
export function role_gr_list(data) {
  return request({
    url: '/system/roleV2/saveMenu',
    method: 'post',
    data
  })
}
// 角色授权
export function role_auth(data) {
  return request({
    url: '/system/roleV2/saveMenu',
    method: 'post',
    data
  })
}
// 设置默认角色
export function defalt_role_set(data) {
  return request({
    url: '/system/roleV2/updateDefaultRole',
    method: 'post',
    data
  })
}
// 默认角色列表
export function defalt_role_list(data) {
  return request({
    url: '/system/roleV2/getDefaultRole',
    method: 'post',
    data
  })
}

// 角色授权菜单权限树
export function role_tree(data) {
  return request({
    url: '/system/roleV2/findAllMenus',
    method: 'post',
    data
  })
}
