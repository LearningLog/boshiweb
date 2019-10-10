import request from '@/utils/request'
// 列表
export function source_file_list(data) {
  return request({
    url: '/sourceSystem/pageSourceSystem',
    method: 'post',
    data
  })
}
// 添加
export function source_file_add(data) {
  return request({
    url: '/sourceSystem/addSourceSystem',
    method: 'post',
    data
  })
}
// 修改
export function source_file_edit(data) {
  return request({
    url: '/sourceSystem/updateSourceSystem',
    method: 'post',
    data
  })
}
// 删除
export function source_file_delet(data) {
  return request({
    url: '/sourceSystem/deleteSourceSystem',
    method: 'post',
    data
  })
}
// 更改
export function source_file_status(data) {
  return request({
    url: '/sourceSystem/updateEnableStatus',
    method: 'post',
    data
  })
}
