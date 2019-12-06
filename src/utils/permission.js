/**
 * @Author: YanHuaKang
 * @Date: 2019/11/1
 * @Description: 按钮权限
 * @remarks:
 */
import store from '@/store'

const userPermission = store.state.permission.userPermission
const allPermissionCodeSet = store.state.permission.allPermissionCodeSet
const userPermissionDetai = store.state.permission.userPermissionDetai
const userId = store.state.user.userSystemInfo.userInfo._id

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
  } else if (dataType === '[object Array]') {
    egroup = [...egroup]
  } else {
    egroup = []
  }
  const manageEgroupInfo = store.state.user.manageEgroupInfo || []
  for (var i = 0; i < egroup.length; i++) {
    var has = manageEgroupInfo[egroup[i]]
    if (has) {
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
export function hasThisBtnPermission(permissionCode, isCurrentEgroupManager, rowUserId) {
  if (userPermission.isAdmin || isCurrentEgroupManager || userId === rowUserId) {
    // 判断数据库是否设置了当前权限code，如果没有设置则表示当前按钮没有设置特定权限
    return true
  } else {
    if (allPermissionCodeSet.has(permissionCode)) {
      // 查看数据库是否设置了该按钮权限，没有设置则代表该按钮不需要控制
      var hasCodePermission =
        permissionCode in userPermissionDetai
          ? userPermissionDetai[permissionCode]
          : null // 查看当前登录人是否拥有该按钮权限
      if (hasCodePermission) {
        if (hasCodePermission.permissionmanage === 3) {
          // 查看该按钮是否需要权限
          return true
        } else {
          if (userPermission.manageType <= hasCodePermission.permissionmanage) {
            return true
          } else {
            return false
          }
        }
      } else {
        return false
      }
    } else {
      return true
    }
  }
}
