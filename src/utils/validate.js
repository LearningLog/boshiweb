/**
* @Author: YanHuaKang
* @Date: 2019/10/14
* @Description: 表单校验函数
* @remarks:
*/

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/**
 * @param {string} param
 * @returns {Boolean}
 */
export function regPhone(param) {
  const phone_pattern = /0?(13|14|15|17|18|19)[0-9]{9}/
  if (phone_pattern.test(param)) {
    return true
  } else {
    return false
  }
}
/**
 * @param {string} param
 * @returns {Boolean}
 */
export function regPwd(param) {
  const pwd_pattern = /^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,50}$/
  if (pwd_pattern.test(param)) {
    return true
  } else {
    return false
  }
}
/**
 * @str {string} str
 * @param {number} minLenth maxLength
 * @returns {Boolean}
 */
export function strLength(str, minLenth, maxLength) {
  if ((str.length > minLenth || str.length === minLenth) && (str.length < maxLength || str.length === maxLength)) {
    return true
  } else {
    return false
  }
}
/**
 * 租户管理员 2 到 64 位字母和数字的组合，不能连续11位数字
 * @param {string} param
 * @returns {Boolean}
 */
export function regUName(param) {
  const uName_phone = /\d{11}|\d{13}/
  const uName_pattern = /^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{2,64}$/
  if (!uName_phone.test(param) && uName_pattern.test(param)) {
    return true
  } else {
    return false
  }
}
/**
 * 校验正整数
 * @param val
 * @returns {string | *}
 */
export function validIntNum(val) {
  val = val === undefined ? '' : val
  val = val.toString()
  const reg = /^\d+$/
  if (!reg.test(val)) {
    val = val.replace(/[^\d]/g, '') // 清除数字以外的
    return val
  } else {
    return val
  }
}
