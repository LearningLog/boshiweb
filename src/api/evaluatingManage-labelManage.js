/**
* @Author: JiMei
* @Date: 2019/11/5
* @Description: 标签管理接口
* @remarks:
*/

import request from '@/utils/request'

// 获取分组列表
export function getLabelList(data) {
  return request({
    url: '/evaluation/label/listV2',
    method: 'post',
    data
  })
}

// 获取标签列表，不分组
export function labelAllList(data) {
  return request({
    url: '/evaluation/automatic/labelList',
    method: 'post',
    data
  })
}
