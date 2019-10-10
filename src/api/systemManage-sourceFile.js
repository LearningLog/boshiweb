import request from '@/utils/request'
// 获取文件来源列表
export function source_file_list(data) {
  return request({
    url: '/sourceSystem/pageSourceSystem',
    method: 'post',
    data
  })
}
// 添加文件来源
export function source_file_add(data) {
  return request({
    url: '/sourceSystem/addSourceSystem',
    method: 'post',
    data
  })
}
// 修改文件来源
export function source_file_edit(data) {
  return request({
    url: '/sourceSystem/updateSourceSystem',
    method: 'post',
    data
  })
}
// 删除文件来源
export function source_file_delet(data) {
  return request({
    url: '/sourceSystem/deleteSourceSystem',
    method: 'post',
    data
  })
}
// 更改文件来源状态
export function source_file_status(data) {
  return request({
    url: '/sourceSystem/updateEnableStatus',
    method: 'post',
    data
  })
}
// 查看文件来源
