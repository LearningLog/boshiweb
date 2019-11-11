/**
 * @Author: YanHuaKang
 * @Date: 2019/11/5
 * @Description: 工作台
 * @remarks:
 */
import request from '@/utils/request'

// 获取文件列表
export function fileListManage(data) {
  return request({
    url: 'workDeskFileList/fileListManage',
    method: 'post',
    data
  })
}
