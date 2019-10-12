import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/system/file/upload/',
    method: 'post',
    // contentType: false,
    // processData: false,
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
