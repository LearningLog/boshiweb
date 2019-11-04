/**
* @Author: YanHuaKang
* @Date: 2019/11/4
* @Description: 用户管理
* @remarks:
*/
import request from '@/utils/request'

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/system/user/listUserV2',
    method: 'post',
    data
  })
}
