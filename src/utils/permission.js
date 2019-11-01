/**
* @Author: YanHuaKang
* @Date: 2019/11/1
* @Description: 按钮权限
* @remarks:
*/
import store from '@/store'

/**
 * 获取管理小组，判断是否为当前小组管理者
 * @param egroup     Number、String、Array、Array.ioin()   小组id
 * @returns {boolean}
 */
export function isCurrentEgroupManager(egroup) {
  var dataType = Object.prototype.toString.call(egroup)
  if (dataType === '[object String]' || dataType === '[object Number]') {
    egroup = egroup + ''
    if (egroup.indexOf(',') > -1) {
      egroup = egroup.split(',')
    } else {
      egroup = [egroup + '']
    }
  } else {
    egroup = []
  }
  const allEgroup = store.state.egroup.allEgroup || []
  for (var i = 0; i < egroup.length; i++) {
    if (allEgroup.findIndex(value => { return (value.inc + '') === egroup[i] }) > -1) {
      return true
    }
  }
  return false
}

/**
 * 判断当前按钮是否有权限
 * @param permissionCode           String     按钮权限code
 * @param isCurrentEgroupManager   Boolean    是否是小组管理者
 * @returns {boolean}
 */
export function hasThisBtnPermission(permissionCode, isCurrentEgroupManager) {
  const userPermission = store.state.permission.userPermission
  const allPermissionCode = store.state.permission.allPermissionCode
  const userPermissionDetailList = store.state.permission.userPermissionDetailList
  // const isGroupNamage = false
  debugger
  if (userPermission.isAdmin1 || isCurrentEgroupManager) { // 判断数据库是否设置了当前权限code，如果没有设置则表示当前按钮没有设置特定权限
    return true
  } else {
    if ((allPermissionCode.indexOf(permissionCode) > -1)) {
      const index = userPermissionDetailList.findIndex(value => { return (value.manageType + '') === userPermission.manageType })
      if (index > -1 && permissionCode === userPermissionDetailList[index].permissioncode) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
}
