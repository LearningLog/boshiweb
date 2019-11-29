/**
 * @Author: LiuYouyu
 * @Date: 2019/11/24
 * @Description: 知识库-企业知识库接口
 * @remarks:
 */
import request from '@/utils/request'

// 所属租户列表
export function getCustomManageList() {
  return request({
    url: '/system/customV2/getCustomManageList',
    method: 'post',
    data: {}
  })
}

// 知识库目录列表
export function listDirFile(data) {
  return request({
    url: '/knowledgeDirFile/listDirFile',
    method: 'post',
    data
  })
}
// 知识库目录列表
export function updateDir(data) {
  return request({
    url: '/knowledgeDirFile/updateDir',
    method: 'post',
    data
  })
}

// 获取知识分类树
export function getCompanyAllTree(data) {
  return request({
    url: '/classifyTree/getCompanyAllTree',
    method: 'post',
    data
  })
}
// 加入知识分类
export function classifyFiles(data) {
  return request({
    url: '/knowledgeDirFile/classify',
    method: 'post',
    data
  })
}
// 删除文件夹
export function deleteDirFile(data) {
  return request({
    url: 'knowledgeDirFile/deleteDirFile',
    method: 'post',
    data
  })
}
// 创建文件夹
export function createDirFile(data) {
  return request({
    url: 'knowledgeDirFile/createDir',
    method: 'post',
    data
  })
}

// 收藏到工作台
export function shareFileToWorkDesk(data) {
  return request({
    url: 'knowledgeDirFile/shareFileToWorkDesk',
    method: 'post',
    data
  })
}

// 获取下载token信息
export function getDownloadToken(data) {
  return request({
    url: 'api/knowledgeDirFile/getToken',
    method: 'post',
    data
  })
}

// 获取租户所有树并按每层节点名聚合
export function getCompanyAllTreeFloorByName(data) {
  return request({
    url: '/classifyTree/getCompanyAllTreeFloorByName',
    method: 'post',
    data
  })
}
