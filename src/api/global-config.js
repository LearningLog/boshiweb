/**
 * Created by laixiangran on 2019/11/8.
 * homepage：http://www.laixiangran.cn.
 */
/**
 * @Author: liziwei
 * @Date: 2019/11/8
 * @Description: global配置接口
 * @remarks:
 */

import request from '@/utils/request'

// 获取右侧菜单列表
export function findTheUseConfig(data) {
  return request({
    url: 'system/globalConfig/findTheUseConfig',
    method: 'post',
    data
  })
}
// 新增菜单
export function setConfigValue(data) {
  return request({
    url: 'system/globalConfig/setConfigValue',
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
