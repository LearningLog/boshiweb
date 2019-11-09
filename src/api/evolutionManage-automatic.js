/**
* @Author: zhaoxiaoke
* @Date: 2019/11/09
* @Description: 考试管理接口
* @remarks:
*/

import request from '@/utils/request'

// 获取自动发布考试列表数据
export function getAutomaticList(data) {
  return request({
    url: '/evaluation/automatic/listV2',
    method: 'post',
    data
  })
}

// 删除自动发布考试接口
export function delAuto(data) {
  return request({
    url: '/evaluation/automatic/del',
    method: 'post',
    data
  })
}

