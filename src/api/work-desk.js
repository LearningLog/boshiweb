/**
 * @Author: YanHuaKang
 * @Date: 2019/11/5
 * @Description: 工作台
 * @remarks:
 */
import request from '@/utils/request'

// 获取文件列表
export function fileList(data) {
  return request({
    url: 'workDeskFileList/fileList',
    method: 'post',
    data
  })
}
