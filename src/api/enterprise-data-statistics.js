/**
* @Author: YanHuaKang
* @Date: 2019/10/15
* @Description: 企业数据接口
* @remarks:
*/

import request from '@/utils/request'

// 获取企业数据统计列表
export function getEnterpriseList(data) {
  return request({
    url: '/companyManageStatisticsData/customListStatisticsData',
    method: 'post',
    data
  })
}

