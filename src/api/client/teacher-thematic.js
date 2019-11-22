/**
 * @Author: YanHuaKang
 * @Date: 2019/11/20
 * @Description: 老师端专题
 * @remarks:
 */

import request from '@/utils/request'

// 课堂信息
export function findLessonDetailById(data) {
  return request({
    url: 'api/cr/lesson/findLessonDetailById/' + data.id,
    method: 'post',
    data: ''
  })
}
