import request from '@/utils/request'

export function getAllTenantList(data) {
  return request({
    url: '/system/customV2/findCustomList',
    method: 'post',
    data
  })
}

export function addTenant(data) {
  return request({
    url: '/system/customV2/addcustom',
    method: 'post',
    data
  })
}

export function getOneTenant(data) {
  return request({
    url: '/system/customV2/findCustomById',
    method: 'post',
    data
  })
}

export function editTenant(data) {
  return request({
    url: '/system/customV2/updatecustom',
    method: 'post',
    data
  })
}

export function delTenant(data) {
  return request({
    url: '/system/customV2/deletecustom',
    method: 'post',
    data
  })
}

export function batchDelTenant(data) {
  return request({
    url: '/system/customV2/deletecustom',
    method: 'post',
    data
  })
}

export function getInformationList(data) {
  return request({
    url: 'system/newscategory/all',
    method: 'post',
    data
  })
}

export function setInformation(data) {
  return request({
    url: 'system/custom/saveCustomCategory',
    method: 'post',
    data
  })
}
