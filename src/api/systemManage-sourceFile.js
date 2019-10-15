/**
 * @Author: WangLiMei
 * @Date: 2019/10/14
 * @Description: 文件来源的所有接口
 * @remarks:
 */
import request from '@/utils/request'
// 文件来源列表
export function source_file_list(data) {
  return request({
    url: '/sourceSystem/pageSourceSystem',
    method: 'post',
    data
  })
}
// 文件来源添加
export function source_file_add(data) {
  return request({
    url: '/sourceSystem/addSourceSystem',
    method: 'post',
    data
  })
}
// 文件来源修改
export function source_file_edit(data) {
  return request({
    url: '/sourceSystem/updateSourceSystem',
    method: 'post',
    data
  })
}
// 文件来源删除
export function source_file_delet(data) {
  return request({
    url: '/sourceSystem/deleteSourceSystem',
    method: 'post',
    data
  })
}
// 文件来源更改状态
export function source_file_status(data) {
  return request({
    url: '/sourceSystem/updateEnableStatus',
    method: 'post',
    data
  })
}

